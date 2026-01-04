import { useEffect, useState } from "react"
import { homeDashboardService } from "../../services/homeDashboardService";

export function useDashboard() {

    /** Stats Card */
    const [cardStats, setCardStats] = useState({});

    /** Change in Expenses */
    const [changeInExpenses, setChangeInExpenses] = useState([]);
    const [monthlyChanges, setMonthlyChanges] = useState([]);

    const fetchSummary = async () => {

        try {
            const { data } = await homeDashboardService.financialSummary();
            setCardStats(data?.data);

        } catch (error) {
            console.log(error)
        }
    }

    const fetchChangeInExpensesByDaysInCurrentMonth = async () => {
        try {
            const { data } = await homeDashboardService.changeInExpenses();
            setChangeInExpenses(data?.data?.daily_expenses);


        } catch (error) {
            console.log(error)
        }
    }

    const fetchMonthlyChanges = async () => {
        try {
            const { data } = await homeDashboardService.changeInExpenses();
            setMonthlyChanges(data?.data?.monthly_changes);


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSummary();
        fetchChangeInExpensesByDaysInCurrentMonth();
        fetchMonthlyChanges();
    }, [])


    return {
        cardStats,
        changeInExpenses,
        monthlyChanges
    }
}