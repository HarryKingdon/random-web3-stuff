async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  // presumably hardhat just knows where to look purely from the name
  const Token = await ethers.getContractFactory('Token')
  // again, which network is it deploying to?!
  const token = await Token.deploy()
  console.log('Token address:', token.address)
}

// ohhhh
// you run this file by using npx hardhat run scripts/deploy.js --network <network-name>
// there you can specify the network. the default without specifying a network is the hardhat network for development

// you can specify a network in your hardhat.config.js file

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
