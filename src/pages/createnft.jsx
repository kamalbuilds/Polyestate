import {
    ConnectWallet,
    useContract,
    useNFTs,
    useMintNFT,
    Web3Button,
    ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import { useState } from "react";

export default function Createerc1155(){
    const { contract } = useContract("0x2979d8b7A0D9024DFa73D37C946ff691Ff0bcc00");

    const { data : nfts , isLoading , isError } = useNFTs(contract);
    const { mutate : mintNft } = useMintNFT(contract);
    console.log(nfts,isLoading,isError,contract,"nft");

    if(isError) {
        return(
            <div>
                <p>Somethings wrong</p>
            </div>
        );
    }
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
  
    const handleNameChange = (event) => {
      setName(event.target.value);
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };
  
    const handleImageChange = (event) => {
      setImage(event.target.value);
    };
  
    const handleSubmit = () => {
      // Perform form submission or pass the values to another function/component
      console.log(name, description, image);
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="">Create NFTs on Polygon</h1>

            <form>
                <div className="p-4">
                    <label htmlFor="name">Name:</label>
                    <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="border border-gray-300 rounded-md px-2 py-1"
                    />
                </div>

                <div className="p-4">
                    <label htmlFor="description">Description:</label>
                    <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="border border-gray-300 rounded-md px-2 py-1"
                    ></textarea>
                </div>

                <div className="p-4">
                    <label htmlFor="image">Image URI</label>
                    <input
                    id="image"
                    type="text"
                    value={image}
                    onChange={handleImageChange}
                    className="border border-gray-300 rounded-md px-2 py-1"
                    />
                </div>

                <Web3Button
                    contractAddress="0x2979d8b7A0D9024DFa73D37C946ff691Ff0bcc00"
                    action={(contract) =>
                        contract.erc1155.mint({
                            name,
                            description,
                            image,
                    })
                }>
                Mint Nfts
                </Web3Button>
            
            </form>
        </div>
    )
}