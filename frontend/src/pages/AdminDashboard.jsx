import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { formatEth, formatBps, formatDate, shortenAddress } from "../utils/format";

const DEFAULT_DEDUCTIONS = [
  { name: "Income Tax", percentage: "2000" },
  { name: "Health Care", percentage: "500" },
  { name: "Provident Fund", percentage: "1200" },
];

export default function AdminDashboard({ contract, account, isOwner }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [activePanel, setActivePanel] = useState("dispatch");

  // Dispatch form state
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [baseSalaryEth, setBaseSalaryEth] = useState("");
  const [deductions, setDeductions] = useState(DEFAULT_DEDUCTIONS);

  // Add employee form
  const [newWallet, setNewWallet] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const fetchEmployees = async () => {
    if (!contract) return;
    try {
      const addrs = await contract.getEmployeeList();
      const details = await Promise.all(
        addrs.map(async (addr) => {
          const emp = await contract.employees(addr);
          return { wallet: addr, name: emp.name, designation: emp.designation, isActive: emp.isActive };
        })
      );
      setEmployees(details.filter((e) => e.isActive));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [contract]);

  const totalDeductionBps = deductions.reduce((sum, d) => sum + (parseInt(d.percentage) || 0), 0);
  const totalDeductionPct = totalDeductionBps / 100;
  const netSalaryEth = baseSalaryEth
    ? (parseFloat(baseSalaryEth) * (1 - totalDeductionBps / 10000)).toFixed(6)
    : "0.000000";

  const addDeduction = () =>
    setDeductions([...deductions, { name: "", percentage: "0" }]);

  const removeDeduction = (i) =>
    setDeductions(deductions.filter((_, idx) => idx !== i));

  const updateDeduction = (i, field, val) => {
    const updated = [...deductions];
    updated[i][field] = val;
    setDeductions(updated);
  };

  const handleDispatch = async () => {
    if (!contract || !isOwner) return;
    if (!selectedEmployee || !baseSalaryEth || totalDeductionBps > 10000) return;
    try {
      setLoading(true);
      setTxStatus({ type: "pending", msg: "Awaiting wallet confirmation…" });
      const names = deductions.map((d) => d.name);
      const pcts = deductions.map((d) => parseInt(d.percentage));
      const tx = await contract.dispatchSalary(
        selectedEmployee,
        names,
        pcts,
        { value: ethers.parseEther(baseSalaryEth) }
      );
      setTxStatus({ type: "mining", msg: "Transaction submitted. Mining…", hash: tx.hash });
      await tx.wait();
      setTxStatus({ type: "success", msg: "Salary dispatched on-chain!", hash: tx.hash });
      setBaseSalaryEth("");
      setSelectedEmployee("");
    } catch (e) {
      setTxStatus({ type: "error", msg: e.reason || e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!contract || !isOwner) return;
    if (!newWallet || !newName || !newDesignation) return;
    try {
      setLoading(true);
      setTxStatus({ type: "pending", msg: "Adding employee…" });
      const tx = await contract.addEmployee(newWallet, newName, newDesignation);
      setTxStatus({ type: "mining", msg: "Confirming…", hash: tx.hash });
      await tx.wait();
      setTxStatus({ type: "success", msg: `${newName} added successfully!`, hash: tx.hash });
      setNewWallet(""); setNewName(""); setNewDesignation("");
      fetchEmployees();
    } catch (e) {
      setTxStatus({ type: "error", msg: e.reason || e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Manage payroll & dispatch salaries on-chain</p>
        </div>
        <div className="stat-chips">
          <div className="stat-chip">
            <span className="stat-num">{employees.length}</span>
            <span className="stat-label">Employees</span>
          </div>
        </div>
      </div>

      {!isOwner && (
        <div className="warning-banner">
          ⚠ You are not the contract owner. Read-only mode.
        </div>
      )}

      <div className="panel-tabs">
        {["dispatch", "employees", "add"].map((p) => (
          <button
            key={p}
            className={`panel-tab ${activePanel === p ? "active" : ""}`}
            onClick={() => setActivePanel(p)}
          >
            {p === "dispatch" ? "Dispatch Salary" : p === "employees" ? "View Employees" : "Add Employee"}
          </button>
        ))}
      </div>

      {txStatus && (
        <div className={`tx-status tx-${txStatus.type}`}>
          <span>{txStatus.type === "pending" ? "⏳" : txStatus.type === "mining" ? "⛏" : txStatus.type === "success" ? "✅" : "❌"}</span>
          <span>{txStatus.msg}</span>
          {txStatus.hash && (
            <a href={`https://sepolia.etherscan.io/tx/${txStatus.hash}`} target="_blank" rel="noreferrer" className="tx-link">
              View →
            </a>
          )}
          <button className="tx-close" onClick={() => setTxStatus(null)}>✕</button>
        </div>
      )}

      {activePanel === "dispatch" && (
        <div className="panel-grid">
          <div className="card dispatch-card">
            <h2 className="card-title">Salary Dispatch</h2>

            <div className="form-group">
              <label className="form-label">Employee</label>
              <select className="form-select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select employee…</option>
                {employees.map((e) => (
                  <option key={e.wallet} value={e.wallet}>
                    {e.name} — {shortenAddress(e.wallet)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Base Salary (ETH)</label>
              <div className="input-with-tag">
                <input
                  className="form-input"
                  type="number"
                  step="0.001"
                  placeholder="0.500"
                  value={baseSalaryEth}
                  onChange={(e) => setBaseSalaryEth(e.target.value)}
                />
                <span className="input-tag">ETH</span>
              </div>
            </div>

            <div className="deductions-section">
              <div className="deductions-header">
                <span className="form-label">Deductions</span>
                <button className="add-deduction-btn" onClick={addDeduction}>+ Add</button>
              </div>
              {deductions.map((d, i) => (
                <div className="deduction-row" key={i}>
                  <input
                    className="form-input deduction-name"
                    placeholder="Label (e.g. Tax)"
                    value={d.name}
                    onChange={(e) => updateDeduction(i, "name", e.target.value)}
                  />
                  <div className="input-with-tag deduction-pct">
                    <input
                      className="form-input"
                      type="number"
                      placeholder="2000"
                      value={d.percentage}
                      onChange={(e) => updateDeduction(i, "percentage", e.target.value)}
                    />
                    <span className="input-tag">bps</span>
                  </div>
                  <span className="bps-display">{formatBps(d.percentage)}</span>
                  <button className="remove-btn" onClick={() => removeDeduction(i)}>✕</button>
                </div>
              ))}
            </div>

            <div className="dispatch-summary">
              <div className="summary-row">
                <span>Base Salary</span>
                <span className="summary-val">{baseSalaryEth || "0"} ETH</span>
              </div>
              <div className="summary-row">
                <span>Total Deductions</span>
                <span className={`summary-val ${totalDeductionBps > 10000 ? "error-text" : "deduct-text"}`}>
                  -{totalDeductionPct.toFixed(2)}%
                </span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-net">
                <span>Net Salary</span>
                <span className="net-val">{netSalaryEth} ETH</span>
              </div>
            </div>

            <button
              className="dispatch-btn"
              onClick={handleDispatch}
              disabled={loading || !isOwner || !selectedEmployee || !baseSalaryEth || totalDeductionBps > 10000}
            >
              {loading ? <><span className="btn-spinner" /> Processing…</> : "⟡ Dispatch Salary"}
            </button>
          </div>

          <div className="card preview-card">
            <h2 className="card-title">Breakdown Preview</h2>
            {baseSalaryEth ? (
              <>
                <div className="breakdown-chart">
                  <div className="donut-wrap">
                    <DonutChart deductions={deductions} totalBps={totalDeductionBps} />
                  </div>
                </div>
                <div className="breakdown-legend">
                  {deductions.map((d, i) => (
                    <div className="legend-row" key={i}>
                      <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="legend-name">{d.name || "—"}</span>
                      <span className="legend-pct">{formatBps(d.percentage)}</span>
                      <span className="legend-amt">
                        -{((parseFloat(baseSalaryEth) * parseInt(d.percentage)) / 10000).toFixed(5)} ETH
                      </span>
                    </div>
                  ))}
                  <div className="legend-row legend-net-row">
                    <span className="legend-dot" style={{ background: "#6EE7C7" }} />
                    <span className="legend-name">Net Payout</span>
                    <span className="legend-pct">{(100 - totalDeductionPct).toFixed(2)}%</span>
                    <span className="legend-amt">{netSalaryEth} ETH</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="preview-empty">Enter a salary amount to see the breakdown</div>
            )}
          </div>
        </div>
      )}

      {activePanel === "employees" && (
        <div className="card">
          <h2 className="card-title">Registered Employees</h2>
          {employees.length === 0 ? (
            <div className="empty-state">No employees registered yet.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Wallet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.wallet}>
                      <td><span className="emp-name">{e.name}</span></td>
                      <td><span className="emp-role">{e.designation}</span></td>
                      <td><code className="addr-code">{e.wallet}</code></td>
                      <td><span className="status-badge active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activePanel === "add" && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h2 className="card-title">Add Employee</h2>
          <div className="form-group">
            <label className="form-label">Wallet Address</label>
            <input className="form-input" placeholder="0x…" value={newWallet} onChange={(e) => setNewWallet(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="e.g. Ravi Sharma" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Designation</label>
            <input className="form-input" placeholder="e.g. Senior Engineer" value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} />
          </div>
          <button className="dispatch-btn" onClick={handleAddEmployee} disabled={loading || !isOwner}>
            {loading ? <><span className="btn-spinner" /> Adding…</> : "Add Employee"}
          </button>
        </div>
      )}
    </div>
  );
}

const COLORS = ["#F87171", "#FB923C", "#FBBF24", "#A78BFA", "#60A5FA", "#34D399"];

function DonutChart({ deductions, totalBps }) {
  const size = 180;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;
  const netBps = 10000 - totalBps;
  const allSlices = [
    ...deductions.map((d, i) => ({ bps: parseInt(d.percentage) || 0, color: COLORS[i % COLORS.length] })),
    { bps: netBps > 0 ? netBps : 0, color: "#6EE7C7" },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {allSlices.map((s, i) => {
        const pct = s.bps / 10000;
        const dash = pct * circ;
        const gap = circ - dash;
        const offset = circ - cumulative * circ;
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - 18} fill="#0D1117" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#E5E7EB" fontSize="13" fontWeight="600">Net</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6EE7C7" fontSize="15" fontWeight="700">
        {(netBps / 100).toFixed(1)}%
      </text>
    </svg>
  );
}
