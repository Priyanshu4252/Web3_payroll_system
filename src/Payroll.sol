// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PayChain - On-chain Corporate Payroll System
/// @notice Manages employee payroll with transparent deduction tracking on-chain
contract Payroll {
    address public owner;

    struct Deduction {
        string name;       // e.g. "Tax", "Health Care", "Provident Fund"
        uint256 percentage; // in basis points (100 = 1%)
    }

    struct PayRecord {
        uint256 baseSalary;      // in wei
        uint256 totalDeducted;   // in wei
        uint256 netPaid;         // in wei
        uint256 timestamp;
        Deduction[] deductions;
    }

    struct Employee {
        address wallet;
        string name;
        string designation;
        bool isActive;
    }

    mapping(address => Employee) public employees;
    mapping(address => PayRecord[]) public payHistory;
    address[] public employeeList;

    event EmployeeAdded(address indexed wallet, string name, string designation);
    event EmployeeUpdated(address indexed wallet, string name, string designation);
    event SalaryDispatched(
        address indexed employee,
        uint256 baseSalary,
        uint256 totalDeducted,
        uint256 netPaid,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier employeeExists(address _wallet) {
        require(employees[_wallet].isActive, "Employee not found or inactive");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Register a new employee
    function addEmployee(
        address _wallet,
        string calldata _name,
        string calldata _designation
    ) external onlyOwner {
        require(_wallet != address(0), "Invalid address");
        require(!employees[_wallet].isActive, "Employee already exists");

        employees[_wallet] = Employee({
            wallet: _wallet,
            name: _name,
            designation: _designation,
            isActive: true
        });
        employeeList.push(_wallet);

        emit EmployeeAdded(_wallet, _name, _designation);
    }

    /// @notice Update employee info
    function updateEmployee(
        address _wallet,
        string calldata _name,
        string calldata _designation
    ) external onlyOwner employeeExists(_wallet) {
        employees[_wallet].name = _name;
        employees[_wallet].designation = _designation;
        emit EmployeeUpdated(_wallet, _name, _designation);
    }

    /// @notice Dispatch salary with deductions recorded on-chain
    /// @param _employee Employee wallet address
    /// @param _deductionNames Array of deduction labels
    /// @param _deductionPercentages Array of basis point percentages (100 = 1%)
    function dispatchSalary(
        address payable _employee,
        string[] calldata _deductionNames,
        uint256[] calldata _deductionPercentages
    ) external payable onlyOwner employeeExists(_employee) {
        require(msg.value > 0, "Must send ETH");
        require(_deductionNames.length == _deductionPercentages.length, "Mismatched arrays");

        uint256 baseSalary = msg.value;
        uint256 totalDeductedBps = 0;

        for (uint256 i = 0; i < _deductionPercentages.length; i++) {
            totalDeductedBps += _deductionPercentages[i];
        }

        require(totalDeductedBps <= 10000, "Deductions exceed 100%");

        uint256 totalDeducted = (baseSalary * totalDeductedBps) / 10000;
        uint256 netPaid = baseSalary - totalDeducted;

        // Build pay record
        PayRecord storage record = payHistory[_employee].push();
        record.baseSalary = baseSalary;
        record.totalDeducted = totalDeducted;
        record.netPaid = netPaid;
        record.timestamp = block.timestamp;

        for (uint256 i = 0; i < _deductionNames.length; i++) {
            record.deductions.push(Deduction({
                name: _deductionNames[i],
                percentage: _deductionPercentages[i]
            }));
        }

        // Transfer net salary
        _employee.transfer(netPaid);

        // Owner retains the deducted amount (taxes, etc.)

        emit SalaryDispatched(_employee, baseSalary, totalDeducted, netPaid, block.timestamp);
    }

    /// @notice Get full pay history count for an employee
    function getPayHistoryCount(address _employee) external view returns (uint256) {
        return payHistory[_employee].length;
    }

    /// @notice Get a specific pay record (without deductions array)
    function getPayRecord(address _employee, uint256 _index)
        external
        view
        returns (
            uint256 baseSalary,
            uint256 totalDeducted,
            uint256 netPaid,
            uint256 timestamp
        )
    {
        PayRecord storage r = payHistory[_employee][_index];
        return (r.baseSalary, r.totalDeducted, r.netPaid, r.timestamp);
    }

    /// @notice Get deductions for a specific pay record
    function getPayRecordDeductions(address _employee, uint256 _index)
        external
        view
        returns (string[] memory names, uint256[] memory percentages)
    {
        PayRecord storage r = payHistory[_employee][_index];
        uint256 len = r.deductions.length;
        names = new string[](len);
        percentages = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            names[i] = r.deductions[i].name;
            percentages[i] = r.deductions[i].percentage;
        }
    }

    /// @notice Get all active employee addresses
    function getEmployeeList() external view returns (address[] memory) {
        return employeeList;
    }

    /// @notice Fund the contract
    receive() external payable {}
}
