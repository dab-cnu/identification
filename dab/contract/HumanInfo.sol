pragma solidity ^0.5.0;


contract HumanInfo {
  address public owner;

  struct Human {
    string info;
    string sign;
    string image;
  }

  mapping (string => Human) private humanList;

  function addHuman(string memory _publicKey, string memory _info) public {
    humanList[_publicKey] = Human(_info, "0", "0");
  }
  
  function setSign(string memory _publicKey, string memory _sign) public {
    humanList[_publicKey].sign = _sign;
  }

  function setImage(string memory _publicKey, string memory _image) public {
    humanList[_publicKey].image = _image;
  }

  function getHuman(string memory _publicKey) public view returns (string memory _info, string memory _sign, string memory _image) {
    // require(humanList[_account].age != 0);
    _info = humanList[_publicKey].info;
    _sign = humanList[_publicKey].sign;
    _image = humanList[_publicKey].image;
  }

}
