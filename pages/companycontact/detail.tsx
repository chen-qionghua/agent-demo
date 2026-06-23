import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
() => import('@/modules/companycontact/pages/detail'),
{ ssr: false }
)
function	CompanycontactAdd() {
return (
<DynamicComponentWithNoSSR />
 )
 }

export default CompanycontactAdd