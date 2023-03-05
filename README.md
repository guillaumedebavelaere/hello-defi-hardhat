[![CI](https://github.com/guillaumedebavelaere/hello-defi-hardhat/actions/workflows/ci.yml/badge.svg)](https://github.com/guillaumedebavelaere/hello-defi-hardhat/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/guillaumedebavelaere/hello-defi-hardhat/badge.svg?branch=master)](https://coveralls.io/github/guillaumedebavelaere/hello-defi-hardhat?branch=master)

# HelloDefi hardhat + ethers

This project is the same as https://github.com/guillaumedebavelaere/HelloDefi, but uses different tools:
- Hardhat
- Ethers.js

In addition:
- Added test coverage (solidity-coverage)
- Eth gas reporter with price in usd (via coinmarket cap api)
- Added Etherscan contract verification when deploying
- Using mock functionnality from waffle in tests
- Added solhint
- Change the deployment config with the use of hardhat-deploy plugin, so it is easier to deploy on multiple chains
- Added Mumbai deployment config
- Added staging test + separateed into sub directories unit tests and staging test 

## Requirments
- Node 16 
- Yarn
- Hardhat

## Smart contract installation

```
cd ./hardhat
```

```
yarn install
```

Create an .env file with  the following
```
GOERLI_URL_RPC=https://goerli.infura.io/v3/your-infura-id // or any other rpc provider
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-alchemy-id // or any other rpc provider
PRIVATE_KEY=your-private-key // Used during deploy
ETHERSCAN_API_KEY=your-etherscan-key // Used during deploy for smart contract verification in etherscan
POLYGONSCAN_API_KEY=your-etherscan-key // Used during deploy for smart contract verification in polygonscan
REPORT_GAS=true // To get a gas report when executing tests
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key // To get the smart contracts deployment and methods cost in usd when executing the tests
```

Compile
```
yarn hardhat compile
```

Deploy

```
yarn hardhat deploy --network networkName
```

Tests
```
yarn hardhat test
```

Coverage
```
yarn hardhat coverage
```
