import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const ECONOMIC_DATA = [
  { month: "Jan 2023", inflation: 6.4, unemployment: 3.4, interest: 4.58 },
  { month: "Feb 2023", inflation: 6.0, unemployment: 3.6, interest: 4.67 },
  { month: "Mar 2023", inflation: 5.0, unemployment: 3.5, interest: 4.83 },
  { month: "Apr 2023", inflation: 4.9, unemployment: 3.4, interest: 5.08 },
  { month: "May 2023", inflation: 4.0, unemployment: 3.7, interest: 5.08 },
  { month: "Jun 2023", inflation: 3.0, unemployment: 3.6, interest: 5.08 },
  { month: "Jul 2023", inflation: 3.2, unemployment: 3.5, interest: 5.33 },
  { month: "Aug 2023", inflation: 3.7, unemployment: 3.8, interest: 5.33 },
  { month: "Sep 2023", inflation: 3.7, unemployment: 3.8, interest: 5.33 },
  { month: "Oct 2023", inflation: 3.2, unemployment: 3.9, interest: 5.33 },
  { month: "Nov 2023", inflation: 3.1, unemployment: 3.7, interest: 5.33 },
  { month: "Dec 2023", inflation: 3.4, unemployment: 3.7, interest: 5.33 },
  { month: "Jan 2024", inflation: 3.1, unemployment: 3.7, interest: 5.33 },
  { month: "Feb 2024", inflation: 3.2, unemployment: 3.9, interest: 5.33 },
  { month: "Mar 2024", inflation: 3.5, unemployment: 3.8, interest: 5.33 },
  { month: "Apr 2024", inflation: 3.4, unemployment: 3.9, interest: 5.33 },
  { month: "May 2024", inflation: 3.3, unemployment: 4.0, interest: 5.33 },
  { month: "Jun 2024", inflation: 3.0, unemployment: 4.1, interest: 5.33 },
  { month: "Jul 2024", inflation: 2.9, unemployment: 4.3, interest: 5.33 },
  { month: "Aug 2024", inflation: 2.5, unemployment: 4.2, interest: 5.33 },
  { month: "Sep 2024", inflation: 2.4, unemployment: 4.1, interest: 4.83 },
  { month: "Oct 2024", inflation: 2.6, unemployment: 4.1, interest: 4.83 },
  { month: "Nov 2024", inflation: 2.7, unemployment: 4.2, interest: 4.58 },
  { month: "Dec 2024", inflation: 2.9, unemployment: 4.2, interest: 4.33 },
  { month: "Jan 2025", inflation: 3.0, unemployment: 4.0, interest: 4.33 },
  { month: "Feb 2025", inflation: 2.8, unemployment: 4.1, interest: 4.33 },
  { month: "Mar 2025", inflation: 2.4, unemployment: 4.2, interest: 4.33 },
];

const METRICS = {
  inflation:    { label: "Inflation",      unit: "%", color: "#ff6b35", desc: "CPI Year-over-Year" },
  unemployment: { label: "Unemployment",   unit: "%", color: "#00b4d8", desc: "U-3 Rate" },
  interest:     { label: "Fed Funds Rate", unit: "%", color: "#a8dadc", desc: "Effective Rate" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,10,20,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      padding: "12px 16px",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "12px",
    }}>
      <div style={{ color: "#888", marginBottom: 8, letterSpacing: "0.1em" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: METRICS[p.dataKey]?.color, marginBottom: 4 }}>
          {METRICS[p.dataKey]?.label}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [activeMetrics, setActiveMetrics] = useState({
    inflation: true, unemployment: true, interest: true,
  });

  const toggleMetric = (key) =>
    setActiveMetrics((prev) => ({ ...prev, [key]: !prev[key] }));

  const latest = ECONOMIC_DATA[ECONOMIC_DATA.length - 1];
  const prev   = ECONOMIC_DATA[ECONOMIC_DATA.length - 2];
  const activeCount = Object.values(activeMetrics).filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060810",
      color: "#e8e8f0",
      fontFamily: "'IBM Plex Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060810; }
        .metric-btn { cursor: pointer; transition: all 0.2s ease; border: none; background: none; }
        .metric-btn:hover { transform: translateY(-2px); }
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 20px 24px;
          position: relative; overflow: hidden; transition: border-color 0.3s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.15); }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line { stroke: rgba(255,255,255,0.05) !important; }
        .recharts-text {
          fill: #555 !important;
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 11px !important;
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
          .legend-row { display: none !important; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow-orb" style={{ width: 600, height: 600, background: "rgba(255,107,53,0.04)", top: -200, right: -100 }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(0,180,216,0.04)", bottom: -100, left: -100 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b35", boxShadow: "0 0 12px #ff6b35" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>Live Economic Monitor</span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "#f0f0ff",
          }}>
            US Economic<br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>Indicators</span>
          </h1>
          <p style={{ marginTop: 16, color: "#444", fontSize: 12, letterSpacing: "0.05em" }}>
            Jan 2023 — Mar 2025 · Monthly Data · Sources: BLS, FRED
          </p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {Object.entries(METRICS).map(([key, meta]) => {
            const diff = (latest[key] - prev[key]).toFixed(2);
            const isUp = diff > 0;
            return (
              <button key={key} className="metric-btn stat-card" onClick={() => toggleMetric(key)}
                style={{ opacity: activeMetrics[key] ? 1 : 0.35, outline: activeMetrics[key] ? `1px solid ${meta.color}22` : "none" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: activeMetrics[key] ? meta.color : "transparent",
                  borderRadius: "12px 12px 0 0", transition: "background 0.3s" }} />
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", marginBottom: 12 }}>{meta.desc}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, color: meta.color, fontFamily: "'Syne', sans-serif" }}>
                      {latest[key]}
                    </span>
                    <span style={{ fontSize: 16, color: meta.color, opacity: 0.7, marginLeft: 4 }}>%</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: isUp ? "#ff6b6b" : "#6bffb8", marginBottom: 2 }}>
                      {isUp ? "▲" : "▼"} {Math.abs(diff)}%
                    </div>
                    <div style={{ fontSize: 10, color: "#333" }}>vs Feb</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "#555", letterSpacing: "0.05em" }}>{meta.label}</div>
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "32px 24px 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0", marginBottom: 4 }}>Monthly Trend</div>
              <div style={{ fontSize: 11, color: "#444" }}>Click cards above to toggle metrics</div>
            </div>
            <div className="legend-row" style={{ display: "flex", gap: 16 }}>
              {Object.entries(METRICS).map(([key, meta]) => activeMetrics[key] && (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#555" }}>
                  <div style={{ width: 20, height: 2, background: meta.color, borderRadius: 1 }} />
                  {meta.label}
                </div>
              ))}
            </div>
          </div>

          {activeCount === 0 ? (
            <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 13 }}>
              Select at least one metric above
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={ECONOMIC_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 10 }} interval={2} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.05)" }} />
                <YAxis tick={{ fill: "#444", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={2} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4"
                  label={{ value: "Fed 2% Target", position: "insideTopRight", fill: "#333", fontSize: 10 }} />
                {Object.entries(METRICS).map(([key, meta]) =>
                  activeMetrics[key] ? (
                    <Line key={key} type="monotone" dataKey={key} stroke={meta.color} strokeWidth={2}
                      dot={false} activeDot={{ r: 5, fill: meta.color, strokeWidth: 0 }} />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Data Table */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Recent Data
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  <th style={{ padding: "12px 24px", textAlign: "left", color: "#444", fontWeight: 400, letterSpacing: "0.08em" }}>Month</th>
                  {Object.entries(METRICS).map(([key, meta]) => (
                    <th key={key} style={{ padding: "12px 24px", textAlign: "right", color: meta.color, fontWeight: 400, letterSpacing: "0.08em", opacity: 0.8 }}>
                      {meta.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...ECONOMIC_DATA].reverse().slice(0, 8).map((row, i) => (
                  <tr key={row.month} style={{ borderTop: "1px solid rgba(255,255,255,0.03)", background: i === 0 ? "rgba(255,255,255,0.025)" : "transparent" }}>
                    <td style={{ padding: "12px 24px", color: i === 0 ? "#e8e8f0" : "#555" }}>
                      {i === 0 && <span style={{ fontSize: 9, background: "#ff6b3522", color: "#ff6b35", padding: "2px 6px", borderRadius: 4, marginRight: 8, letterSpacing: "0.1em" }}>LATEST</span>}
                      {row.month}
                    </td>
                    {Object.entries(METRICS).map(([key, meta]) => (
                      <td key={key} style={{ padding: "12px 24px", textAlign: "right", color: i === 0 ? meta.color : "#444" }}>
                        {row[key]}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 10, color: "#2a2a3a", letterSpacing: "0.08em", textAlign: "center" }}>
          Data through March 2025 · CPI, U-3 Unemployment, Effective Federal Funds Rate · Bureau of Labor Statistics / Federal Reserve
        </div>
      </div>
    </div>
  );
}
