import React from 'react'
import Head from 'next/head'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, ethAddressLookupField: '', failed: false }
  }
  fetchBalances(params) {
    this.setState({ loading: true, failedSearch: false })
    fetch('http://localhost:4000/balances', {
      method: 'GET',
      headers: { eth_address_lookup_field: this.state.ethAddressLookupField },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.code === 'INVALID_ARGUMENT') {
          this.setState({
            firstLoad: true,
            loading: false,
            failedSearch: true,
          })
        }
        this.setState({
          firstLoad: true,
          totalSupply: data.totalSupply,
          address: data.address,
          balanceAtAddress: data.balanceAtAddress,
          loading: false,
        })
      })
  }
  render() {
    return (
      <>
        <Head>
          <meta name="author" content="Harry Kingdon" />
          <meta name="description" content="Trade BAZ on BazCoin Exchange" />
          <link rel="icon" href="favicon.png" type="image/x-icon" />
          <title>BazCoin Exchange</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossorigin="anonymous"
          />
        </Head>
        <h1>BazCoin Exchange</h1>
        <div className="alert alert-warning">Permanent beta - Rinkeby only</div>
        {/* Display BazCoin balances */}
        <h2>Total wealth transparency - see who owns how much BAZ:</h2>
        <form
          class="wealthSearchForm"
          onSubmit={(event) => {
            event.preventDefault()
            this.fetchBalances()
          }}
        >
          <label class="form-label">
            Enter the public key of the wallet you'd like to check:
          </label>
          <input
            class="form-control"
            type="text"
            name="address"
            placeholder="0x00000000000000000000000000000000000000000"
            required
            value={this.state.ethAddressLookupField}
            onChange={(event) =>
              this.setState({ ethAddressLookupField: event.target.value })
            }
          />
          <br />
          <input
            class="btn btn-primary"
            type="submit"
            value={this.state.loading ? 'Loading...' : 'Search BAZ Balance'}
          />
        </form>
        <br />
        {this.state.failedSearch && (
          <div className="alert alert-failure">
            <p>They don't have any BAZ 😭</p>
          </div>
        )}
        {this.state.firstLoad && !this.state.failed && (
          <div className="alert alert-primary">
            <p>
              <strong>Total BAZ in circulation:</strong>
            </p>
            <p>{this.state.totalSupply} BAZ</p>
            <p>
              <strong>Total held by {this.state.address}:</strong>
            </p>
            <p>{this.state.balanceAtAddress} BAZ</p>
          </div>
        )}
        {/* Transfer BazCoin to this guy */}

        {/* Buy BazCoin from this other guy */}

        {/* List an offer to buy BazCoin at a given price */}

        {/* List an offer to sell BazCoin at a given price */}
      </>
    )
  }
}

export default Home
