import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import hasAnyPermission from '../hooks/permissions/hasAnyPermission';
import UnAuthorizedAccess from '../pages/Shared/UnAuthorizedAccess';
import Loading from '../components/ui/Loading';


/** Goal: Hide UI Elements From Any User Don't have Admin Role & Show All Elements For Admin Role  */

const ProtectedRoute = ({ children, requiredPermissions, fallbackType = "page" }) => {

    const { user, loading } = useSelector(state => state.auth);

    if (loading) {
        return <Loading />;
    }

    /** if user role super admin show children */
    if (user?.role?.name.toLowerCase() === "super admin") {
        return children
    }


    /** if user not admin & permission is exists & permissions length > 0 */
    if (user?.permissions && user?.permissions?.length > 0) {
        console.log(user?.permissions)

        const can = hasAnyPermission(user?.permissions, requiredPermissions, user?.role?.name?.toLowerCase())
        console.log(user?.permissions)
        console.log(can)
        if (can) {
            console.log(can)
            return children;
        }
        else {
            return fallbackType === 'page' ? <UnAuthorizedAccess /> : null

        }


    }
    else {
        return <UnAuthorizedAccess />
    }


}

export default ProtectedRoute