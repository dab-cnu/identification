# identification
충남대학교 컴퓨터공학과 졸업프로젝트 (박준원, 배상웅)

geth 사설 서버 구축
```
geth --networkid 4649 --nodiscover --maxpeers 0 --datadir "c:\ethereum\data" --mine --minerthreads 1 --rpc --rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --unlock 0
```

프로젝트 환경 구축
```
npm install express
npm install body-parser
npm install web3
npm install ipfs
```

개발 문서 : https://drive.google.com/drive/folders/17DxW-F1ob1vnl7MrBD2C6GyyICNXcmOK?usp=sharing

개발 일정 : https://docs.google.com/document/d/1609A_9RUvZ10qJ7Xl7FIYgmHwxHtcOwjyO-9FvrAUzM/edit?usp=sharing

개발 세부사항 : https://docs.google.com/document/d/1zFYXKYRoH-3iQcteFsmCCwCOqzmfdAI-vd7VOYH230g/edit?usp=sharing
