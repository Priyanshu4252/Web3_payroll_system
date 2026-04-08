import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { PAYROLL_ABI, PAYROLL_ADDRESS } from "../abi/Payroll";

export function useWeb3() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install it.");
      return;
    }
    try {
      setConnecting(true);
      setError(null);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const network = await _provider.getNetwork();
      const _contract = new ethers.Contract(PAYROLL_ADDRESS, PAYROLL_ABI, _signer);
      const ownerAddr = await _contract.owner();

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setAccount(accounts[0]);
      setChainId(network.chainId.toString());
      setIsOwner(ownerAddr.toLowerCase() === accounts[0].toLowerCase());
    } catch (err) {
      setError(err.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0] || null);
      connect();
    });
    window.ethereum.on("chainChanged", () => window.location.reload());
    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, [connect]);

  return { provider, signer, contract, account, isOwner, chainId, connecting, error, connect };
}
