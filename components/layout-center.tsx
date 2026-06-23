import { ReactNode } from 'react'
import { Layout, Menu } from 'antd'

const { Header, Content, Footer } = Layout

type LayoutProps = {
  children: ReactNode
}
export default function FrameLayoutCenter({ children }: LayoutProps) {
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
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            CRM ©2022 Created by Banma
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}
