import { useState, useEffect } from "react";
import { formatEth, formatBps, formatDate, shortenAddress } from "../utils/format";

export default function EmployeeDashboard({ contract, account }) {
  const [profile, setProfile] = useState(null);
  const [payHistory, setPayHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [lookupAddress, setLookupAddress] = useState("");
  const [lookupTarget, setLookupTarget] = useState(account);

  const fetchData = async (target) => {
    if (!contract) return;
    setLoading(true);
    try {
      const emp = await contract.employees(target);
      if (!emp.isActive) {
        setProfile(null);
        setPayHistory([]);
        setLoading(false);
        return;
      }
      setProfile({ name: emp.name, designation: emp.designation, wallet: target });

      const count = await contract.getPayHistoryCount(target);
      const records = [];
      for (let i = Number(count) - 1; i >= 0; i--) {
        const [baseSalary, totalDeducted, netPaid, timestamp] = await contract.getPayRecord(target, i);
        const [deductNames, deductPcts] = await contract.getPayRecordDeductions(target, i);
        records.push({
          index: i,
          baseSalary,
          totalDeducted,
          netPaid,
          timestamp,
          deductions: deductNames.map((n, idx) => ({ name: n, percentage: deductPcts[idx] })),
        });
      }
      setPayHistory(records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(lookupTarget);
  }, [contract, lookupTarget]);

  const totalNetEarned = payHistory.reduce((sum, r) => sum + BigInt(r.netPaid), BigInt(0));
  const totalDeducted = payHistory.reduce((sum, r) => sum + BigInt(r.totalDeducted), BigInt(0));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Portal</h1>
          <p className="page-sub">Your transparent pay history, verified on-chain</p>
        </div>
      </div>

      <div className="lookup-bar">
        <input
          className="form-input lookup-input"
          placeholder={`Lookup address (default: your wallet)`}
          value={lookupAddress}
          onChange={(e) => setLookupAddress(e.target.value)}
        />
        <button
          className="lookup-btn"
          onClick={() => setLookupTarget(lookupAddress || account)}
        >
          Look Up
        </button>
        {lookupTarget !== account && (
          <button className="lookup-reset" onClick={() => { setLookupAddress(""); setLookupTarget(account); }}>
            Reset to My Wallet
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Loading chain data…</span>
        </div>
      ) : !profile ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⚠</div>
            <p>No employee found at <code>{shortenAddress(lookupTarget)}</code>.</p>
            <p className="empty-hint">Ask your admin to register this address.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="emp-profile-card">
            <div className="emp-avatar">{profile.name.slice(0, 2).toUpperCase()}</div>
            <div className="emp-profile-info">
              <div className="emp-profile-name">{profile.name}</div>
              <div className="emp-profile-role">{profile.designation}</div>
              <code className="emp-profile-addr">{profile.wallet}</code>
            </div>
            <div className="emp-stats">
              <div className="emp-stat">
                <span className="emp-stat-val">{payHistory.length}</span>
                <span className="emp-stat-label">Pay Records</span>
              </div>
              <div className="emp-stat">
                <span className="emp-stat-val green">{formatEth(totalNetEarned)} ETH</span>
                <span className="emp-stat-label">Total Net Earned</span>
              </div>
              <div className="emp-stat">
                <span className="emp-stat-val muted">{formatEth(totalDeducted)} ETH</span>
                <span className="emp-stat-label">Total Deducted</span>
              </div>
            </div>
          </div>

          <div className="history-grid">
            <div className="card history-list-card">
              <h2 className="card-title">Pay History</h2>
              {payHistory.length === 0 ? (
                <div className="empty-state">No salary dispatched yet.</div>
              ) : (
                <div className="pay-list">
                  {payHistory.map((r) => (
                    <div
                      key={r.index}
                      className={`pay-item ${selectedRecord?.index === r.index ? "selected" : ""}`}
                      onClick={() => setSelectedRecord(r)}
                    >
                      <div className="pay-item-left">
                        <div className="pay-item-date">{formatDate(r.timestamp)}</div>
                        <div className="pay-item-deduct">
                          {r.deductions.map((d) => d.name).join(", ")}
                        </div>
                      </div>
                      <div className="pay-item-right">
                        <div className="pay-item-net">{formatEth(r.netPaid)} ETH</div>
                        <div className="pay-item-base">Base: {formatEth(r.baseSalary)}</div>
                      </div>
                      <div className="pay-item-arrow">›</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedRecord && (
              <div className="card pay-detail-card">
                <h2 className="card-title">Pay Slip #{selectedRecord.index + 1}</h2>
                <div className="payslip">
                  <div className="payslip-header">
                    <div className="payslip-logo">PayChain</div>
                    <div className="payslip-date">{formatDate(selectedRecord.timestamp)}</div>
                  </div>

                  <div className="payslip-section">
                    <div className="payslip-row">
                      <span>Employee</span>
                      <span>{profile.name}</span>
                    </div>
                    <div className="payslip-row">
                      <span>Designation</span>
                      <span>{profile.designation}</span>
                    </div>
                    <div className="payslip-row">
                      <span>Wallet</span>
                      <code className="small-code">{shortenAddress(profile.wallet)}</code>
                    </div>
                  </div>

                  <div className="payslip-section">
                    <div className="payslip-row payslip-base">
                      <span>Base Salary</span>
                      <span>{formatEth(selectedRecord.baseSalary)} ETH</span>
                    </div>
                  </div>

                  <div className="payslip-section">
                    <div className="payslip-sub-heading">Deductions</div>
                    {selectedRecord.deductions.map((d, i) => (
                      <div className="payslip-row deduct-row" key={i}>
                        <span>{d.name}</span>
                        <span className="deduct-val">
                          -{formatEth((BigInt(selectedRecord.baseSalary) * BigInt(d.percentage)) / BigInt(10000))} ETH
                          <small>({formatBps(d.percentage)})</small>
                        </span>
                      </div>
                    ))}
                    <div className="payslip-row total-deduct">
                      <span>Total Deductions</span>
                      <span className="deduct-val">-{formatEth(selectedRecord.totalDeducted)} ETH</span>
                    </div>
                  </div>

                  <div className="payslip-net">
                    <span>Net Salary Paid</span>
                    <span className="net-final">{formatEth(selectedRecord.netPaid)} ETH</span>
                  </div>

                  <div className="payslip-footer">
                    <div className="payslip-chain-badge">⛓ Recorded on Blockchain</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
