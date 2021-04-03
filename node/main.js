const axios = require("axios");

const targetSymbol = "BKTC";

const getURL = (address) => {
  return `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=K7ST5DC6VP2Z5ZVWWD1IB3JDB5AHIEV274`;
};

const fetchRoute = async (address) => {
  const url = getURL(address);
  const { data } = await axios.get(url);
  return data.result;
};

let accountbalance = {};
const findRoute = async (address) => {
  const result = await fetchRoute(address);
  let route = [];

  for (let transaction of result) {
    if (
      transaction.tokenSymbol === targetSymbol &&
      transaction.from.toLowerCase() === address.toLowerCase()
    ) {
      route.push({
        TxHash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
      });
      // console.log(transaction.to);
      route = route.concat(await findRoute(transaction.to));
    }
    accountbalance[transaction.from] =
      ((accountbalance[transaction.from] || 0) - transaction.value) / ether;
    accountbalance[transaction.to] =
      (accountbalance[transaction.to] || 0) + transaction.value / ether;
  }

  return route;
};

const start = async () => {
  const address = "0xEcA19B1a87442b0c25801B809bf567A6ca87B1da";
  const route = await findRoute(address);
  const addressArray = [];
  for (let i = 0; i < route.length; i++) {
    addressArray.push(route[i].to);
    addressArray.push(route[i].from);
    console.log(
      i + 1,
      route[i].TxHash,
      route[i].from,
      route[i].to,
      route[i].value
    );
  }

  // get all unique transaction
  let uniqueAddr = Array.from(new Set(addressArray));
  // ------------------ balance ---------------------------
  for (let i = 0; i < address.length; i++) {
    if (uniqueAddr[i] !== undefined) {
      console.log(i + 1, uniqueAddr[i], accountbalance[uniqueAddr[i]]);
    }
  }
};

start();
