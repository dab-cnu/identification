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
})

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
var humanInfo = humanInfoContract.at("0xae3e617d2bf6ba3c32c3305c4278587cdf0f0b98");
var gasEstimate = web3.eth.estimateGas(humanInfo);

app.post("/addHumanPage/addHuman", function(req, res){
	var _publicKey = req.body.publicKey;
    var _info = req.body.info;
	var _sign = req.body.sign;
	var _img = req.body.image;

	
	console.log(_publicKey)
	

	const IPFS = require("ipfs")
	const node = new IPFS({ start: false })

	node.once('ready', () => {
		node.add(Buffer.from(_img), (err, files) => {
			if (err) return console.error(err)
			var _temp = _info + " " + files[0].hash
			console.log(_temp)
			humanInfo.addHuman.sendTransaction(_publicKey, _temp, _sign, {from: web3.eth.accounts[0], gas: gasEstimate+10000000}, function(error, transactionHash) {
				
				if (!error) {
					console.log(transactionHash)
					res.send(transactionHash);
				}
				else {
					res.send("Error");
				}
			})
		})
	})
});


// app.post("/addHumanPage/addHuman", function(req, res) {
//     var _publicKey = req.body.publicKey;
//     var _info = req.body.info;
//     var _sign = req.body.sign;
	
//     humanInfo.addHuman.sendTransaction(_publicKey, _info, _sign, "abc", {from: web3.eth.accounts[0], gas: gasEstimate+1000000}, function(error, transactionHash) {
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