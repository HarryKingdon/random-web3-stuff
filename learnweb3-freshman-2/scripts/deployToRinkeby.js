const { BigNumber } = require('@ethersproject/bignumber')

async function main() {
  // Signer is got from how you define the network in hardhat.config.js
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())
  const BAZToken = await ethers.getContractFactory('BAZToken')

  // ERC20 Tokens have 18 decimals, so we need to denominate at least 10^18 primitive units for one token

  // const bazToken = await BAZToken.deploy(100000000000000000000)

  // When handling big numbers, though, we need to use BigNumber.from(1000000000000000000). See https://docs.ethers.io/v5/troubleshooting/errors/#help-NUMERIC_FAULT-overflow

  const bazToken = await BAZToken.deploy(
    BigNumber.from('100000000000000000000'),
  )

  await bazToken.deployed()
  console.log('BAZToken deployed to:', bazToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
