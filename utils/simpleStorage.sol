// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract SimpleStorage {
  uint256 storedData;
  string successMsg = 'Event Emit FTW';

  event NewNumber(string msg, uint256 number);
	
  function get() public view returns (uint) {
    return storedData;
  }

  function set(uint x) public {
    storedData = x;
    emit NewNumber(successMsg, x);
  }

  function double() public {
    storedData *= 2;
  }
}