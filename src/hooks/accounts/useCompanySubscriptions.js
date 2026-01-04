import { useCallback, useEffect, useState } from "react"
import { companiesService } from "../../services/accounts/companiesService";

const INITIAL_FILTERS = {
    search: '',
}
export default function useCompanySubscriptions(initialPage = 1 , user_id) {

    /** Company Subscriptions */
    const [companySubscriptions , setCompanySubscriptions] = useState([]);

    /** Pagination */
    const [pagination , setPagination] = useState({current: initialPage , total: 1})

    /** Loading , Error */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');

    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


 
    

    /** UseCallback */
    const fetchCompanySubscriptions = useCallback(async (page = pagination.current ) => {
        setLoading(true);
        try {
            
            const {data} = await companiesService.getCompanySubscriptions({
                search: filters.search !== null ? filters.search : undefined,
                user_id,
                user_type: 'company',
                page
            });
            setCompanySubscriptions(data.data);

            setPagination({
                current: data.pagination.current_page,
                total: data.pagination.last_page,
            })

        console.log("USER_ID:", user_id);
            console.log(data.data)
        } catch (error) {
            console.log(error)
            setError(error)
        }
        finally {
            setLoading(false);
        }
    } , [filters.search , user_id]);


    /** Exceution */
    useEffect(() => {
        if(!user_id) {
            setLoading(true);
            setError(`No Client Founded`);
            return;
        }
        fetchCompanySubscriptions(pagination.current);
    } , [fetchCompanySubscriptions, pagination.current]);


    /** visibleRows */
    const visibleRows = companySubscriptions.filter((cs) => {
        if (!filters.search) return true;

        const hayStack = Object.values(cs).join(" ").toLowerCase();

        return hayStack.includes(filters.search.toLowerCase());
    })


    return {
        loading,
        error,
        subscriptions: visibleRows,
        pagination,
        filters,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({
            ...prev , ...(typeof cb === 'function' ? cb(prev) : cb)
        })) 

    }
}