const BridgeCoin = artifacts.require("BridgeCoin");

module.exports = async (deployer) => {
  const initialSupply = 1000000 * 10**3;
  await deployer.deploy(BridgeCoin, initialSupply);
};