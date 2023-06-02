import { Button, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import ichiban from '../contracts/ichiban';

const { Text } = Typography;

function Redeem() {
  const router = useRouter();
  const { gameId, prizeType, prizeOwner, nonce, expireTime, signature } =
    router.query;

  const { config } = usePrepareContractWrite({
    address: ichiban.address,
    abi: ichiban.abi,
    functionName: 'claimPhysicalPrize',
    args: [gameId, prizeType, prizeOwner, nonce, expireTime, signature],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  console.log(data, isLoading, isSuccess, write);

  useEffect(() => {
    if (!isSuccess) return;
    alert('Success');
  }, [isSuccess]);

  const redeem = () => {
    if (!nonce) return;
    if (isLoading) return;
    write();
  };

  return (
    <section style={{ position: 'relative', width: '100%' }}>
      <Row style={{ paddingTop: '200px' }} justify="center">
        <Text>Please redeem the prizes.</Text>
      </Row>
      <Row style={{ paddingTop: '15px' }} justify="center">
        <Button
          type="primary"
          shape="round"
          onClick={redeem}
          disabled={!write || isSuccess}
        >
          Redeem
        </Button>
      </Row>
    </section>
  );
}

export default Redeem;
