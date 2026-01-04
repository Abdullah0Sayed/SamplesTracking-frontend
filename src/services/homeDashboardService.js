import http from "./http";


const ENDPOINT = `home-dashboard`;
export const homeDashboardService = {

    financialSummary: () => http.get(`${ENDPOINT}/financial-stats`),
    changeInExpenses: () => http.get(`${ENDPOINT}/change-in-expenses-in-month`),

}