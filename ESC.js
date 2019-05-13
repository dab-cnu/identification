var express = require("express");  
var app = express();  
var server = require("http").createServer(app);

server.listen(8080);

console.log("Web server start!!");
console.log("You can access the server (http://localhost:8080)");

app.use(express.static("public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");
var fs = require('fs');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));	

var contract = JSON.parse(fs.readFileSync('./HumanInfo.json', 'utf8'));

var humanInfoContract = web3.eth.contract(contract.abi);
var humanInfo = humanInfoContract.at("0x4a21769ac327ff35c16ecb82527902036fef4634");

app.get("/addHuman", function(req, res) {
    var _publicKey = req.query.publicKey;
    var _info = req.query.info;
    var _sign = req.query.sign;

    humanInfo.addHuman.sendTransaction(_publicKey, _info, _sign, {from: web3.eth.accounts[0]}, function(error, transactionHash) {
		if (!error)
		{
			res.send(transactionHash);
		}
		else
		{
			res.send("Error");
		}
	})
})

app.get("/getHuman", function(req, res) {
	var _publicKey = req.query.publicKey;

	var human = humanInfo.getHuman.call(_publicKey);

	res.send(human);
})