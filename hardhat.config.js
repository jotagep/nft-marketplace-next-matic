const task = require('hardhat/config').task;
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

task('fund', 'Get 1 ETH into your account')
	.addPositionalParam('address', "Your account's address")
	.setAction(async (taskArgs, { ethers, network }) => {
    const { address } = taskArgs;
		try {
      const signer = ethers.provider.getSigner()
			const tx = await signer.sendTransaction({
				to: address,
        gasLimit: ethers.utils.hexlify(120000),
        gasPrice: ethers.utils.parseUnits("4.1", "gwei"),
				value: ethers.utils.parseEther("0.1"),
				nonce: await signer.getTransactionCount(),
				chainId: network.config.chainId,
			});
      console.log(tx)
      await tx.wait();
			console.log('Funds Done ✅');
			console.log('==================================');
		} catch (error) {
			console.log('Funds Failed ❌');
			error.reason ? console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`) : console.log(error);
		}
	});