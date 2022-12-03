import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC, ReactNode } from 'react';
import Header from '../Components/Header';


const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Layout>
    <Header />
    <Content>
      { children }
    </Content>
  </Layout>
);

export default MainLayout;