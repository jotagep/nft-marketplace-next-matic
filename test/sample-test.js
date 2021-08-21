const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy();

    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed()
    const nftContractAddress = nft.address
    
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');
    
    await nft.createToken("https://tokenUrl.com")
    await nft.createToken("https://tokenUrl2.com")

    const txOptions = { value: listingPrice };
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, txOptions)
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, txOptions)

    const[_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    const items = await market.fetchMarketItems()

    const itemsParsed = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
    }))
    
    const expected = [{
      price: '100000000000000000000',
      tokenId: '2',
      seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      owner: '0x0000000000000000000000000000000000000000',
      tokenUri: 'https://tokenUrl2.com'
    }]

    expect(itemsParsed).to.deep.equal(expected)
  });
});
