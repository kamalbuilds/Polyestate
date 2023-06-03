import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { NFTStorage } from 'nft.storage'; // Add this line for importing NFTStorage

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function PhotoUpload(props) {
  const { onCidChange } = props;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [ipfsurl,SetIpfsurl] = useState();
  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        onCidChange(info.file.response.data);
      }

      // Get this url from response in real world.
      getBase64(info.file.originFileObj, async (url) => {
        setLoading(false);
        setImageUrl(url);

        // Create instance of NFTStorage
        const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY }); // Replace 'YOUR_NFT_STORAGE_API_KEY' with your actual API key

        // Upload image to nft.storage
        const cid = await nftstorage.storeBlob(new Blob([info.file.originFileObj]));

        // Save the URL
        let ipfsurl = `https://ipfs.io/ipfs/${cid}`;
        onCidChange(cid);
        console.log(ipfsurl,"visit this url to see img");
        SetIpfsurl(ipfsurl);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
          }}
        >
          <Image
            src={imageUrl}
            alt="avatar"
            style={{
              height: '100%',
              width: '100%',
            }}
            fill
          />
        </div>
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
export default PhotoUpload;