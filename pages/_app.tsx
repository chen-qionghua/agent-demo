import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import type { ComponentProps, ComponentType, ReactElement, ReactNode, PropsWithChildren } from 'react'
import { SWRConfig as BaseSWRConfig } from 'swr'
import FrameLayout from '@/components/layout'
import { useRouter } from 'next/router'


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const SWRConfig = BaseSWRConfig as ComponentType<
  PropsWithChildren<ComponentProps<typeof BaseSWRConfig>>
>

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()

  const getLayout = Component.getLayout ?? ((page) => (<FrameLayout>{page}</FrameLayout>))
  const inner = getLayout(<Component {...pageProps} />)
  const { route } = router
  return (
    <>

      <SWRConfig
            value={{
              fetcher: (resource: RequestInfo, init?: RequestInit) => fetch(resource, init).then(res => res.json())
            }}
          >
            {inner}
          </SWRConfig>
    </>



  )
}

export default MyApp
