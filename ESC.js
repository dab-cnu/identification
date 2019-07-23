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
var humanInfo = humanInfoContract.at("0x20e34ce741fe41fc0b833b95cfa4e5b126f9e29e");

web3.eth.defaultAccount = web3.eth.accounts[0];

// callAddHuman
app.post("/addHumanPage/addHuman", function(req, res) {
	var _publicKey = req.body.publicKey;
    var _info = req.body.info;
	var _sign = req.body.sign;
	var _image = req.body.image;

	var node = new IPFS({ start: false });

	node.on('ready', async () => {
		const a= await node.add(Buffer.from(_image), (err, files) => {
			if (err) return console.error(err)
			var hashcode = files[0].hash
			console.log('===================================');
			console.log('[call addHuman]');
			console.log('public Key (hash) : ' + _publicKey);
			console.log('info (hash) : ' + _info);
			console.log('sign (hash) : ' + _sign);
			console.log('image (hash) : ' + hashcode);
			console.log('-----------------------------------');
			humanInfo.addHuman.sendTransaction(_publicKey, _info, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 350000}, function(error, transactionHash1){
				
				if(!error){
				}
				else{
					res.send("Error");
				}
				humanInfo.setSign.sendTransaction(_publicKey, _sign, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 150000}, function(error, transactionHash2){
					if(!error){
					}
					else{
						res.send("Error");
					}
				
				humanInfo.setImage.sendTransaction(_publicKey, hashcode, {from: web3.eth.accounts[0], gas: web3.eth.estimateGas(humanInfo) + 150000}, function(error, transactionHash3){
					if(!error){
						var transactions = {
							info : transactionHash1,
							sign : transactionHash2,
							img : transactionHash3
						};
						
						transactions.info = transactionHash1;
						transactions.sign = transactionHash2
						transactions.img = transactionHash3
						transactionsJSON = JSON.stringify(transactions);
						console.log(transactionsJSON);
						console.log("=====================================================");
						console.log("  _____  _____ ______ ______  _____  _____  _____ ");
						console.log("/  __ \\|  _  || ___ \\| ___ \\|  ___|/  __ \\|_   _| ");
						console.log("| /  \\/| | | || |_/ /| |_/ /| |__  | /  \\/  | |   ");
						console.log("| |    | | | ||    / |    / |  __| | |      | |   ");
						console.log("| \\__/\\ \\\\_/ /| |\\ \\ | |\\ \\ | |___ | \\__/\\  | |   ");
						console.log(" \\____/ \\___/ \\_| \\_|\\_| \\_|\\____/  \\____/  \\_/   ");
						console.log("=====================================================");
						res.send(transactions);
					}
					else{
						res.send("Error");
					}
				});
			});
			});
		})
	})
	
});

// callGetHuman
app.get("/getHumanPage/getHuman", function(req, res) {
	var _publicKey = req.query.publicKey;

	console.log("get smart contract now....");
	var human = humanInfo.getHuman.call(_publicKey);
	
	var _info = human[0];
	var _sign = human[1];
	var hashcode = human[2];
	console.log("get Image from ipfs");
	var node = new IPFS({ start: false });
	return node.once('ready', () => {
		console.log("now we enter into ipfs")
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