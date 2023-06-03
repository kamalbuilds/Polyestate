import { useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const Auth = Buffer.from(
  process.env.NEXT_PUBLIC_INFURA_API_KEY + ':' + process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET,
).toString('base64');

const chainId = 80001;
const fromBlock = 16026179;
const toBlock = 16026190;

export default function Home({ data }) {
  useEffect(() => {
    console.log('Data:', data);
  }, [data]);

  const columns = [
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <div>
      <h1>NFT Transfers</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data } = await axios.get(
      `https://nft.api.infura.io/networks/${chainId}/nfts/transfers?fromBlock=${fromBlock}&toBlock=${toBlock}`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      }
    );

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      props: {
        data: [],
      },
    };
  }
}
