import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/customer/pages/detail'),
{ ssr: false }
)
function	CustomerAdd() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CustomerAdd