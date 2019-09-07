const etherlime = require('etherlime-lib');
const gDAI = require('../build/gDAI.json');

const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(gDAI);
};

module.exports = {
	deploy
};
