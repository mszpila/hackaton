import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC, ReactNode } from 'react';
import MainHeader from './MainHeader';

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Layout>
    <MainHeader />
    <Content>
      { children }
    </Content>
  </Layout>
);

export default MainLayout;