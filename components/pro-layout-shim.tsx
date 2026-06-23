import type { CSSProperties, ReactNode } from 'react'

type GridContentProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

type FooterToolbarProps = {
  children?: ReactNode
  className?: string
  extra?: ReactNode
  renderContent?: (props: FooterToolbarProps, dom: JSX.Element) => ReactNode
  style?: CSSProperties
}

type PageHeaderWrapperProps = {
  children?: ReactNode
  content?: ReactNode
  title?: ReactNode
  style?: CSSProperties
}

export function GridContent({ children, className, style }: GridContentProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

export function FooterToolbar(props: FooterToolbarProps) {
  const { children, className, extra, renderContent, style } = props
  const dom = (
    <>
      {extra ? <div>{extra}</div> : null}
      <div>{children}</div>
    </>
  )

  return (
    <div className={className} style={{ marginTop: 24, textAlign: 'right', ...style }}>
      {renderContent ? renderContent(props, dom) : dom}
    </div>
  )
}

export function PageHeaderWrapper({ children, content, title, style }: PageHeaderWrapperProps) {
  return (
    <div style={style}>
      {title ? <div style={{ marginBottom: 16 }}>{title}</div> : null}
      {content}
      {children}
    </div>
  )
}

export const PageContainer = PageHeaderWrapper

