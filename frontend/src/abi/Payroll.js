// Auto-generated ABI from Payroll.sol
export const PAYROLL_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "wallet", "type": "address" },
      { "indexed": false, "name": "name", "type": "string" },
      { "indexed": false, "name": "designation", "type": "string" }
    ],
    "name": "EmployeeAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "wallet", "type": "address" },
      { "indexed": false, "name": "name", "type": "string" },
      { "indexed": false, "name": "designation", "type": "string" }
    ],
    "name": "EmployeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "employee", "type": "address" },
      { "indexed": false, "name": "baseSalary", "type": "uint256" },
      { "indexed": false, "name": "totalDeducted", "type": "uint256" },
      { "indexed": false, "name": "netPaid", "type": "uint256" },
      { "indexed": false, "name": "timestamp", "type": "uint256" }
    ],
    "name": "SalaryDispatched",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "_wallet", "type": "address" },
      { "name": "_name", "type": "string" },
      { "name": "_designation", "type": "string" }
    ],
    "name": "addEmployee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_wallet", "type": "address" },
      { "name": "_name", "type": "string" },
      { "name": "_designation", "type": "string" }
    ],
    "name": "updateEmployee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_employee", "type": "address" },
      { "name": "_deductionNames", "type": "string[]" },
      { "name": "_deductionPercentages", "type": "uint256[]" }
    ],
    "name": "dispatchSalary",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_employee", "type": "address" }],
    "name": "getPayHistoryCount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_employee", "type": "address" },
      { "name": "_index", "type": "uint256" }
    ],
    "name": "getPayRecord",
    "outputs": [
      { "name": "baseSalary", "type": "uint256" },
      { "name": "totalDeducted", "type": "uint256" },
      { "name": "netPaid", "type": "uint256" },
      { "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_employee", "type": "address" },
      { "name": "_index", "type": "uint256" }
    ],
    "name": "getPayRecordDeductions",
    "outputs": [
      { "name": "names", "type": "string[]" },
      { "name": "percentages", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEmployeeList",
    "outputs": [{ "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "address" }],
    "name": "employees",
    "outputs": [
      { "name": "wallet", "type": "address" },
      { "name": "name", "type": "string" },
      { "name": "designation", "type": "string" },
      { "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Replace with your deployed contract address
export const PAYROLL_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
