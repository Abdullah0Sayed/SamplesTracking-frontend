import { useCallback, useEffect, useState } from "react"
import { adminsService } from "../../services/accounts/adminsService";
import { blockedService } from "../../services/accounts/blockedService";



const INITIAL_FILTERS = {
    search: ''
}

export default function useAdminsBlocked(inital_page = 1) {

    /** Admins List */
    const [blockedAdmins , setBlockedAdmins] = useState([]);

    /** loading & errors */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');


    /** pagination */
    const [pagination , setPagination] = useState({current: inital_page , total: 1});


    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


    /** Fetch Admins */
    const fetchBlockedAdmins = useCallback(async(page = pagination.current) => {
        setLoading(true);
        try {
            const {data} = await blockedService.getAdminsBlockList({
                search: filters.search !== null ? filters.search : undefined,
                page
            });

            console.log(data.data)
            setBlockedAdmins(data.data);
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
        fetchBlockedAdmins(pagination.current);
    } , [fetchBlockedAdmins , pagination.current])


    /** Apply Search */
    const visiableRows = blockedAdmins.filter((admin) => {
        if(!filters.search) return true;
        const hayStack = Object.values(admin).join(" ").toLowerCase();
        return hayStack.includes(filters.search.toLowerCase());
    })

    return {
        blockedAdmins: visiableRows,
        loading,
        error,
        filters,
        refetchBlockedAdmins : fetchBlockedAdmins,
        pagination,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({...prev , ...(typeof cb === 'function' ? cb(prev) : cb)}))
    }
}