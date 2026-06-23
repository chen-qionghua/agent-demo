import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/customer/pages/add'),
{ ssr: false }
)
function	CustomerUpdate() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CustomerUpdate