import { shortenAddress, copyToClipboard } from "../utils/format";
import { useState } from "react";

export default function Navbar({ account, chainId, isOwner, activeTab, setActiveTab }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="url(#navlg)" />
            <path d="M14 24L24 14L34 24L24 34L14 24Z" fill="white" fillOpacity="0.9" />
            <defs>
              <linearGradient id="navlg" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6EE7C7" />
                <stop offset="1" stopColor="#3B5BDB" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-brand">PayChain</span>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Admin
          </button>
          <button
            className={`nav-tab ${activeTab === "employee" ? "active" : ""}`}
            onClick={() => setActiveTab("employee")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Employee
          </button>
        </div>
      </div>

      <div className="navbar-right">
        <div className="chain-badge">
          <span className="chain-dot" />
          Chain {chainId}
        </div>
        {isOwner && <div className="owner-badge">Owner</div>}
        <button className="account-chip" onClick={handleCopy} title="Click to copy">
          <span className="account-avatar">{account?.slice(2, 4).toUpperCase()}</span>
          {shortenAddress(account)}
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6EE7C7" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          )}
        </button>
      </div>
    </nav>
  );
}
