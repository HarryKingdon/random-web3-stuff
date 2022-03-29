async function main() {
  // We get the contract to deploy
  const BAZToken = await ethers.getContractFactory('BAZToken')
  const bazToken = await BAZToken.deploy(69)
  await bazToken.deployed()
  console.log('BAZToken deployed to:', bazToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
