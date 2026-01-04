import { useCallback, useEffect, useState } from "react"
import { blockedService } from "../../services/accounts/blockedService";



const INITIAL_FILTERS = {
    search: ''
}

export default function useClientsBlocked(inital_page = 1) {

    /** Clients List */
    const [blockedClients , setBlockedClients] = useState([]);

    /** loading & errors */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');


    /** pagination */
    const [pagination , setPagination] = useState({current: inital_page , total: 1});


    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


    /** Fetch Clients */
    const fetchBlockedClients = useCallback(async(page = pagination.current) => {
        setLoading(true);
        try {
            const {data} = await blockedService.getClientsBlockList({
                search: filters.search !== null ? filters.search : undefined,
                page
            });

            console.log(data.data)
            setBlockedClients(data.data);
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
        fetchBlockedClients(pagination.current);
    } , [fetchBlockedClients , pagination.current])


    /** Apply Search */
    const visiableRows = blockedClients.filter((admin) => {
        if(!filters.search) return true;
        const hayStack = Object.values(admin).join(" ").toLowerCase();
        return hayStack.includes(filters.search.toLowerCase());
    })

    return {
        blockedAClients: visiableRows,
        loading,
        error,
        filters,
        refetchBlockedClients: fetchBlockedClients,
        pagination,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({...prev , ...(typeof cb === 'function' ? cb(prev) : cb)}))
    }
}