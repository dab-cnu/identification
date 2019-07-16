var express = require("express");  
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = require("http").createServer(app);

server.listen(8085);

console.log("Web server start!!");
console.log("You can access the server (http://localhost:8085)");

app.use(express.static("public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/html/menu.html");
});

app.get("/addHuamnPage", function(req, res) {
	res.sendFile(__dirname + "/public/html/addHumanPage.html");
});

app.get("/getHuamnPage", function(req, res) {
	res.sendFile(__dirname + "/public/html/getHumanPage.html");
});



var Web3 = require("web3");
var fs = require('fs');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));	

var abi = JSON.parse(fs.readFileSync('./HumanInfo.json', 'utf8'));

var humanInfoContract = web3.eth.contract(abi);
var humanInfo = humanInfoContract.at("0x053c00c2895b45835a81266a38358ae0a5d2953c");

web3.eth.defaultAccount = web3.eth.accounts[0];

// callAddHuman
app.post("/addHumanPage/addHuman", function(req, res) {
	var _publicKey = req.body.publicKey;
    var _info = req.body.info;
	var _sign = req.body.sign;
	var _image = 'test';

	var IPFS = require("ipfs")
	var node = new IPFS({ start: false });

	node.once('ready', () => {
		node.add(Buffer.from(_image), (err, files) => {
			if (err) return console.error(err)
			var hashcode = files[0].hash

			console.log('===================================');
			console.log('[call addHuman]');
			console.log('public Key (hash) : ' + _publicKey);
			console.log('info (hash) : ' + _info);
			console.log('sign (hash) : ' + _sign);
			console.log('image (hash) : ' + hashcode);
			console.log('-----------------------------------');
			humanInfo.addHuman.sendTransaction(_publicKey, _info, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 150000});
			console.log('function call : addHuman complete');
			humanInfo.setSign.sendTransaction(_publicKey, _sign, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 150000});
			console.log('function call : setSign complete');
			humanInfo.setImage.sendTransaction(_publicKey, hashcode, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 150000});
			console.log('function call : setImage complete');
			console.log('===================================');
		})
	})
});

// callGetHuman
app.get("/getHumanPage/getHuman", function(req, res) {
	var _publicKey = req.query.publicKey;

	var human = humanInfo.getHuman.call(_publicKey);
	res.send(human);
})