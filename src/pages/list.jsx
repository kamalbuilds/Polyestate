import {
    ConnectWallet,
    useContract,
    useNFTs,
    useMintNFT,
    Web3Button,
    ThirdwebNftMedia,
} from "@thirdweb-dev/react";

export default function List(){
    const { contract } = useContract("0x2979d8b7A0D9024DFa73D37C946ff691Ff0bcc00");

    const { data : nfts , isLoading , isError } = useNFTs(contract);
    const { mutate : mintNft } = useMintNFT(contract);
    console.log(nfts,isLoading,isError,contract.erc1155,"nft");

    if(isError) {
        return(
            <div>
                <p>Somethings wrong</p>
            </div>
        );
    }
    return (
        <div>
            <h1>My Nfts</h1>
            {/* get all nfts from gallery */}
            {isLoading ?(
                <p>Loading...</p>
            ): (
                nfts?.map((nft)=>{
                    return (
                    <div>
                        <ThirdwebNftMedia
                        key={nft.id}
                        metadata={nft.metadata}
                        height="200"
                        />
                        <p>{nft.metadata.name}</p>
                    </div>
                    )
                })
            )}

            <Web3Button
            contractAddress="0x2979d8b7A0D9024DFa73D37C946ff691Ff0bcc00"
            action={(contract) =>
                contract.erc1155.mint({
                    name: "my Bungalow",
                    description: "this is my bv",
                    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/e5/7f/bf/lutyens-bungalow.jpg",
                })
            }>
            Mint Nfts
            </Web3Button>
        </div>
    )
}