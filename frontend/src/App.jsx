import { useState } from "react";
import { useWeb3 } from "./hooks/useWeb3";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ConnectScreen from "./components/ConnectScreen";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  const web3 = useWeb3();
  const [activeTab, setActiveTab] = useState("admin");

  if (!web3.account) {
    return <ConnectScreen onConnect={web3.connect} connecting={web3.connecting} error={web3.error} />;
  }

  return (
    <div className="app">
      <Navbar
        account={web3.account}
        chainId={web3.chainId}
        isOwner={web3.isOwner}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="main-content">
        {activeTab === "admin" ? (
          <AdminDashboard contract={web3.contract} account={web3.account} isOwner={web3.isOwner} />
        ) : (
          <EmployeeDashboard contract={web3.contract} account={web3.account} />
        )}
      </main>
    </div>
  );
}
