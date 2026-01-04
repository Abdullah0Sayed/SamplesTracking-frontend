import { useCallback, useEffect, useState } from "react"
import { companiesService } from "../../services/accounts/companiesService";




const INITIAL_FILTERS = {
    sorted_by: 'all',
    is_active: undefined,
    search: ''
}

export default function useCompanies(inital_page = 1) {

    /** Companies List */
    const [companies , setCompanies] = useState([]);

     /** Stats */
    const [companiesStats , setCompaniesStats] = useState({});


    /** loading & errors */
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState('');


    /** pagination */
    const [pagination , setPagination] = useState({current: inital_page , total: 1});


    /** Filters */
    const [filters , setFilters] = useState(INITIAL_FILTERS);


    /** Fetch Companies */
    const fetchCompanies = useCallback(async(page = pagination.current) => {
        setLoading(true);
        try {
            const {data} = await companiesService.getAllCompanies({
                sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
                search: filters.search !== null ? filters.search : undefined,
                is_active: filters.is_active !== null ? filters.is_active : undefined,
                page
            });

            console.log(data.data)
            setCompanies(data.data);
            setCompaniesStats(data.stats);
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


    /** Fetch Company */
    const fetchCompany = useCallback(async (companyId) => {
        try {
            const res = await companiesService.getCompany(companyId);
            return res;

        } catch (error) {
            console.log(error)
        }
    } , []);

     

    /** Call Fetch */
    useEffect(() => {
        fetchCompanies(pagination.current);
    } , [fetchCompanies , pagination.current])


    /** Apply Search */
    const visiableRows = companies.filter((company) => {
        if(!filters.search) return true;
        const hayStack = Object.values(company).join(" ").toLowerCase();
        return hayStack.includes(filters.search.toLowerCase());
    })

    return {
        companies: visiableRows,
        companiesStats,
        loading,
        error,
        filters,
        refetchCompanies : fetchCompanies,
        pagination,
        fetchCompany,
        setPage: (p) => setPagination((prev) => ({...prev , current: p})),
        setFilters: (cb) => setFilters((prev) => ({...prev , ...(typeof cb === 'function' ? cb(prev) : cb)}))
    }
}