// 4. Perform a read balance operation with the backend

// 4.1. Read a property of the contract itself
// 4.1.1. A provider (ethers, with Alchemy). You can just do this in the terminal by appending your script with --network rinkeby. It links you to (1) the chain and also (2) a signer or signers if required, because you just need access to a private key and that's provided in the config file (or metamask when you get to doing this in the FE)

const { ethers } = require('hardhat')

async function main() {
  // 4.1.2. A way to treat the contract as a local JS object that we can perform methods on. Ethers may help here. I'm using https://ethereum.stackexchange.com/questions/95023/hardhat-how-to-interact-with-a-deployed-contract
  console.log('looking for bazTokenContract...')
  // First you need to capture the address
  const address = '0xf79DFfB86043B12be345F44F2717C52a799B48AE'
  // then ethers and hardhat have a special method called .getContractFactory(). "A ContractFactory in ethers.js is an abstraction [of] [...] smart contracts, so the constant here is a factory for instances of our token contract.""
  const BazTokenContractFactory = await ethers.getContractFactory('BAZToken')
  const locatedBazTokenContract = await BazTokenContractFactory.attach(address)

  // Now that it's addressed, you can call functions of the contract. See a list for ERC20 as implemented by OZ at https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20
  const totalSupply = await locatedBazTokenContract.totalSupply()
  console.log(`Total supply is ${totalSupply / 10 ** 18}`)

  // We can also log people's balance of the token
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
