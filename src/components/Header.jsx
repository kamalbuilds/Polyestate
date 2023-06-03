import { CodeSandboxOutlined, UserOutlined } from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Avatar, Col, Drawer, Grid, Layout, Row, Space } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useEnsAvatar } from 'wagmi';
import logo from "../../public/assets/images/polyestate.png";

const { Header } = Layout;
const { useBreakpoint } = Grid;

function HeaderComponent({ style }) {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

  const screens = useBreakpoint();

  const { address } = useAccount();

  const { data: ensAvatar } = useEnsAvatar({ address });

  return (
    <Header
      className="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
      }}
    >
      <div style={style}>
        <Row justify="space-between" align="middle" className="normal-row">
          <Row>
            <Image src={logo} alt="logo" height={50} className='p-2'/>
            <Link href="/">
              <h1>PolyEstate</h1>
            </Link>
          </Row>

          <Col style={{ flex: '1' }}>
            {screens.sm ? (
              <Row justify="end">
                <Space size={20}>
                  <Link href="/vc">Become Vendor</Link>
                  <Link href="/upload">Create Auction</Link>
                  <ConnectButton label="Sign in" accountStatus="address" />
                  <Link href="/account">
                    <div className="profile" style={{ borderRadius: '50%' }}>
                      {ensAvatar ? (
                        <Image
                          src={ensAvatar}
                          alt="profile"
                          width={35}
                          height={35}
                        />
                      ) : (
                        <Avatar size={35} icon={<UserOutlined />} />
                      )}
                    </div>
                  </Link>
                </Space>
              </Row>
            ) : (
              <Row justify="end" align="middle">
                {!screens.sm && (
                  <Row justify="end" align="middle">
                    <ConnectButton label="Sign in" accountStatus="address" />
                  </Row>
                )}
                <CodeSandboxOutlined
                  className="sandwich"
                  onClick={() => setSideBarIsOpen(!sideBarIsOpen)}
                />
              </Row>
            )}
          </Col>
        </Row>
      </div>
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setSideBarIsOpen(false)}
        open={sideBarIsOpen}
        key="right"
        rootClassName="sidebar"
        width={160}
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <Row className="sidebar__item-area" gutter={[16, 16]}>
          <Col span={24} className="sidebar__item">
            Upload
          </Col>
        </Row>
      </Drawer>
    </Header>
  );
}

export default HeaderComponent;
