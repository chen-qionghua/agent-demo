import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/companycontact/pages/list'),
{ ssr: false }
)
function	CompanycontactIndex() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CompanycontactIndex