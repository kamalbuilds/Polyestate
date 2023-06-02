import { Button, InputNumber, Row } from 'antd';

function NumberCount({ value, max = 10, onChange }) {
  return (
    <Row>
      <Button
        type="primary"
        style={{
          padding: '8px',
          width: '50px',
          height: '50px',
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          background: 'rgb(41, 66, 237)',
        }}
        onClick={() => {
          if (value <= 0) onChange(1);
          else onChange(value > 1 ? value - 1 : 1);
        }}
      >
        -
      </Button>
      <InputNumber
        min={1}
        max={max}
        value={value}
        style={{
          padding: '8px',
          width: '80px',
          height: '50px',
          borderRadius: '0px',
          fontSize: '16px',
        }}
      />
      <Button
        type="primary"
        style={{
          padding: '8px',
          width: '50px',
          height: '50px',
          borderBottomLeftRadius: '0',
          borderTopLeftRadius: '0',
          background: 'rgb(41, 66, 237)',
        }}
        onClick={() => {
          if (value <= 0) onChange(1);
          else onChange(value <= 10 ? value + 1 : max);
        }}
      >
        +
      </Button>
    </Row>
  );
}

export default NumberCount;
