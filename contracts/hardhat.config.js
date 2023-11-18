require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    chilizTestnet: {
      url: process.env.CHILIZ_TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
    chilizMainnet: {
      url: process.env.CHILIZ_MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }  
}