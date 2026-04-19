# ⛓️ PayChain — Web3 Payroll Transparency System

> A decentralized payroll system that brings full transparency between employees and corporations by storing salary structures immutably on the blockchain — accessible by employees via their MetaMask wallet address.

🌐 **Live Demo:** [paychain-six.vercel.app](https://paychain-six.vercel.app)

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5edb974c-81d6-4eb1-9b0d-508dffa419f5" />


---

## 📌 Overview

**PayChain** eliminates the information gap in traditional payroll systems. Instead of trusting opaque HR portals, an employee's **base salary** and **percentage-based deductions** are recorded directly on a smart contract — making compensation data permanent, tamper-proof, and independently verifiable by any employee using their MetaMask wallet.

No black boxes. No "trust HR." The numbers live on-chain.

---

## ❓ Problem Statement

In conventional payroll setups:
- Salary structures are controlled entirely by corporations
- Employees have no way to independently verify their deduction breakdown
- Pay records can be altered or withheld
- Disputes arise due to lack of verifiable documentation

PayChain solves this by moving payroll records onto a public, immutable blockchain — where employees can verify their own compensation at any time.

---

## ✨ Features

- 📋 **On-chain Salary Storage** — Base salary recorded immutably on the blockchain
- ✂️ **Deduction Transparency** — Percentage cuts (tax, PF, insurance, etc.) stored on-chain
- 🦊 **MetaMask Integration** — Employees access their records via their wallet address
- 🔒 **Immutable Records** — Data cannot be retroactively altered once committed
- 🌐 **Decentralized** — No central database; all state lives in a Solidity smart contract
- ⚡ **Foundry-Powered** — Fast, Rust-based smart contract toolchain for building and testing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity |
| Contract Toolchain | Foundry (Forge, Cast, Anvil, Chisel) |
| Blockchain Network | EVM-compatible (Chain ID: 10143) |
| Frontend | JavaScript, CSS, HTML |
| Wallet | MetaMask |
| Deployment | Vercel (frontend) |
| Testing | Forge (Foundry test framework) |

---

## 📁 Project Structure

```
Web3_payroll_system/
│
├── src/                        # Solidity smart contracts
│   └── PayrollSystem.sol       # Core payroll contract
│
├── script/                     # Foundry deployment scripts
│   └── Deploy.s.sol
│
├── test/                       # Forge test suite
│
├── broadcast/                  # Deployment artifacts
│   └── Deploy.s.sol/
│       └── 10143/              # Chain ID: 10143
│
├── frontend/                   # JS frontend (deployed on Vercel)
│   └── src/
│
├── lib/                        # Foundry dependencies (git submodules)
│
├── foundry.toml                # Foundry configuration
├── foundry.lock                # Dependency lockfile
├── .gitmodules                 # Submodule definitions
└── .github/workflows/          # CI/CD workflows
```

---

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://getfoundry.sh/) — Install via:
  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- [MetaMask](https://metamask.io/) browser extension
- [Node.js](https://nodejs.org/) v16+ (for the frontend)
- An EVM-compatible wallet with test funds

### Clone the Repository

```bash
git clone https://github.com/Priyanshu4252/Web3_payroll_system.git
cd Web3_payroll_system

# Initialize submodules (Foundry libs)
git submodule update --init --recursive
```

---

## 🔧 Smart Contract Commands

### Build

```bash
forge build
```

### Run Tests

```bash
forge test
```

### Format Code

```bash
forge fmt
```

### Gas Snapshots

```bash
forge snapshot
```

### Start Local Node (Anvil)

```bash
anvil
```

### Deploy Contract

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url <your_rpc_url> \
  --private-key <your_private_key> \
  --broadcast
```

### Interact via Cast

```bash
cast <subcommand>
```

### Help

```bash
forge --help
anvil --help
cast --help
```

---

## 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:3000` and connect your MetaMask wallet.

Update the deployed contract address in the frontend config after deployment.

---

## ⚙️ How It Works

```
1. Employer connects MetaMask and opens the PayChain dashboard
2. Employer inputs employee's wallet address, base salary, and deduction percentages
3. Transaction is sent to the smart contract → data stored permanently on-chain
4. Employee connects their own MetaMask wallet
5. Employee can view their full compensation breakdown at any time — transparently
```

### Smart Contract Logic (simplified)

```solidity
struct Employee {
    uint256 baseSalary;
    uint256[] deductionPercentages;   // e.g., [10, 5, 2]
    string[] deductionLabels;          // e.g., ["Tax", "PF", "Insurance"]
    address employer;
}

mapping(address => Employee) public employees;

function addEmployee(address _employee, uint256 _baseSalary, ...) external onlyEmployer { ... }
function getEmployee(address _employee) external view returns (...) { ... }
```

Only authorized employers can write records. Any wallet holder can read their own data.

---

## 🔍 Viewing Your Payroll (As an Employee)

1. Visit [paychain-six.vercel.app](https://paychain-six.vercel.app)
2. Connect your MetaMask wallet
3. Your salary and deduction breakdown will load automatically based on your wallet address

---

## 🌐 Network

| Detail | Value |
|---|---|
| Chain ID | 10143 |
| Deployment Tool | Foundry (`forge script`) |
| Frontend Host | Vercel |

---

## 📖 Foundry Documentation

Full Foundry docs: [https://book.getfoundry.sh/](https://book.getfoundry.sh/)

---

## 🛡️ Security Notes

- Only authorized employer addresses can write payroll records
- Read access is public by design — this is the transparency feature
- Never commit your private key; use environment variables or a `.env` file
- Consider using OpenZeppelin's `Ownable` for production-grade access control

---

## 🔭 Future Roadmap

- [ ] Multi-employer support with role-based access control
- [ ] On-chain payroll history with timestamps
- [ ] ERC-20 token integration for direct salary disbursement
- [ ] Employee digital acknowledgement / signature of payroll records
- [ ] IPFS-linked payslip documents
- [ ] Analytics dashboard with net pay calculator

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss proposed changes.

```bash
git checkout -b feature/your-feature-name
# make your changes
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# open a Pull Request
```

---

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

## 👥 Authors

**Priyanshu4252**
- GitHub: [@Priyanshu4252](https://github.com/Priyanshu4252)

**Advitya Vaid**
- GitHub: [@Advitya07](https://github.com/Advitya07)

**Amber Dixit**
- GitHub: [@ambxy](https://github.com/ambxy)

---

🌐 Live App: [paychain-six.vercel.app](https://paychain-six.vercel.app)
