import { Layout } from 'antd';

import Header from './Header';

const { Content } = Layout;

export default function LayoutComponent({ children }) {
  const containerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1232px',
    paddingLeft: 'calc(16px + env(safe-area-inset-left))',
    paddingRight: 'calc(16px + env(safe-area-inset-right))',
  };

  return (
    <Layout>
      <Header style={containerStyle} />
      <Content
        style={{
          paddingTop: '60px',
          paddingBottom: '180px',
          ...containerStyle,
        }}
      >
        {children}
      </Content>
      {/* <FooterComponent /> */}
    </Layout>
  );
}
