require('@nomiclabs/hardhat-waffle')

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const RINKEBY_PRIVATE_KEY = '---'

module.exports = {
  solidity: '0.7.3',
  networks: {
    ropsten: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/3UyiPpVxlDtmntxcEZHa7B46ieQYYIe5`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
}
