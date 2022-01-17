const { assert, expect } = require("chai");
const Token = artifacts.require("MyToken");
const DutchAuction = artifacts.require("DutchAuction");
const { time } = require('@openzeppelin/test-helpers');

contract("DutchAuction", function(accounts) {
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; //in wei
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;
    var numberOfTokens; 
    var auctionPrice;
    var otherPrice;
    
    it("intializes the contract with correct values", function(){
        return DutchAuction.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has a token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });
    describe("when testing time deduction", () => {
        it("Deducts the price by day correctly", function (){
            return Token.deployed().then(function(instance){
                tokenInstance = instance;
                return DutchAuction.deployed();
          }).then(function(instance){
              tokenSaleInstance = instance;
            let duration = time.duration.days(2);
            time.increase(duration);
            return tokenSaleInstance.tokenPrice();
          }).then(function(price) {
              otherPrice = price.toNumber();
              return tokenSaleInstance.getCurrentPrice();
          }).then(function(receipt) {
              auctionPrice = receipt.toNumber();
            return expect(auctionPrice).to.be.lessThan(otherPrice);
          });
        });
        it("Raises an error when buy function is called after auction ended", function (){
            return Token.deployed().then(function(instance){
                tokenInstance = instance;
                return DutchAuction.deployed();
          }).then(function(instance){
              tokenSaleInstance = instance;
            let duration = time.duration.days(32);
            time.increase(duration);
            numberOfTokens = 10;
          return tokenSaleInstance.buy(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
          }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
          });
        });
    });



    it('facilitates token buying', function() {
        return Token.deployed().then(function(instance) {
          // Grab token instance first
          tokenInstance = instance; 
          return DutchAuction.deployed();
        }).then(function(instance) {
            // then grab token sale instance
          tokenSaleInstance = instance;
          // provision %75 to dutch auction sale
        //   return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        }).then(function(receipt) {
          numberOfTokens = 10;
          return tokenSaleInstance.buy(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args.buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) { 
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) { 
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) { 
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            //try to buy tokens different from ether value
            return tokenSaleInstance.buy(numberOfTokens, {from: buyer, value: 1})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buy(800000, {from: buyer, value: numberOfTokens * tokenPrice})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>= 0, 'cannot purchase more tokens than available');
        });
    });
    it("ends token auction", function() {
        return Token.deployed().then(function(instance) {
            // Grab token instance first
            tokenInstance = instance;
            return DutchAuction.deployed();
        }).then(function(instance){
            //grab auction instance
            tokenSaleInstance = instance;
            //try to end auction form account other than the admin
            return tokenSaleInstance.endAuction({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
            console.log("made it past")
            return tokenSaleInstance.endAuction({from:admin});
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 1000000, 'returns all unsold tokens to admin');
        });
    });
});