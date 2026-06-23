import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/companycontact/pages/add'),
{ ssr: false }
)
function	CompanycontactUpdate() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CompanycontactUpdate