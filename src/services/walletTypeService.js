import http from "./http";

const ENDPOINT = 'wallet-types';

export const walletTypeService = {
    addNewWalletType: (payload) => http.post(`${ENDPOINT}`, payload),
    getAllWalletTypes: (params = {}) => http.get(`${ENDPOINT}`, { params }),
    exportSheet: (ids = []) => { return ids.length > 0 ? http.post(`sheet/${ENDPOINT}`, { ids }) : http.post(`sheet/${ENDPOINT}`) },
}