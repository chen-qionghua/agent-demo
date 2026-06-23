import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/customer/pages/list'),
{ ssr: false }
)
function	CustomerIndex() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CustomerIndex