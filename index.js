const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const cors = require('cors');
const ethers = require('ethers');
const EventEmitter = require('events');
const axios = require('axios').default;
const { abi } = require('./utils/abi.json');

const Database = require("@replit/database");
const db = new Database();

const PORT = process.env.PORT || 4001;
const WS_KEY = process.env['WS_KEY'];

const CONTRACT_ADDRESS = '0xFBe59DcE1922d215A2B0DB76985469276D70AD02';
const SERVER_ADDRESS = 'https://eth-event-api.vincanger.repl.co';

const provider = new ethers.providers.WebSocketProvider(`wss://eth-rinkeby.alchemyapi.io/v2/${WS_KEY}`, 'rinkeby');

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

app.use(express.json());
app.use(cors());

contract.removeAllListeners(); // avoid duplicates on server restart
contract.on("NewNumber", (successMsg, x) => {
  const newNumber = Number(x); 
  console.log("x: ", newNumber);
  console.log("successMsg: ", successMsg);
  axios.post(`${SERVER_ADDRESS}`, {num: newNumber})
});

app.get('/', async (req, res, next) => {
  const number = await getRecentNumber();
  res.send('the last number was:' + number.toString());  
});

app.post('/', (req, res) => {
  db.set("lastValue", req.body.num).then(() => {
    console.log(req.body.num, ' set in DB');
  });
  
  res.end();
});

app.get('/number', async (req, res) => {
  const num = await getRecentNumber();
  res.send(num.toString());
});

const getRecentNumber = async () => {
  return await db.get("lastValue")
}

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
    console.log('\nWaiting for contract to emit new event...');
});