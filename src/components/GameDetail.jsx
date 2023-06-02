import { Col, Divider, Row, Space, Typography } from 'antd';
import Image from 'next/image';

import NumberCount from './NumberCount';
import PrizeList from './PrizeList';

const { Text } = Typography;

function GameDetail({
  title,
  desc,
  img,
  amount,
  price,
  prizeList,
  onAmountChange,
  onDraw,
  isConnected,
  isShowNumberCount = true,
}) {
  return (
    <section
      style={{
        display: 'grid',
        gridGap: '20px',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      }}
    >
      <Image
        src={img}
        alt="game"
        style={{
          position: 'sticky',
          top: '120px',
          maxHeight: '590px',
          // width: '590px',
          // height: '590px',
          borderRadius: '20px',
        }}
        height={590}
        width={590}
      />

      <Space direction="vertical" size={0}>
        <div
          style={{
            display: 'flex',
            borderRadius: '20px',
            padding: '40px',
            flexDirection: 'column',
            WebkitBoxPack: 'justify',
            justifyContent: 'space-between',
            background: 'white',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
            minHeight: '590px',
          }}
        >
          <Row>
            <Col span={24}>
              <Text
                style={{
                  fontSize: '42px',
                  lineHeight: '56px',
                  fontWeight: '700',
                }}
              >
                {title}
              </Text>
            </Col>
            <Col span={24} style={{ marginTop: '15px', marginBottom: '15px' }}>
              <Text>{desc}</Text>
            </Col>
            <Col span={24} />
          </Row>
          {isShowNumberCount && (
            <NumberCount value={amount} onChange={onAmountChange} />
          )}
          <div>
            <Divider />
            <Row justify="space-between">
              <Col span={12}>
                <Row align="middle" style={{ height: '100%' }}>
                  <Text
                    style={{
                      fontSize: '32px',
                      lineHeight: '38px',
                      fontWeight: '700',
                    }}
                  >
                    {price !== null ? `${price} ` : '?'} MATIC
                  </Text>
                </Row>
              </Col>
              <Col span={12}>
                <Row justify="end">
                  <button
                    type="button"
                    disabled={!onDraw || !isConnected}
                    onClick={onDraw}
                    style={{
                      border: 'none',
                      color: 'white',
                      padding: '18px 20px',
                      minWidth: '180px',
                      fontSize: '20px',
                      marginTop: '0px',
                      borderRadius: '30px',
                      background: '#2942ed',
                    }}
                  >
                    {isConnected ? 'Draw' : 'Please Sign in'}
                  </button>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
        <PrizeList prizeList={prizeList} />
      </Space>
    </section>
  );
}

export default GameDetail;
