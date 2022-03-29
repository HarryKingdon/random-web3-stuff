const { ethers } = require('hardhat')
const { BigNumber } = require('@ethersproject/bignumber')

async function transferBalance() {
  console.log('looking for bazTokenContract...')
  const BazTokenContractFactory = await ethers.getContractFactory('BAZToken')
  const address = '0xf79DFfB86043B12be345F44F2717C52a799B48AE'
  const locatedBazTokenContract = await BazTokenContractFactory.attach(address)

  // We can also perform transfers
  // Note I got an error - from https://docs.ethers.io/v5/troubleshooting/errors/#help-UNPREDICTABLE_GAS_LIMIT - During gas estimation it is possible that a transaction would actually fail (and hence has no reasonable estimate of gas requirements) or that the transaction is complex in a way that does not permit a node to estiamte the gas requirements, in which case this error is thrown. In almost all cases, this will unfortunately require you specify an explicit gasLimit for your transaction, which will disable ether's automatic population of the gasLimit field, which will cause this error to go away. To dial in an appropriate gas limit, try a value that is much higher than you expect, and then make a few transactions to discover reasonable values and then you can reduce this value down to that ballpark. Keep in mind this error can also occur if the transaction would legitimately fail, in which case the root cause must be addressed, such as ensuring the correct Signer is being used, the appropriate allowance for an ERC-20 token has been approved, etc.
  // to set gas limits you need to configure your config file. see https://hardhat.org/config/#json-rpc-based-networks

  const account1PublicKey = '0x52277e5CF8dF8eF51d9bD37D8D7553A72D378BEf'
  const account2PublicKey = '0xd89c4C3778A6086a88d3a27fa1c4ADB066929Fca'

  const account1Balance = await locatedBazTokenContract.balanceOf(
    account1PublicKey,
  )
  const account2Balance = await locatedBazTokenContract.balanceOf(
    account2PublicKey,
  )
  console.log(`Account 1 has balance: ${account1Balance / 10 ** 18}`)
  console.log(`Account 2 has balance: ${account2Balance / 10 ** 18}`)

  console.log('initiating transaction...')

  await locatedBazTokenContract
    .transfer(account2PublicKey, BigNumber.from((2 * 10 ** 18).toString()))
    .then(() => console.log('transaction complete.'))
    .catch((err) => console.log(err))
}

transferBalance()
  .then(() => process.exit(0))
  .then(() => {
    console.log(err)
    process.exit(1)
  })
