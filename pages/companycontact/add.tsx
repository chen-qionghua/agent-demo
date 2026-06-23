import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/companycontact/pages/add'),
{ ssr: false }
)
function	CompanycontactAdd() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CompanycontactAdd