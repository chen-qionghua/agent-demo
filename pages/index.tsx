import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/modules/index/index'),
  { ssr: false }
)
function Index() {
  return (
    <DynamicComponentWithNoSSR />
  )
}

export default Index