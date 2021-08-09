require("@nomiclabs/hardhat-waffle");

const projectId = process.env.INFURA_ID;
const accounts = {
  testnet: String(process.env.TESTNET_KEY)
}

module.exports = {
  network: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      account: [accounts.testnet]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      account: [accounts.testnet]
    }
  },
  solidity: "0.8.4",
};
