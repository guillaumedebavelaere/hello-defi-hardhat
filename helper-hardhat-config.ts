const networkConfig: ExtraConfig = {
    5: {
        name: "goerli",
        aave2LendingPool: "0x4bd5643ac6f66a5237E18bfA7d47cF22f1c9F210",
        aave2DataProvider: "0x927F584d4321C1dCcBf5e2902368124b02419a1E",
        linkUsdPriceFeed: "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
        daiUsdPriceFeed: "0x0d79df66BE487753B02D015Fb622DED7f0E9798d",
        verifyContract: true
    },
    80001: {
        name: "mumbai",
        aave2LendingPool: "0x9198F13B08E299d85E096929fA9781A1E3d5d827",
        aave2DataProvider: "0xFA3bD19110d986c5e5E9DD5F69362d05035D045B",
        linkUsdPriceFeed: "0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408",
        daiUsdPriceFeed: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
        verifyContract: true
    }
}

const developmentChains = ["hardhat", 31337]

interface ExtraConfig {
    [key: number]: { 
        name: string; 
        aave2LendingPool: string;
        aave2DataProvider: string;
        linkUsdPriceFeed: string;
        daiUsdPriceFeed: string;
        verifyContract: boolean;
    }
  }

export {
    networkConfig,
    developmentChains,
}