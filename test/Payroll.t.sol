// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Payroll.sol";

contract PayrollTest is Test {
    Payroll public payroll;
    address owner = address(this);
    address employee = address(0xBEEF);

    function setUp() public {
        payroll = new Payroll();
        vm.deal(owner, 100 ether);
    }

    function testAddEmployee() public {
        payroll.addEmployee(employee, "Alice", "Engineer");
        (address wallet, string memory name, string memory designation, bool isActive) =
            payroll.employees(employee);
        assertEq(wallet, employee);
        assertEq(name, "Alice");
        assertEq(designation, "Engineer");
        assertTrue(isActive);
    }

    function testDispatchSalary() public {
        payroll.addEmployee(employee, "Alice", "Engineer");

        string[] memory names = new string[](2);
        names[0] = "Tax";
        names[1] = "Health Care";

        uint256[] memory pcts = new uint256[](2);
        pcts[0] = 2000; // 20%
        pcts[1] = 500;  // 5%

        uint256 baseSalary = 1 ether;
        uint256 expectedNet = baseSalary - (baseSalary * 2500 / 10000); // 75%

        uint256 balBefore = employee.balance;
        payroll.dispatchSalary{value: baseSalary}(payable(employee), names, pcts);
        uint256 balAfter = employee.balance;

        assertEq(balAfter - balBefore, expectedNet);
        assertEq(payroll.getPayHistoryCount(employee), 1);
    }

    function testCannotExceed100PercentDeductions() public {
        payroll.addEmployee(employee, "Bob", "Manager");

        string[] memory names = new string[](1);
        names[0] = "Mega Tax";
        uint256[] memory pcts = new uint256[](1);
        pcts[0] = 10001; // > 100%

        vm.expectRevert("Deductions exceed 100%");
        payroll.dispatchSalary{value: 1 ether}(payable(employee), names, pcts);
    }
}
