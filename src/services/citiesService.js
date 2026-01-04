import http from "./http";


const ENDPOINT = `cities`;

export const citiesService = {
    addCity: (payload) => http.post(`admin/${ENDPOINT}` , payload),
    getListCities: () => http.get(ENDPOINT),
    update: (payload) => http.put(`admin/${ENDPOINT}/${payload.id}`, payload),
    deleteCity: (id)=>http.delete(`admin/${ENDPOINT}/${id}`)
}