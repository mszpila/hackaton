import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC, ReactNode } from 'react';
import Header from '../Components/Header';


const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Layout style={ { height: '100%' } }>
    {/*<Header />*/ }
    <Content style={ { height: '100%' } }>
      { children }
    </Content>
  </Layout>
);

export default MainLayout;