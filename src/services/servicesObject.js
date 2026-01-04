import http from "./http";

const ENDPOINT = `services`;

export const servicesObject = {

    getAllServices: () => http.get(ENDPOINT),
    addService: (payload) => http.post(`admin/${ENDPOINT}` , payload),
    update: (payload) => http.put(`admin/${ENDPOINT}/${payload.id}`, payload),
    deleteService: (id)=>http.delete(`admin/${ENDPOINT}/${id}`)

}