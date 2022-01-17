const path = require("path");
// const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path: "/Users/hamzaahmed/Desktop/Solidity/migrations/.env"});
const MetaMaskAccountIndex = 0;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 8545,
      host: "127.0.0.1",
      network_id: 1337
    },
    ganache_local: {
      provider: function() {
          return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:8545", MetaMaskAccountIndex )
      },
      network_id: 1337
      }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
