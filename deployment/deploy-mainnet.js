const etherlime = require('etherlime-lib');
const gDAI = require('../build/gDAI.json');

const defaultConfigs = {
    gasPrice: 10000000000,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY
};

const deploy = async (network, secret) => {

    const deployer = new etherlime.InfuraPrivateKeyDeployer(process.env.PRIVATE_KEY, 'mainnet', process.env.INFURA_KEY, defaultConfigs);
    const contract = await deployer.deployAndVerify(
        gDAI,
        false,
        '0x4D37f28D2db99e8d35A6C725a5f1749A085850a3' // Fee receiver
    );
};

module.exports = {
    deploy
};
