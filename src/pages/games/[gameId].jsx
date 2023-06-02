import { Button, Col, Divider, Modal, Row, Typography } from 'antd';
import axios from 'axios';
import { ethers } from 'ethers';
import find from 'lodash/find';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import gamesImg from '../../../public/assets/images/cat.png';
import GameDetail from '../../components/GameDetail';
import ichibanContract from '../../contracts/ichiban';
import cidToImageUrl from '../../utils/cidToImageUrl';

const { Title, Text } = Typography;

function ConfirmModal({
  open,
  onOk,
  onCancel,
  onDraw,
  price,
  amount,
  balance,
}) {
  const bigPrice = ethers.utils.parseUnits(`${price || 0}`, 18);
  const bigAmount = ethers.BigNumber.from(amount);
  const totalNum = bigPrice.mul(bigAmount) / 1e18;
  const total = `${totalNum}`.split('-')[1]
    ? totalNum.toFixed(`${totalNum}`.split('-')[1])
    : totalNum;
  return (
    <Modal
      footer={null}
      title="Total Spend"
      width={500}
      open={open}
      onCancel={() =>
        parseFloat(balance?.data?.formatted || 0) < total || onDraw
          ? null
          : onCancel()
      }
      centered
    >
      <Divider />
      <Row gutter={24} justify="center">
        <Col justify="center" span={18}>
          <Title level={3}>Price per draw:</Title>
          <Text>{`${price || '?'} MATIC`}</Text>
        </Col>
        <Divider />
        <Col justify="center" span={18}>
          <Title level={3}>Amount:</Title>
          <Text>{`Amount: ${amount}`}</Text>
        </Col>
        <Divider />
        <Col justify="center" span={18}>
          <Title level={3}>Total:</Title>
          <Text>{`${total} MATIC`}</Text>
        </Col>
      </Row>
      <Divider />
      <Row justify="center" gutter={12}>
        <Col span={10}>
          <Button
            onClick={onCancel}
            block
            disabled={
              parseFloat(balance?.data?.formatted || 0) < total || onDraw
            }
          >
            Cancel
          </Button>
        </Col>
        <Col span={10}>
          <Button
            type="primary"
            disabled={
              parseFloat(balance?.data?.formatted || 0) < total || onDraw
            }
            onClick={onOk}
            block
          >
            {onDraw ? 'Processing...' : 'Confirm'}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

function GameItems() {
  const router = useRouter();
  const { gameId } = router.query;
  const [amount, setAmount] = useState(1);
  const [gameList, setGameList] = useState([]);
  const [gameDetail, setGameDetail] = useState({});
  const [prizeList, setPrizeList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const balance = useBalance({
    address,
  });
  const { config } = usePrepareContractWrite({
    address: ichibanContract.address,
    abi: ichibanContract.abi,
    functionName: 'playPhysicalPrizeGame',
    args: [
      gameId,
      amount,
      {
        gasLimit: 1000000,
        value: ethers.BigNumber.from(
          ethers.utils.parseUnits(`${gameDetail?.price || 0}`, 18)
        )
          .mul(ethers.BigNumber.from(`${amount}`))
          .toString(),
      },
    ],
  });
  const {
    data: txData,
    isLoading: isTxSentLoading,
    write: draw,
  } = useContractWrite(config);
  const {
    data: result,
    isSuccess: isTxSuccess,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: txData?.hash || null,
  });
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    draw();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!gameList.length) {
      axios({
        baseURL: 'https://maildeep.info/app',
        url: '/game/list',
      }).then((res) => {
        const list = res.data?.data.map((i) => ({ ...i, name: i.title })) || [];
        setGameList(list);
      });
    } else {
      const detail = find(gameList, { gameId: parseInt(gameId, 10) });
      const prizes = detail?.prizeInfo.map((prize, index) => ({
        type: String.fromCharCode(97 + index).toUpperCase(),
        remainAmount: prize.remain,
        img: cidToImageUrl(prize.ipfs),
      }));
      setGameDetail(detail);
      setPrizeList(prizes);
    }
    if (isTxSuccess) {
      const ichibanInterface = new ethers.utils.Interface(ichibanContract.abi);
      const { logs } = result;
      const decodedLog = ichibanInterface.parseLog(logs[4]);
      router.push(`/games/result/${gameId}/${decodedLog.args.requestId}`);
    }
  }, [router, gameList, gameId, isTxSuccess, txData, result]);
  return (
    <>
      <Head>
        <title>{`PolyEstate - Game - ${gameId}`}</title>
      </Head>
      <main
        className="game-items"
        style={{ paddingTop: '60px', paddingBottom: '180px' }}
      >
        <GameDetail
          title={gameDetail?.title || ''}
          desc={gameDetail?.intro || ''}
          img={cidToImageUrl(gameDetail?.cover) || gamesImg}
          price={gameDetail?.price || null}
          amount={amount}
          prizeList={prizeList || []}
          onAmountChange={(v) => setAmount(v)}
          onDraw={showModal}
          isConnected={isConnected}
        />
        <ConfirmModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          price={gameDetail?.price || 0}
          amount={amount}
          balance={balance}
          onDraw={isTxSentLoading || isTxLoading}
        />
      </main>
    </>
  );
}

export default GameItems;
