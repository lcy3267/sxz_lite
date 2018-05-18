import { SXZ_HOST_URL } from '../utils/data';

module.exports = {
    labelList: (companyId)=>SXZ_HOST_URL+`decsets/corp/${companyId}`,
    productList: (companyId, mtlTypeId)=>SXZ_HOST_URL+`mtl/corp/listbymaintype/${companyId}/${mtlTypeId}`,
    productInfo: (mtlId)=>SXZ_HOST_URL+`mtl/corp/mtl/${mtlId}`,
    submitOrder: SXZ_HOST_URL+"mltorder/corp",
    submitOrder: SXZ_HOST_URL+"mltorder/corp",
    companyMember: (companyId)=>`${SXZ_HOST_URL}member/company/${companyId}`,
    editMember: (id)=>`${SXZ_HOST_URL}member/${id}`,
    addNotice: `${SXZ_HOST_URL}notice`,
    noticeList: (companyId)=>`${SXZ_HOST_URL}notice/bycom/${companyId}`,
    noticeInfo: (id)=>`${SXZ_HOST_URL}notice/${id}`,
}