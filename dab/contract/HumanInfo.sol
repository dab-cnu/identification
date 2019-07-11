pragma solidity ^0.5.0;


contract HumanInfo {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  struct Human {
    string info;
    string sign;
    string image;
  }

  mapping (string => Human) private humanList;

  function addHuman(string memory _publicKey, string memory _info, string memory _sign, string memory _image) public {
    // require(humanList[_publicKey]._sign == 0);
    humanList[_publicKey] = Human(_info, _sign, _image);
  }

  function getHuman(string memory _publicKey) public view returns (string memory _info, string memory _sign) {
    // require(humanList[_account].age != 0);
    _info = humanList[_publicKey].info;
    _sign = humanList[_publicKey].sign;
  }

}