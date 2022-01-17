var DutchAuction = artifacts.require("./DutchAuction.sol");
var MyToken = artifacts.require("MyToken.sol");
require("dotenv").config({path:"./.env"});

module.exports = function(deployer) {
    deployer.deploy(MyToken, 1000000).then(function() {
        // Token price is 0.001 Ether
        var tokenPrice = 1000000000000000; //in wei
        var deductionRate = 10000000000000
        return deployer.deploy(DutchAuction, DutchAuction.address, tokenPrice,deductionRate);
      });
};