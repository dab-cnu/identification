var express = require("express");  
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json({limit : '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'10mb' }));

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


// For test
app.get("/test", function(req, res) {
	res.sendFile(__dirname + "/public/html/test.html");
});



var Web3 = require("web3");
var fs = require('fs');
var IPFS = require("ipfs");
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
	var _image = req.body.image;

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
	var _info = human[0];
	var _sign = human[1];
	var hashcode = human[2];

	var node = new IPFS();

	node.once('ready', () => {
		node.cat(hashcode, (err, image_data) => {
			var human_data = [_info, _sign, image_data.toString()];
			console.log('===================================');
			console.log('[call getHuman]');
			console.log('public Key (hash) : ' + _publicKey);
			console.log('info (hash) : ' + _info);
			console.log('sign (hash) : ' + _sign);
			console.log('image (hash) : ' + hashcode);
			console.log('-----------------------------------');
			res.send(human_data);
			console.log('function call : send complete');
			console.log('===================================');
		});
	});
});