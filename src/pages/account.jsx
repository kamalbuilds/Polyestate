import {
  CrownOutlined,
  DatabaseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Menu,
  Modal,
  QRCode,
  Row,
  Space,
  Typography,
} from 'antd';
import axios from 'axios';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  useAccount,
  useContractRead,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from 'wagmi';

import ichiban from '../contracts/ichiban';
import cidToImageUrl from '../utils/cidToImageUrl';

const { Text } = Typography;

function ClaimModal({ isOpen, onClose, gameId, prize }) {
  const { address } = useAccount();

  const userNonce = useContractRead({
    address: ichiban.address,
    abi: ichiban.abi,
    functionName: 'getUsedNonces',
    args: [
      // player
      address,
    ],
  });

  const nonce = useMemo(() => {
    if (!userNonce.data) return null;
    // eslint-disable-next-line no-underscore-dangle
    if (userNonce.data._isBigNumber) {
      return userNonce.data.toNumber() + 1;
    }
    return userNonce.data + 1;
  }, [userNonce.data]);

  const expireTime = 123456789;
  const message = useMemo(() => {
    if (!nonce) return null;

    const hex = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [ichiban.address, gameId, prize.id, address, nonce, expireTime]
    );

    return ethers.utils.arrayify(hex);
  }, [gameId, prize.id, address, nonce]);

  const {
    data: signature,
    isLoading,
    signMessage,
  } = useSignMessage({
    message,
  });

  const deepLink = useMemo(() => {
    if (
      window &&
      gameId !== null &&
      prize &&
      address &&
      nonce &&
      expireTime &&
      signature
    ) {
      return `https://metamask.app.link/dapp/${window.location.host}/redeem?gameId=${gameId}&prizeType=${prize.id}&prizeOwner=${address}&nonce=${nonce}&expireTime=${expireTime}&signature=${signature}`;
    }
    return null;
  }, [gameId, prize, address, nonce, expireTime, signature]);

  return (
    <Modal
      title="Claim QRCode"
      open={isOpen}
      closable
      onCancel={onClose}
      footer={null}
      centered
    >
      <Space direction="vertical" size="middle">
        <p>Sign to generate claim QRcode</p>

        {deepLink && (
          <QRCode
            value={deepLink || '-'}
            isLoading={isLoading}
            size={200}
            style={{ margin: 'auto' }}
          />
        )}

        <Button
          onClick={() => {
            if (message) signMessage({ message });
          }}
          disabled={isLoading}
        >
          Sign
        </Button>
      </Space>
    </Modal>
  );
}

function List({ type, listTitle, data, onPrizeClaim }) {
  return (
    <>
      <Text
        style={{
          display: 'inline-block',
          fontSize: '24px',
          marginBottom: '12px',
        }}
      >
        {listTitle}
      </Text>

      <Space
        direction="vertical"
        size="small"
        className="item-block"
        style={{
          width: '100%',
        }}
      >
        {data.map((prize, j) => (
          <Row
            justify="space-between"
            align="middle"
            key={j}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              boxShadow: 'rgba(0, 0, 0, 0.08) 0px 10px 30px',
              borderRadius: '20px',
              padding: '10px',
            }}
          >
            <Col>
              <div className="item-img-wrapper">
                <Image
                  src={cidToImageUrl(prize.ipfs)}
                  alt=""
                  height={100}
                  width={100}
                />
              </div>
            </Col>
            <Col
              className="prize"
              style={{ flex: '1', marginLeft: '20px', marginRight: '20px' }}
            >
              {`${String.fromCharCode(prize.id + 65)} prize`}
            </Col>
            <Col>
              <Button
                type="primary"
                shape="round"
                size="middle"
                onClick={() => {
                  if (type === 'prizes' && onPrizeClaim) onPrizeClaim(prize);
                }}
              >
                {type === 'prizes' ? 'Claim' : 'Details'}
              </Button>
            </Col>
          </Row>
        ))}
      </Space>
    </>
  );
}

async function fetcher(url, address, status) {
  if (address) {
    const res = await axios.get(
      `https://maildeep.info/app/game/player/prize?address=${address}&status=${
        status === 'prizes' ? 'ENABLE' : 'DISABLE'
      }`
    );
    if (res.data.code === 'G_0000') return res.data.data;
  }
  return null;
}

function Account() {
  const [type, setType] = useState('prizes'); // prizes / collected
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [claimPrize, setClaimPrize] = useState(null);
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);

  const { address } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });

  const { data: gameList } = useSWR(
    ['PlayerGameList', address, type],
    ([url, addr, tabType]) => fetcher(url, addr, tabType)
  );

  return (
    <section className="account">
      <div className="content">
        <Row justify="space-between" gutter={32}>
          {/* 個人資訊 */}
          <Col span={6} className="content__info">
            <Row gutter={[16, 16]} style={{ position: 'sticky', top: '100px' }}>
              <Col span={24} className="profile-wrapper">
                <div className="profile">
                  {ensAvatar ? (
                    <Image src={ensAvatar} alt="user avatar" />
                  ) : (
                    <Avatar size={64} icon={<UserOutlined />} />
                  )}
                </div>
              </Col>
              <Col span={24}>
                <Text>{ensName || address}</Text>
              </Col>
            </Row>
          </Col>
          {/* 列表 */}
          <Col span={12}>
            <Row gutter={[24, 24]}>
              <Col span={24} className="list-area">
                {gameList &&
                Object.values(gameList.playerGameMap)[0] &&
                Object.values(gameList.playerGameMap)[0].length !== 0 ? (
                  <Space direction="vertical" size="large">
                    {Object.entries(gameList.playerGameMap).map((game) => (
                      <List
                        key={game[0]}
                        type={type}
                        data={game[1]}
                        listTitle={gameList.gameMap[game[0]].title}
                        onPrizeClaim={(prize) => {
                          setSelectedGameId(game[0]);
                          setClaimPrize(prize);
                          setClaimModalOpen(true);
                        }}
                      />
                    ))}
                  </Space>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </Col>
          {/* 頁籤 */}
          <Col sm={6}>
            <Menu
              onClick={(menu) => {
                setType(menu.key);
                setSelectedGameId(null);
              }}
              style={{ position: 'sticky', top: '100px', width: '256px' }}
              mode="vertical"
              items={[
                {
                  key: 'prizes',
                  icon: <CrownOutlined />,
                  label: 'Prizes',
                },
                {
                  key: 'collected',
                  icon: <DatabaseOutlined />,
                  label: 'Collected',
                },
              ]}
            />
          </Col>
        </Row>
      </div>
      {selectedGameId !== null && claimPrize && isClaimModalOpen && (
        <ClaimModal
          isOpen={isClaimModalOpen}
          onClose={() => {
            setClaimModalOpen(false);
          }}
          gameId={selectedGameId}
          prize={claimPrize}
        />
      )}
    </section>
  );
}

export default Account;
