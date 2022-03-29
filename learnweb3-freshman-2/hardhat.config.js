// waffle already includes ethers
require('@nomiclabs/hardhat-waffle')
const dotenv = require('dotenv')
dotenv.config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.0',
  networks: {
    // this is how you point hardhat at rinkeby (via alchemy API)
    rinkeby: {
      // get this from your alchemy dash
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_PRIVATE_KEY}`,
      // add private key from your wallet
      accounts: [`${process.env.METAMASK_PRIVATE_KEY}`],
      // optional parameter to set gas limit
      gas: 10000000,
    },
  },
}
