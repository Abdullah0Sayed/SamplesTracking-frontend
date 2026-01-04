import { useCallback, useEffect, useState } from "react"
import { blockedService } from "../../services/accounts/blockedService";



const INITIAL_FILTERS = {
    search: ''
}

export default function useCompaniesBlocked(inital_page = 1) {

    /** Companies List */
    const [blockedCompanies , setBlockedCompanies] = useState([]);

    /** loading & errors */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');


    /** pagination */
    const [pagination , setPagination] = useState({current: inital_page , total: 1});


    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


    /** Fetch Companies */
    const fetchBlockedCompanies = useCallback(async(page = pagination.current) => {
        setLoading(true);
        try {
            const {data} = await blockedService.getCompaniesBlockList({
                search: filters.search !== null ? filters.search : undefined,
                page
            });

            console.log(data.data)
            setBlockedCompanies(data.data);
            setPagination({
                current: data.pagination.current_page,
                total: data.pagination.last_page
            });

        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false);
        }
    } , [filters.search , filters.sorted_by , filters.is_active]);


  

    /** Call Fetch */
    useEffect(() => {
        fetchBlockedCompanies(pagination.current);
    } , [fetchBlockedCompanies , pagination.current])


    /** Apply Search */
    const visiableRows = blockedCompanies.filter((company) => {
        if(!filters.search) return true;
        const hayStack = Object.values(company).join(" ").toLowerCase();
        return hayStack.includes(filters.search.toLowerCase());
    })

    return {
        blockedCompanies: visiableRows,
        loading,
        error,
        filters,
        refetchBlockedCompanies: fetchBlockedCompanies,
        pagination,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({...prev , ...(typeof cb === 'function' ? cb(prev) : cb)}))
    }
}