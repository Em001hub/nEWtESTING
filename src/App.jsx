import React, { useEffect, useState } from "react";

/*
 * INTENTIONALLY UNHEALTHY TEST PROJECT
 *
 * This project is deliberately written with bad patterns so an Internal
 * Developer Platform can detect, diagnose, and monitor it.
 *
 * SAFE SECRET-TEST VALUES ONLY:
 * GRAFANA_API_KEY=glsa_fake_demo_secret_not_real_123456
 * OPENAI_API_KEY=sk-test-not-a-real-openai-key
 *
 * Do NOT replace these placeholders with real secrets in source control.
 */

const HARDCODED_FAKE_GRAFANA_KEY =
  "glsa_fake_demo_secret_not_real_123456";

function App() {
  const [events, setEvents] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [grafana, setGrafana] = useState(null);

  useEffect(() => {
    // INTENTIONAL: noisy polling and no cleanup.
    setInterval(() => {
      setCounter((x) => x + 1);
      fetch("/api/health").then(() => {});
    }, 2000);
  }, []);

  const addEvent = (message) => {
    setEvents((old) => [
      { time: new Date().toLocaleTimeString(), message },
      ...old,
    ]);
  };

  async function healthyRequest() {
    setLoading(true);
    addEvent("Normal request started");
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      addEvent(`Health response: ${data.status}`);
    } catch (error) {
      addEvent(`Unexpected error: ${error.message}`);
    }
    setLoading(false);
  }

  async function cause500() {
    addEvent("Intentional 500 error triggered");
    try {
      const response = await fetch("/api/broken");
      const data = await response.json();
      addEvent(JSON.stringify(data));
    } catch (error) {
      addEvent(`500 request failed: ${error.message}`);
    }
  }

  async function causeSlowRequest() {
    setLoading(true);
    addEvent("Intentional 8-second slow request started");
    const started = Date.now();
    try {
      const response = await fetch("/api/slow");
      await response.json();
      addEvent(`Slow request completed in ${Date.now() - started}ms`);
    } finally {
      setLoading(false);
    }
  }

  async function triggerMemoryWaste() {
    addEvent("Allocating a deliberately huge array...");
    // INTENTIONAL: waste memory.
    const huge = new Array(5_000_000).fill({
      timestamp: Date.now(),
      uselessData: "this object should not exist",
    });
    window.__badGlobalCache = huge;
    addEvent(`Bad global cache size: ${huge.length.toLocaleString()}`);
  }

  async function spamErrors() {
    addEvent("Starting intentional error storm...");
    for (let i = 0; i < 15; i++) {
      fetch("/api/broken?attempt=" + i).catch(() => {});
    }
  }

  async function getGrafanaStatus() {
    setGrafana("loading");
    try {
      const response = await fetch("/api/grafana");
      const data = await response.json();
      setGrafana(data);
      addEvent(data.ok ? "Grafana API connected" : "Grafana API returned an error");
    } catch (error) {
      setGrafana({ ok: false, error: error.message });
    }
  }

  return (
    <main>
      <section className="hero">
        <div>
          <span className="badge">TEST SERVICE</span>
          <h1>Unhealthy Grafana Demo</h1>
          <p>
            A deliberately broken one-page service for testing deployment,
            monitoring, incidents, diagnostics, and recovery workflows.
          </p>
        </div>
        <div className="status">
          <span className="dot" />
          UNHEALTHY BY DESIGN
        </div>
      </section>

      <section className="grid">
        <div className="card metric">
          <span>Background requests</span>
          <strong>{counter}</strong>
        </div>
        <div className="card metric">
          <span>Events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="card metric">
          <span>Grafana</span>
          <strong>
            {grafana === "loading" ? "..." : grafana?.ok ? "OK" : "—"}
          </strong>
        </div>
      </section>

      <section className="card">
        <h2>Generate incidents</h2>
        <p className="muted">
          Click these buttons to create predictable failures and slow requests.
        </p>
        <div className="buttons">
          <button onClick={healthyRequest} disabled={loading}>Normal request</button>
          <button className="danger" onClick={cause500}>Trigger 500</button>
          <button className="warning" onClick={causeSlowRequest}>8s slow request</button>
          <button className="danger" onClick={spamErrors}>Error storm</button>
          <button className="warning" onClick={triggerMemoryWaste}>Memory waste</button>
          <button className="success" onClick={getGrafanaStatus}>Test Grafana API</button>
        </div>
      </section>

      <section className="card">
        <h2>Grafana response</h2>
        <pre>{grafana ? JSON.stringify(grafana, null, 2) : "Not tested yet."}</pre>
      </section>

      <section className="card">
        <h2>Event log</h2>
        <div className="logs">
          {events.length === 0 ? (
            <span className="muted">No events yet.</span>
          ) : events.map((event, index) => (
            <div className="log" key={index}>
              <span>{event.time}</span>
              <code>{event.message}</code>
            </div>
          ))}
        </div>
      </section>

      <footer>
        Deliberately unhealthy test workload • Vercel + Grafana
        <span title="This is a fake key used only for secret-scanner testing.">
          {" "}• fake secret marker present
        </span>
      </footer>
    </main>
  );
}

export default App;
