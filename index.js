const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const ethers = require('ethers');
const EventEmitter = require('events');
const { abi } = require('./abi.json');

const PORT = process.env.PORT || 4001;
const WS_KEY = process.env['WS_KEY'];

const CONTRACT_ADDRESS = '0xFBe59DcE1922d215A2B0DB76985469276D70AD02';

const provider = new ethers.providers.WebSocketProvider(`wss://eth-rinkeby.alchemyapi.io/v2/${WS_KEY}`, 'rinkeby');

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

app.use(express.json());

app.get('/', (req, res) => {
  
  console.log('Waiting for contract to emit event...');
  
  contract.removeAllListeners(); // avoid duplicates on server restart
  
  contract.on("NewNumber", (successMsg, x) => {
    console.log("x: ", Number(x));
    console.log("successMsg: ", successMsg);
  });
  
  res.end('ok so check it');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
})