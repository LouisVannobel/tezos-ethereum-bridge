const BridgeVault = artifacts.require("BridgeVault");

module.exports = async (deployer) => {
  const tokenAddress = process.env.ERC20_ADDRESS;
  const relayerAddress = process.env.RELAYER_ADDRESS;
  await deployer.deploy(BridgeVault, tokenAddress, relayerAddress);
};