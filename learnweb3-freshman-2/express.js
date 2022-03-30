const express = require('express')
const app = express()
const port = 4000
const { ethers } = require('hardhat')
const dotenv = require('dotenv')
const BazTokenABI = require('./artifacts/contracts/BAZToken.sol/BAZToken.json')
  .abi
dotenv.config()

app.get('/balances', async (req, res) => {
  console.log('looking for bazTokenContract...')
  // before we start we need to find the provider. We can't use Hardhat because we're doing this programmatically.
  // we can't use getContractFactory because that's limited to Hardhat. So how to interact with the contract?
  // We just use new ethers.Contract(address, ABI, provider)
  // We need to get all three. The address we just know, the ABI we get from (parsing) the automatically generated hardhat files from when we deployed, and the provider, well:

  const provider = ethers.getDefaultProvider('rinkeby', {
    alchemy: process.env.ALCHEMY_PRIVATE_KEY,
  })

  const BazTokenContract = new ethers.Contract(
    '0xf79DFfB86043B12be345F44F2717C52a799B48AE',
    BazTokenABI,
    provider,
  )
  //   Now that it's addressed, you can call functions of the contract. See a list for ERC20 as implemented by OZ at https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20
  const totalSupply = await BazTokenContract.totalSupply()
  console.log(`Total supply is ${totalSupply / 10 ** 18}`)

  //   We can also log people's balance of the token
  const address = req.headers.eth_address_lookup_field
  const balanceAtAddress = await BazTokenContract.balanceOf(address).catch(
    (err) => {
      res.send(err)
    },
  )
  console.log(`balance is ${balanceAtAddress}`)
  res.json({
    totalSupply: totalSupply / 10 ** 18,
    address: address,
    balanceAtAddress: balanceAtAddress / 10 ** 18,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
