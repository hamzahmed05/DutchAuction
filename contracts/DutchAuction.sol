pragma solidity >=0.7.0;
// SPDX-License-Identifier: MIT
import "./MyToken.sol";

contract DutchAuction {
    // event for buy order
    event Sell(address indexed buyer, uint _amount);
    address public owner;

    MyToken public tokenContract;
    uint public tokenPrice; 
    uint public tokensSold;
    uint public startAt;
    uint public priceDeductionRate;
    uint public expiresAt;
    Stage public stage;

    enum Stage {
        AuctionDeployed,
        AuctionEnded
    }


    constructor(MyToken _tokenContract, uint _tokenPrice, uint _priceReductionRate){
        
        owner = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        startAt = block.timestamp;
        expiresAt = block.timestamp +  30 days;
        priceDeductionRate = _priceReductionRate;
        stage = Stage.AuctionDeployed;
    }
    modifier isOwner() {
        if (msg.sender != owner)
            // Only owner is allowed to proceed
            revert("Only owner can do this");
        _;
    }
    modifier auctionOn() {
        if (stage != Stage.AuctionDeployed || block.timestamp > expiresAt)
            revert("Auction ended");
        _;
    }
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y==0 || (z = x*y) / y==x);
    }
    function buy(uint _numberOfTokens) public payable auctionOn {
        uint currentPrice = getCurrentPrice();
        require(msg.value == multiply(_numberOfTokens, currentPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        Sell(msg.sender, _numberOfTokens);
    }
    function getCurrentPrice() public view returns(uint) {
        uint timeElapsed = block.timestamp - startAt;
        uint daysPassed = uint(timeElapsed) / 1 days;
        uint deduction = priceDeductionRate * daysPassed;
        uint price = tokenPrice - deduction;
        return price;
    }
    function endAuction() public auctionOn isOwner {
        // Supposed to transfer remaining tokens to owner
        // require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))));
        stage = Stage.AuctionEnded;
    }
    

}