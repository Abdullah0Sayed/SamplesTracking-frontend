import { useCallback, useEffect, useState } from "react"
import { adminsService } from "../../services/accounts/adminsService";



const INITIAL_FILTERS = {
    sorted_by: 'all',
    is_active: undefined,
    search: ''
}

export default function useAdmins(inital_page = 1) {

    /** Admins List */
    const [admins , setAdmins] = useState([]);

    /** loading & errors */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');


    /** pagination */
    const [pagination , setPagination] = useState({current: inital_page , total: 1});


    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


    /** Fetch Admins */
    const fetchAdmins = useCallback(async(page = pagination.current) => {
        setLoading(true);
        try {
            const {data} = await adminsService.getAllAdmins({
                sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
                search: filters.search !== null ? filters.search : undefined,
                is_active: filters.is_active !== null ? filters.is_active : undefined,
                page
            });

            console.log(data.data)
            setAdmins(data.data);
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


    /** Fetch Admin */
    const fetchAdmin = useCallback(async (adminId) => {
        try {
            const res = await adminsService.getAdmin(adminId);
            return res;

        } catch (error) {
            console.log(error)
        }
    } , []);

    /** Call Fetch */
    useEffect(() => {
        fetchAdmins(pagination.current);
    } , [fetchAdmins , pagination.current])


    /** Apply Search */
    const visiableRows = admins.filter((admin) => {
        if(!filters.search) return true;
        const hayStack = Object.values(admin).join(" ").toLowerCase();
        return hayStack.includes(filters.search.toLowerCase());
    })

    return {
        admins: visiableRows,
        loading,
        error,
        filters,
        refetchAdmins : fetchAdmins,
        pagination,
        fetchAdmin,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({...prev , ...(typeof cb === 'function' ? cb(prev) : cb)}))
    }
}