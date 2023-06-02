// @ts-nocheck
import {
    MediaRenderer,
    ThirdwebNftMedia,
    useContract,
    useContractEvents,
    useValidDirectListings,
    useValidEnglishAuctions,
    Web3Button,
  } from "@thirdweb-dev/react";
  import React, {  useEffect, useState } from "react";
  import Container from "../../../components/Container/Container";
  import { GetStaticProps, GetStaticPaths } from "next";
  import { CHAIN_ID_TO_NAME, Marketplace, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
  import {
    ETHERSCAN_URL,
    MARKETPLACE_ADDRESS,
    NETWORK,
    NFT_COLLECTION_ADDRESS,
  } from "../../../consts/contractAddresses";
  import styles from "../../../styles/Token.module.css";
  import Link from "next/link";
  import randomColor from "../../../utils/randomColor";
  import Skeleton from "../../../components/Skeleton/Skeleton";
  import toast, { Toaster } from "react-hot-toast";
  import toastStyle from "../../../utils/toastConfig";
  import { useNFTs } from "@thirdweb-dev/react";
  import { useRouter } from "next/router";
//   import Checkout from "../../../components/Checkout";

  type Props = {
    nft: NFT;
    contractMetadata: any;
  };
  
  
  const [randomColor1, randomColor2] = [randomColor(), randomColor()];
  
  
  export default function TokenPage({  contractMetadata }: Props) {
    const [bidValue, setBidValue] = useState<string>();
       // get token id from url
       const router = useRouter();
       const { tokenId } = router.query;
    // const [nft,setNft] = useState();
    // Connect to marketplace smart contract
    const { contract: marketplace, isLoading: loadingContract } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3"
    );
  
    console.log(marketplace?.directListings,"Marketplace.directListings");
  
    // Connect to NFT Collection smart contract
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: nfts, isLoading : nftloading } = useNFTs(nftCollection);
    // get the nft from the nfts by traversing the nfts array and matching the tokenId
    const nft = nfts?.find((nft) => nft?.metadata.id === tokenId);
    // const nft = nftCollection?.erc1155.get(tokenId);
    console.log(nfts,nft,"nfts");



    const { data: directListing, isLoading: loadingDirect } =
      useValidDirectListings(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
        tokenId: tokenId as string,
      });
  
    // 2. Load if the NFT is for auction
    const { data: auctionListing, isLoading: loadingAuction } =
      useValidEnglishAuctions(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
        tokenId: tokenId as string,
      });
      
  
      async function getAllValidOffers(walletAddress : any, contractAddress, tokenId, start, count) {
        const offers = await marketplace?.offers.getAllValid({
          offeror: walletAddress, // Offers made by this wallet address
          seller: walletAddress, // Offers on items being sold by this wallet address
          tokenContract: contractAddress, // Offers on items from this contract
          tokenId: tokenId, // Offers on this specific token
          start: start, // Pagination: Start from this index
          count: count, // Pagination: Return this many results
        });
      
        return offers;
      }
      
  
    // Load historical transfer events: TODO - more event types like sale
    const { data: transferEvents, isLoading: loadingTransferEvents } =
      useContractEvents(nftCollection, "Transfer", {
        queryFilter: {
          filters: {
            tokenId: tokenId as string,
          },
          order: "desc",
        },
      });
  
    async function createBidOrOffer() {
      let txResult;
      if (!bidValue) {
        toast(`Please enter a bid value`, {
          icon: "❌",
          style: toastStyle,
          position: "bottom-center",
        });
        return;
      }
  
      if (auctionListing?.[0]) {
        txResult = await marketplace?.englishAuctions.makeBid(
          auctionListing[0].id,
          bidValue
        );
      } else if (directListing?.[0]) {
        txResult = await marketplace?.offers.makeOffer({
          assetContractAddress: NFT_COLLECTION_ADDRESS,
          tokenId: tokenId as string,
          totalPrice: bidValue,
        });
      } else {
        throw new Error("No valid listing found for this NFT");
      }
  
      return txResult;
    }
  
    async function buyListing() {
      let txResult;
  
      if (auctionListing?.[0]) {
        txResult = await marketplace?.englishAuctions.buyoutAuction(
          auctionListing[0].id
        );
      } else if (directListing?.[0]) {
        txResult = await marketplace?.directListings.buyFromListing(
          directListing[0].id,
          1
        );
      } else {
        throw new Error("No valid listing found for this NFT");
      }
      return txResult;
    }
    interface Attributes {
      trait_type: string;
      value: string;
    }
  
    return (
      <>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Container maxWidth="lg">
          <div className={styles.container}>
            <div className={styles.metadataContainer}>
              <ThirdwebNftMedia
                metadata={nft?.metadata}
                className={styles.image}
              />
  
              <div className={styles.descriptionContainer}>
                <h3 className={styles.descriptionTitle}>Description</h3>
                <p className={styles.description}>{nft?.metadata.description}</p>
  
                <h3 className={styles.descriptionTitle}>Traits</h3>
  
                <div className={styles.traitsContainer}>
                  {Object.entries(nft?.metadata?.attributes || {}).map(
                    ([key, value]: [string, Attributes]) => {
                      if (value) {
                        return (
                          <div className={styles.traitContainer} key={key}>
                            <p className={styles.traitName}>{value.trait_type}</p>
                            <p className={styles.traitValue}>{value.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
  
  
                <h3 className={styles.descriptionTitle}>History</h3>
  
                <div className={styles.traitsContainer}>
                  {transferEvents?.map((event, index) => (
                    <div
                      key={event.transaction.transactionHash}
                      className={styles.eventsContainer}
                    >
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>Event</p>
                        <p className={styles.traitValue}>
                          {
                            // if last event in array, then it's a mint
                            index === transferEvents.length - 1
                              ? "Mint"
                              : "Transfer"
                          }
                        </p>
                      </div>
  
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>From</p>
                        <p className={styles.traitValue}>
                          {event.data.from?.slice(0, 4)}...
                          {event.data.from?.slice(-2)}
                        </p>
                      </div>
  
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>To</p>
                        <p className={styles.traitValue}>
                          {event.data.to?.slice(0, 4)}...
                          {event.data.to?.slice(-2)}
                        </p>
                      </div>
  
                      <div className={styles.eventContainer}>
                        <Link
                          className={styles.txHashArrow}
                          href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                          target="_blank"
                        >
                          ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
  
                <button onClick={async () => {
                    await getAllValidOffers( 
                      "0x0439427C42a099E7E362D86e2Bbe1eA27300f6Cb",
                      "0x60aDe2DBFC12fe45035EA9641e22952a8876410b", 
                      "0", 
                      0, 
                      100, );
                }}>Get Offers</button>
                
              </div>
            </div>
  
            <div className={styles.listingContainer}>
              {contractMetadata && (
                <div className={styles.contractMetadataContainer}>
                  <MediaRenderer
                    src={contractMetadata.image}
                    className={styles.collectionImage}
                  />
                  <p className={styles.collectionName}>{contractMetadata.name}</p>
                </div>
              )}
              <h1 className={styles.title}>{nft?.metadata.name}</h1>
              <p className={styles.collectionName}>Token ID #{tokenId as string}</p>
  
              <Link
                href={`/profile/${nft?.owner}`}
                className={styles.nftOwnerContainer}
              >
                {/* Random linear gradient circle shape */}
                <div
                  className={styles.nftOwnerImage}
                  style={{
                    background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                  }}
                />
                <div className={styles.nftOwnerInfo}>
                  <p className={styles.label}>Current Owner</p>
                  <p className={styles.nftOwnerAddress}>
                    {nft?.owner.slice(0, 8)}...{nft?.owner.slice(-4)}
                  </p>
                </div>
              </Link>
  
              <div className={styles.pricingContainer}>
                {/* Pricing information */}
                <div className={styles.pricingInfo}>
                  <p className={styles.label}>Price</p>
                  <div className={styles.pricingValue}>
                    {loadingContract || loadingDirect || loadingAuction ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {directListing && directListing[0] ? (
                          <>
                            {directListing[0]?.currencyValuePerToken.displayValue}
                            {" " + directListing[0]?.currencyValuePerToken.symbol}
                          </>
                        ) : auctionListing && auctionListing[0] ? (
                          <>
                            {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                            {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                          </>
                        ) : (
                          "Not for sale"
                        )}
                      </>
                    )}
                  </div>
  
                  <div>
                    {loadingAuction ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {auctionListing && auctionListing[0] && (
                          <>
                            <p className={styles.label} style={{ marginTop: 12 }}>
                              Bids starting from
                            </p>
  
                            <div className={styles.pricingValue}>
                              {
                                auctionListing[0]?.minimumBidCurrencyValue
                                  .displayValue
                              }
                              {" " +
                                auctionListing[0]?.minimumBidCurrencyValue.symbol}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
  
              {loadingContract || loadingDirect || loadingAuction ? (
                <Skeleton width="100%" height="164" />
              ) : (
                <>
                  <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={async () => await buyListing()}
                    onSuccess={() => {
                      toast(`Purchase success!`, {
                        icon: "✅",
                        style: toastStyle,
                        position: "bottom-center",
                      });
                    }}
                    onError={(e) => {
                      toast(`Purchase failed! Reason: ${e.message}`, {
                        icon: "❌",
                        style: toastStyle,
                        position: "bottom-center",
                      });
                    }}
                  >
                    Buy at asking price
                  </Web3Button>
                
                    {/* <Checkout /> */}
                  <div className={`${styles.listingTimeContainer} ${styles.or}`}>
                    <p className={styles.listingTime}>or</p>
                  </div>
  
                  <input
                    className={styles.input}
                    defaultValue={
                      auctionListing?.[0]?.minimumBidCurrencyValue
                        ?.displayValue || 0
                    }
                    type="number"
                    step={0.000001}
                    onChange={(e) => {
                      setBidValue(e.target.value);
                    }}
                  />
  
                  <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={async () => await createBidOrOffer()}
                    onSuccess={() => {
                      toast(`Bid success!`, {
                        icon: "✅",
                        style: toastStyle,
                        position: "bottom-center",
                      });
                    }}
                    onError={(e) => {
                      console.log(e);
                      toast(`Bid failed! Reason: ${e.message}`, {
                        icon: "❌",
                        style: toastStyle,
                        position: "bottom-center",
                      });
                    }}
                  >
                    Place bid
                  </Web3Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </>
    );
  }