import React from 'react'
import { useSelector } from 'react-redux'

const CheckUserPermission = ({ allowedPermission, children }) => {

    const { user, userLoading } = useSelector((state) => state.auth);


    if (userLoading) {
        return null;
    }

    /** if user role return children */
    if (user?.role?.name.toLowerCase() === "super admin") {
        return children;
    }

    if (user?.permissions && user?.permissions?.length > 0) {

        const canPermission = user?.permissions?.map((p) => p.name)?.includes(allowedPermission?.toLowerCase());


        return canPermission ? children : null;

    }



}

export default CheckUserPermission