import http from "../http";

const ENDPOINT = `admin`;

export const blockedService = {

    getAdminsBlockList: ({params}) => http.get(`${ENDPOINT}/userBlockList` , {params}),
    getClientsBlockList: ({params}) => http.get(`${ENDPOINT}/clientBlockList` , {params}),
    getCompaniesBlockList: ({params}) => http.get(`${ENDPOINT}/companyBlockList` , {params}),
    getBlockStats: () => http.get(`${ENDPOINT}/blockStats`)

};