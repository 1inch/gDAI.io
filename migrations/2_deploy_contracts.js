const CompoundTokenization = artifacts.require("CompoundTokenization");

module.exports = function (deployer) {
    deployer.deploy(CompoundTokenization);
};
