var express = require("express");  
var app = express();
var bodyParser = require("body-parser");


app.use(bodyParser.json({limit : '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'10mb' }));

var server = require("http").createServer(app);

server.listen(8081);

console.log("Web server start!!");
console.log("You can access the server (http://localhost:8081)");

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

var contract = JSON.parse(fs.readFileSync('./HumanInfo.json', 'utf8'));

var humanInfoContract = web3.eth.contract(contract.abi);
var humanInfo = humanInfoContract.at("0xd8c14f783d8b44f877c4c4a8ea4953785d664f50");
var gasEstimate = web3.eth.estimateGas(humanInfo);

var _img;


app.post("/addHumanPage/addHuman", function(req, res){
	_img = "req.body.image";
	const IPFS = require("ipfs")
	const node = new IPFS({ start: false })
	var ipfs_hash_value =""
	node.once('ready', () => {
		node.add(Buffer.from(_img), (err, files) => {
			if (err) return console.error(err)
			console.log(files[0].hash)
			ipfs_hash_value = files[0].hash
			humanInfo.addHuman.sendTransaction("3331", "332", "!", files[0].hash, {from: web3.eth.accounts[0], gas: gasEstimate +1500000}, function(error, transactionHash) {
				if (!error) {
					res.send(transactionHash);
				}
				else {
					res.send("Error");
				}
			})
		})
	})
});
// humanInfo.addHuman.sendTransaction("123", ipfs_hash_value, {from: web3.eth.accounts[0], gas: gasEstimate +1000000}, function(error, transactionHash) {

// 	console.log("here", ipfs_hash_value)
// 	if (!error) {
// 		res.send(transactionHash);
// 	}
// 	else {
// 		res.send("Error");
// 	}
// })
// callAddHuman


// app.post("/addHumanPage/addHuman", function(req, res) {
//     var _publicKey = req.body.publicKey;
//     var _info = req.body.info;
//     var _sign = req.body.sign;

//     humanInfo.addHuman.sendTransaction(_publicKey, _info, _sign, {from: web3.eth.accounts[0], gas: gasEstimate 1000000}, function(error, transactionHash) {
// 		if (!error) {
// 			res.send(transactionHash);
// 		}
// 		else {
// 			res.send("Error");
// 		}
// 	})
// });

// callGetHuman
app.get("/getHumanPage/getHuman", function(req, res) {
	var _publicKey = req.query.publicKey;

	var human = humanInfo.getHuman.call(_publicKey);
	res.send(human);
})