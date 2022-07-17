# Carbon NFT


built by lisztcoin@, specifically for sustainable blockchain hackathon.

Carbon NFT is a lucky draw system. It will reward one random person an NFT from all people who have reported about the things they did that benefit the environment on the previous day.

[Link to Demo](https://youtu.be/TLvybBBwBwc)

Try it live on [carbonnft.web.app](carbonnft.web.app) (please connect to Rinkeby, no ETH is needed)

IPFS related technology used:

* OrbitDB for storing information about participants
* NFT.Storage for storing NFT image and metadata

Sustainability Highlight:

* Users do not need to pay any coin to participate. Reporting and rewarding does not require user transaction which lowers the barrier of entry a lot.
* Only one transaction daily to mint an NFT directly to the winner.

Important code pointers:

* OrbitDB related: [report page](https://github.com/lisztcoin/carbonnft/blob/main/src/views/Questions.js), [mint control](https://github.com/lisztcoin/carbonnft/blob/main/src/views/MintControl.js)
* NFT.Storage related: [mint control](https://github.com/lisztcoin/carbonnft/blob/main/src/views/MintControl.js)
* Chainlink Random number generator: [contract](https://github.com/lisztcoin/carbonnft/blob/main/src/contract/carbonNFT.sol)

Workflow:

1. User connects wallet using metamask
2. User goes to the "Report Your Actions" tab to report their daily actions that benefit the environment. (OrbitDB directly records this in its key value database so no explicit transaction needed from users)
3. Admin goes to /mintcontrol to trigger the lucky draw event. It is supposed to be a script running daily to trigger the event, but for hackathon showcasing purpose, I've changed it to manual trigger and anyone can trigger this event at anytime for people to try it out. (When lucky draw event is triggered, all participants in the database will be passed as a parameter to the mint function. mint function will use the random number generated by chainlink to determine the winner and mint an NFT to the person. It will also request a new random number from chainlink for next round of lucky draw)
4. User goes to the "Your Rewards" tab to check the NFTs they have won. They can also go to the opensea collections to check who have won previously.

Notes:

* Mint trigger is manual for hackathon showcasing purpose.
* Random number variable is public in contract for hackathon showcasing purpose.
* Using same image for all NFTs for simplicity. Metadata for each NFT is different.

Local Dev Instructions

* Download code, npm install
* npm start
* Go to [chainlink VRF page](https://vrf.chain.link/) to create a subscription
* Deploy carbonNFT.sol in the src/contract folder in Rinkeby, using the subscription id as one of the constructor parameter
* Go to your chain link subscription page to add the contract address as a consumer
* Call contract's requestRandomWords function to get a random number for the first lucky draw
* Create a key-value database on localhost:3000/secret url
* Copy the contract address and database address to constants.js in src/config folder
* Setup done. Follow the above workflow to try it yourself

Reference:

* [orbitdb control center](https://github.com/orbitdb/orbit-db-control-center)