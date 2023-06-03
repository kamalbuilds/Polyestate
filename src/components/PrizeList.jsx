import { Col, Row, Typography } from 'antd';
import Image from 'next/image';

const { Text } = Typography;

function PrizeList({ prizeList }) {
  return (
    <>
      {prizeList.map((prize, i) => (
        <div
          style={{
            display: 'flex',
            borderRadius: '20px',
            padding: '40px',
            WebkitBoxPack: 'justify',
            justifyContent: 'space-between',
            background: 'white',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
            marginTop: '20px',
          }}
          key={i}
        >
          <Image
            src={prize.img}
            width={200}
            height={200}
            alt="item"
            style={{ borderRadius: '12px' }}
          />
          <div style={{ flex: '1', paddingLeft: '40px' }}>
            <Row>
              <Col span={24}>
                <Text
                  style={{
                    lineHeight: '30px',
                    fontSize: '36px',
                    whiteSpace: 'nowrap',
                    fontWeight: '700',
                  }}
                >
                  {prize.type} Item
                </Text>
              </Col>
              <div style={{ height: '20px', width: '100%' }} />
              <Col span={24}>
                <Text
                  style={{
                    lineHeight: '20px',
                    fontSize: '16px',
                    whiteSpace: 'nowrap',
                    fontWeight: '700',
                  }}
                >
                  {prize.name}
                </Text>
              </Col>
              <div style={{ height: '10px', width: '100%' }} />
              <Col span={24}>
                <Text
                  style={{
                    lineHeight: '20px',
                    fontSize: '16px',
                    whiteSpace: 'nowrap',
                    fontWeight: '700',
                  }}
                >
                  {prize.remainAmount} remaining
                </Text>
              </Col>
            </Row>
          </div>
        </div>
      ))}
    </>
  );
}

export default PrizeList;
