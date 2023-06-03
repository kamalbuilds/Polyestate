import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from '@hookform/devtools';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Slider,
  Space,
  Steps,
  Tabs,
  Typography,
} from 'antd';
import { BigNumber, utils } from 'ethers';
import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import GameDetail from '../components/GameDetail';
import PhotoUpload from '../components/PhotoUpload';
import ichiban from '../contracts/ichiban';
import styles from '../styles/Home.module.css';
import cidToImageUrl from '../utils/cidToImageUrl';

const { TextArea } = Input;
const { Text } = Typography;

const marks = {
  0: 'A',
  10: 'B',
  20: 'C',
  30: 'D',
  40: 'E',
  50: 'F',
  60: 'G',
  70: 'H',
  80: 'I',
  90: 'J',
  100: 'K',
};

const steps = [
  {
    title: 'Step 1',
    description: 'Prize type for sale',
  },
  {
    title: 'Step 2',
    description: 'Package info',
  },
  {
    title: 'Step 3',
    description: 'Upload your prizes',
  },
  {
    title: 'Step 4',
    description: 'Set up drawing price',
  },
  {
    title: 'Step 5',
    description: 'Confirmation',
  },
];

export default function Upload() {
  const [step, setStep] = useState(0);
  const [isUserVendor, setIsUserVendor] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const { address } = useAccount();
  const openNotification = useCallback(
    ({ type, onClose, title, desc }) => {
      api[type]({
        message: title,
        description: desc,
        duration: 4,
        placement: 'bottomRight',
        onClose: () => onClose(),
      });
    },
    [api]
  );
  useContractRead({
    address: ichiban.address,
    abi: ichiban.abi,
    functionName: 'proofs',
    args: [address, 1],
    onSuccess(isVendor) {
      setIsUserVendor(isVendor);
      if (!isVendor) {
        openNotification({
          type: 'warning',
          title: 'Not Eligible',
          desc: 'Please become vendor first',
          onClose: () => router.push('/vc'),
        });
      }
      if (process.env.NODE_ENV === 'production' && !isVendor) {
        openNotification({
          type: 'warning',
          title: 'Not Eligible',
          desc: 'Please become vendor first',
          onClose: () => router.push('/vc'),
        });
      }
    },
  });

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      prizeType: 'off-chain-items',
      package: {
        thumbnailCid: '',
        title: 'title',
        description: 'description',
      },
      prizeGradesRange: 50,
      prizeContents: [
        {
          thumbnailCid: '',
          // name: '',
          amount: 1,
        },
      ],
      drawingPrice: 100,
    },
    mode: 'onChange',
  });

  const formData = useWatch({ control });

  const onStepChange = (value) => {
    setStep((theStep) => theStep + value);
  };

  const [form] = Form.useForm();

  const tabItems = useMemo(() => {
    const tabs = [];

    Object.keys(marks).forEach((rangeValue, index) => {
      if (rangeValue <= formData.prizeGradesRange) {
        const isCompleted =
          formData.prizeContents[index] &&
          formData.prizeContents[index].thumbnailCid &&
          formData.prizeContents[index].thumbnailCid.length > 0 &&
          // formData.prizeContents[index].name !== '' &&
          formData.prizeContents[index].amount > 0;

        tabs.push({
          key: index,
          label: (
            <Space>
              {`${marks[rangeValue]} Prize`}
              {isCompleted ? (
                <CheckCircleOutlined style={{ color: 'green' }} />
              ) : (
                <ExclamationCircleOutlined style={{ color: 'red' }} />
              )}
            </Space>
          ),
          children: (
            <>
              <Form.Item label="prize thumbnail" required>
                <PhotoUpload
                  onCidChange={(cid) => {
                    setValue(`prizeContents.${index}.thumbnailCid`, cid);
                  }}
                />
              </Form.Item>
              {/* <Form.Item label="prize name" required>
                <Controller
                  control={control}
                  name={`prizeContents.${index}.name`}
                  render={({ field }) => {
                    return (
                      <TextArea {...field} placeholder="prize name" autoSize />
                    );
                  }}
                />
              </Form.Item> */}
              <Form.Item label="prize amount" required>
                <Controller
                  control={control}
                  defaultValue={1}
                  name={`prizeContents.${index}.amount`}
                  render={({ field }) => {
                    return <InputNumber {...field} min={1} max={50} />;
                  }}
                />
              </Form.Item>
            </>
          ),
        });
      }
    });
    return tabs;
  }, [control, setValue, formData.prizeGradesRange, formData.prizeContents]);

  const { config } = usePrepareContractWrite({
    address: ichiban.address,
    abi: ichiban.abi,
    functionName: 'listPhysicalPrizeGame',
    args: [
      // _gameTitle
      formData.package.title,
      // _gameIntro
      formData.package.description,
      // _numPrizeTypes
      Math.floor(formData.prizeGradesRange / 10) + 1,
      // _totalItems
      formData.prizeContents.reduce((total, item) => {
        return total + item.amount;
      }, 0),
      // _prizeCount
      formData.prizeContents.map((item) => item.amount),
      // _prizeInfo
      formData.prizeContents.map((item) => item.thumbnailCid),
      // _price
      BigNumber.from(
        utils.parseUnits(`${formData.drawingPrice || 0}`, 18)
      ).toString(),
      // _gameCover
      formData.package.thumbnailCid,
    ],
    onError(e) {
      console.log(e);
    },
  });

  const { isLoading, isSuccess, write } = useContractWrite(config);

  const onSubmit = () => {
    if (write || !isLoading) write();
  };

  useEffect(() => {
    if (isSuccess) {
      openNotification({
        type: 'success',
        title: 'Success',
        desc: 'People now can join your game!',
      });
      window.location.reload();
    }
  }, [isSuccess, openNotification]);

  // if (process.env.NODE_ENV === 'production' && !isUserVendor) return null;

  return !isUserVendor ? (
    <main className={styles.main}>{contextHolder}</main>
  ) : (
    <main className={styles.main}>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        style={{ width: '100%' }}
        onFinish={handleSubmit(onSubmit)}
      >
        {process.env.NODE_ENV === 'development' && (
          <DevTool control={control} />
        )}

        <Row gutter={32} justify="space-between">
          <Col style={{ flex: '1' }}>
            <Text
              style={{
                display: 'inline-block',
                fontSize: '40px',
                lineHeight: '48px',
                fontWeight: '700',
                marginBottom: '26px',
                width: '100%',
              }}
            >
              {steps[step].description}
            </Text>
            {step === 0 && (
              <Form.Item label="Select Prize type for sale" required>
                <Controller
                  control={control}
                  name="prizeType"
                  render={({ field }) => {
                    return (
                      <Radio.Group {...field}>
                        <Space direction="vertical">
                          <Radio value="off-chain-items">Off-chain Items</Radio>
                          <Radio value="unminted-nfts">Unminted NFTs</Radio>
                          <Radio value="minted-nfts">Minted NFTs</Radio>
                        </Space>
                      </Radio.Group>
                    );
                  }}
                />
              </Form.Item>
            )}
            {step === 1 && (
              <>
                <Form.Item label="Package thumbnail" required>
                  <PhotoUpload
                    onCidChange={(cid) => {
                      setValue('package.thumbnailCid', cid);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Package title" required>
                  <Controller
                    control={control}
                    name="package.title"
                    render={({ field }) => {
                      return (
                        <TextArea
                          {...field}
                          placeholder="Add title for this package"
                          autoSize
                        />
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item label="Package description" required>
                  <Controller
                    control={control}
                    name="package.description"
                    render={({ field }) => {
                      return (
                        <TextArea
                          {...field}
                          placeholder="Add description for this package"
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      );
                    }}
                  />
                </Form.Item>
              </>
            )}
            {step === 2 && (
              <>
                <Form.Item label="Prize grades range" required>
                  <Controller
                    control={control}
                    name="prizeGradesRange"
                    render={({ field }) => {
                      return (
                        <Slider
                          {...field}
                          marks={marks}
                          step={null}
                          tooltip={{
                            formatter: (item) => marks[item],
                          }}
                        />
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item label="Prize contents" required>
                  <Tabs defaultActiveKey="1" items={tabItems} />
                </Form.Item>
              </>
            )}
            {step === 3 && (
              <Form.Item label="Drawing price" required>
                <Controller
                  control={control}
                  name="drawingPrice"
                  render={({ field }) => {
                    return (
                      <InputNumber
                        {...field}
                        min={0.0000001}
                        max={9999999}
                        addonAfter="Matic"
                      />
                    );
                  }}
                />
              </Form.Item>
            )}

            {step === 4 && (
              <GameDetail
                img={cidToImageUrl(formData.package.thumbnailCid)}
                title={formData.package.title}
                desc={formData.package.description}
                price={formData.drawingPrice}
                prizeList={formData.prizeContents.map((item, index) => {
                  return {
                    img: cidToImageUrl(item.thumbnailCid),
                    name: item.name,
                    type: marks[index * 10],
                    remainAmount: item.amount,
                  };
                })}
                isShowNumberCount={false}
              />
            )}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                marginTop: '26px',
              }}
            >
              <Space>
                {step > 0 && (
                  <Form.Item>
                    <Button onClick={() => onStepChange(-1)}>Prev</Button>
                  </Form.Item>
                )}
                {step <= 3 && (
                  <Form.Item>
                    <Button type="primary" onClick={() => onStepChange(1)}>
                      Next
                    </Button>
                  </Form.Item>
                )}
                {step === 4 && (
                  <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={!write}>
                      Create
                    </Button>
                  </Form.Item>
                )}
              </Space>
            </div>
          </Col>
          <Col
            style={{
              ...(step === 4
                ? {
                    position: 'absolute',
                    right: '0',
                    transform: 'translateX(100%)',
                  }
                : {}),
            }}
          >
            <Steps direction="vertical" current={step} items={steps} />
          </Col>
        </Row>
      </Form>
    </main>
  );
}
