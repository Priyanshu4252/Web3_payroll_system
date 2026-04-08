import { ethers } from "ethers";

export const formatEth = (wei) => {
  if (!wei) return "0.0000";
  return parseFloat(ethers.formatEther(wei)).toFixed(4);
};

export const formatBps = (bps) => {
  return (Number(bps) / 100).toFixed(2) + "%";
};

export const formatDate = (timestamp) => {
  return new Date(Number(timestamp) * 1000).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const shortenAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};
