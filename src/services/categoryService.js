import http from "./http";


const ENDPOINT = `categories`;

export const categoryService = {

    addNewCategory: (payload) => http.post(ENDPOINT, payload),
    getAllCategories: (params) => http.get(ENDPOINT, { params })
};