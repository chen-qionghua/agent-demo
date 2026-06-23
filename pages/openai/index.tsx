import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/openai/index'),
{ ssr: false }
)
function	CustomerIndex() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CustomerIndex