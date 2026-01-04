import http from "../http";

const ENDPOINT = `admin/companies`;

export const companiesService = {

    getAllCompanies: (params) => http.get(`${ENDPOINT}` , {params}),
    deleteCompany: (id) => http.delete(`${ENDPOINT}/${id}`),
    unBlockCompany: (id) => http.post(`admin/companyUnblock` , {id}),
    blockCompany: (id) => http.post(`admin/companyBlock` , {id}),
    addCompany: (payload) => http.post(`${ENDPOINT}` , payload),
    updateCompany: (payload) => http.put(`${ENDPOINT}/${payload.id}` , payload),
    getCompany: (id) => http.get(`${ENDPOINT}/${id}`),
    bulkActions: (ids = [] , action) => http.post(`admin/companyBulkActions` , {ids , action}),
    getCompanySubscriptions: (params = {}) => http.get(`/admin/subscriptions` , {params})


};