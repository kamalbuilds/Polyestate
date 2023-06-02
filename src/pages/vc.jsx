import { Col, Row, Typography } from 'antd';
import { useQRCode } from 'next-qrcode';

import ichiban from '../contracts/ichiban';

const { Text } = Typography;

function Vc() {
  const { Canvas } = useQRCode();

  const deployedContractAddress = ichiban.address;

  const qrProofRequestJson = {
    id: '7f38a193-0918-4a48-9fac-36adfdb8b542',
    typ: 'application/iden3comm-plain-json',
    type: 'https://iden3-communication.io/proofs/1.0/contract-invoke-request',
    thid: '7f38a193-0918-4a48-9fac-36adfdb8b542',
    body: {
      reason: 'airdrop participation',
      transaction_data: {
        contract_address: deployedContractAddress,
        method_id: 'b68967e2',
        chain_id: 80001,
        network: 'polygon-mumbai',
      },
      scope: [
        {
          id: 1,
          circuitId: 'credentialAtomicQuerySigV2OnChain',
          query: {
            allowedIssuers: ['*'],
            context:
              'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
            credentialSubject: {
              birthday: {
                $lt: 20020101,
              },
            },
            type: 'KYCAgeCredential',
          },
        },
      ],
    },
  };
  return (
    <Row gutter={[12, 16]} style={{ padding: '30px' }}>
      <Col span={24}>
        <Row justify="center">
          <Text level={4}>
            Please complete your verification step for using our upload service
          </Text>
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="center">
          <Canvas
            text={JSON.stringify(qrProofRequestJson)}
            options={{
              level: 'M',
              margin: 3,
              scale: 5,
              color: {
                dark: '#000000FF',
                light: '#FFFFFFFF',
              },
              width: 200,
            }}
          />
        </Row>
      </Col>
    </Row>
  );
}

export default Vc;
