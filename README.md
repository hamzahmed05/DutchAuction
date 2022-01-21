# DutchAuction

The Dutch Auction is a type of reverse auction. The auctioneer starts with a high asking price and gradually lowers it until someone bids. The bidder is the winner.

If something needs to be sold, a price has to be found. Many systems have been created to facilitate price discovery: negotiations, order books, market research and even horoscopes. However, none are as effective at immediate price discovery as auctions. They are the way to facilitate the sale of anything – an artwork, a deed or a right – to the immediate market. 

Their simplicity, effectiveness and power have cemented auctions as a cornerstone of decentralized finance and one auction type is almost universally found among the largest decentralized finance applications: the Dutch Auction. The total duration is known before the auction has begun; it is incredibly effective at price discovery because of its completely transparent and predictable operation; it allows immediate delivery upon payment, and most importantly it allows for the fewest transactions for everybody: 1. Paid by the buyer.


# The Project
Tools:

- Truffle: framework to create dapps on the ethereum network
- Web3 JS: enables client side app to talk to the blockchain

Libary:
- OpenZeppelin - ERC20 token


Cient folder contains files for frontend. Can be ignored. 
# Detailed Overview
The token contract will release 1m MTA tokens available for purchase in the dutch auction. The dutch auction shall last for 30 days, and the token price is set as well as the price deduction rate for the dutch auction. If all the tokens sell out before the 30 day period, the dutch auction ends as there are no tokens left to sell. If the dutch auction period ends with tokens still available, the remaining tokens are transferred to the dutch auction admin.

- Length: 30 days
- Tokens: 1,000,000
- Funding Currency: Ether
- Starting Price: 0.001 Ether
- Price decution rate: 0.00001 Ether/day
- Example of price deduction:
  - Day 1 : 0.001
  - Day 2 : 0.00099
  - Day 3 : 0.00098
  - Day 4 : 0.00097


## Setup

Must have Truffle installed

`cd DutchAuction`

`npm install`

`truffle migrate`

run tests

`truffle test`
