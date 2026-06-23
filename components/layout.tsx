import { ReactNode } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { useRouter } from 'next/router'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

type LayoutProps = {
  children: ReactNode
}
export default function FrameLayout({ children }: LayoutProps) {
  // todo: 获取当前路由，然后在菜单树中寻找到对应的路径
  const router = useRouter()
  return (
    <>
      <style jsx>{`
        .logo {
          height: 32px;
          margin: 16px;
          background: rgba(255, 255, 255, 0.3);
        }

        .site-layout-background {
          background: #fff;
        }
      `}</style>
      <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
          <Content style={{ height: '100vh' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}></Breadcrumb> */}
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: '100vh' }}
            >
              {children}
            </div>
          </Content>
        
        </Layout>
      </Layout>
    </>
  )
}
