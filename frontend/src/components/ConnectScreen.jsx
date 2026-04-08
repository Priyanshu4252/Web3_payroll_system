export default function ConnectScreen({ onConnect, connecting, error }) {
  return (
    <div className="connect-screen">
      <div className="connect-bg-grid" />
      <div className="connect-orb connect-orb-1" />
      <div className="connect-orb connect-orb-2" />

      <div className="connect-card">
        <div className="connect-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="url(#lg1)" />
            <path d="M14 24L24 14L34 24L24 34L14 24Z" fill="white" fillOpacity="0.9" />
            <path d="M24 14V34" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M14 24H34" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6EE7C7" />
                <stop offset="1" stopColor="#3B5BDB" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="connect-title">PayChain</h1>
        <p className="connect-sub">Transparent. On-chain. Trustless corporate payroll.</p>

        <div className="connect-features">
          {["Salary dispatched via smart contract", "All deductions recorded on-chain", "Immutable pay history for employees"].map((f, i) => (
            <div className="connect-feature" key={i}>
              <span className="feature-dot" />
              {f}
            </div>
          ))}
        </div>

        {error && <div className="connect-error">{error}</div>}

        <button className="connect-btn" onClick={onConnect} disabled={connecting}>
          {connecting ? (
            <><span className="btn-spinner" /> Connecting…</>
          ) : (
            <><MetaMaskIcon /> Connect Wallet</>
          )}
        </button>

        <p className="connect-hint">Requires MetaMask or compatible Web3 wallet</p>
      </div>
    </div>
  );
}

function MetaMaskIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 35 33" fill="none" style={{ marginRight: 8 }}>
      <path d="M32.958 1L19.438 10.682l2.45-5.79L32.958 1z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.03 1l13.4 9.772-2.328-5.88L2.03 1z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
