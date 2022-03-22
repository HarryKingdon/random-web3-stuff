App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow')
      var petTemplate = $('#petTemplate')

      for (i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name)
        petTemplate.find('img').attr('src', data[i].picture)
        petTemplate.find('.pet-breed').text(data[i].breed)
        petTemplate.find('.pet-age').text(data[i].age)
        petTemplate.find('.pet-location').text(data[i].location)
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id)

        petsRow.append(petTemplate.html())
      }
    })

    return await App.initWeb3()
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        // User denied account access...
        console.error('User denied account access')
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545',
      )
    }
    web3 = new Web3(App.web3Provider)

    return App.initContract()
  },

  initContract: function () {
    $.getJSON('Adoption.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data
      // this is where we attach the local contract to the local contracts JSON
      App.contracts.Adoption = TruffleContract(AdoptionArtifact)

      // Set the provider for our contract
      // Previously I thought the provider was a way to access the wallet and the correct network. Now I see that here we're taking the provider we've already set up (from initWeb3) and connecting it to our local version of the smart contract
      App.contracts.Adoption.setProvider(App.web3Provider)

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted()
    })

    return App.bindEvents()
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt)
  },

  markAdopted: function () {
    var adoptionInstance

    // why do we need to write "deployed" below? What is that doing? Deploying it to the blockchain? But why would you deploy contracts dynamically in browser?
    // certainly looks like you're dynamically deploying it to a blockchain. wtf
    // oh no - i think it may just be fetching the address of the deployed smart contract
    // ok here's from the docs

    // Creates an instance of the contract abstraction representing the contract at its deployed address. The deployed address is a special value given to @truffle/contract that, when set, saves the address internally so that the deployed address can be inferred from the given Ethereum network being used. This allows you to write code referring to a specific deployed contract without having to manage those addresses yourself. Like at(), deployed() is thenable, and will resolve to a contract abstraction instance representing the deployed contract after ensuring that code exists at that location and that that address exists on the network being used.
    App.contracts.Adoption.deployed()
      .then(function (instance) {
        adoptionInstance = instance
        // what is .call()?
        // from the docs:
        // Using call() allows us to read data from the blockchain without having to send a full transaction, meaning we won't have to spend any ether.

        return adoptionInstance.getAdopters.call()
      })
      .then(function (adopters) {
        for (i = 0; i < adopters.length; i++) {
          // note you only have to check for an empty address string rather than null or 0 or some other falsy value because the way adopters was initialised in the smart contract ensures that they are all address types in the array
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet')
              .eq(i)
              .find('button')
              .text('Success')
              .attr('disabled', true)
          }
        }
      })
      .catch(function (err) {
        console.log(err.message)
      })
  },

  handleAdopt: function (event) {
    event.preventDefault()

    var petId = parseInt($(event.target).data('id'))

    var adoptionInstance
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error)
      }
      // because right now metamask only has one account per accounts but perhaps not in future
      var account = accounts[0]

      App.contracts.Adoption.deployed()
        .then(function (instance) {
          // wtf is instance - oh it's the smart contract itself? in a way that we can do functions on it?
          adoptionInstance = instance

          // Execute adopt as a transaction by sending account - presumably this will need metamask confirmation from the user so it's an async method (at least thats one reason its async)

          // note we also cant do .call() as before because this is not read-only, will cost some gas
          return adoptionInstance.adopt(petId, { from: account })
        })
        .then(function (result) {
          // note that result is a
          return App.markAdopted()
        })
        .catch(function (err) {
          console.log(err.message)
        })
    })
  },
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
