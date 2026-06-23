import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/customer/pages/add'),
{ ssr: false }
)
function	CustomerAdd() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CustomerAdd