import React from 'react'
import { BiBriefcaseAlt2, BiCompass, BiEdit, BiPointer, BiSolidEdit, BiSolidTrash, BiTag, BiTrash } from 'react-icons/bi'
import CheckUserPermission from '../../middlewares/CheckUserPermission'

const Card = ({ editPermissionName, deletePermissionName, onEdit, onDelete, cardTitle, serviceIconTitle, serviceIconValue, ServiceIcon, WorkerOrServiceIcon, workerOrServiceIconValue, workerOrServiceIconTitle }) => {
    return (
        <div className={` h-card bg-white rounded-2xl flex flex-row justify-between items-center px-4 hover:ring-1 hover:ring-slate-200 transition`}>
            <div className={`flex flex-col gap-4`}>
                <p className={`text-xl text-black font-semibold leading-6`}>{cardTitle}</p>
                <div className={`flex flex-row gap-4 items-center`}>
                    <div className={`flex flex-row gap-1 items-center`}>
                        {ServiceIcon && <ServiceIcon className={`text-lg`} />}

                        <p className={`text-base font-normal leading-6`}>{serviceIconValue} {serviceIconTitle}</p>
                    </div>
                    <div className={`flex flex-row gap-1 items-center`}>
                        {WorkerOrServiceIcon && <WorkerOrServiceIcon className={`text-lg`} />}
                        <p className={`text-base font-normal leading-6`}>{workerOrServiceIconValue} {workerOrServiceIconTitle}</p>
                    </div>
                </div>
            </div>



            <div className={`controls flex flex-row justify-center items-center gap-2`}>

                {/* Edit Card (Services + Cities + Roles) Permission */}
                {
                    editPermissionName && onEdit && <CheckUserPermission allowedPermission={editPermissionName}>
                        <button onClick={onEdit} className={`w-14 h-14 bg-gray-200 flex justify-center items-center text-black rounded-xl hover:scale-95 transition`}><BiEdit className={`text-2xl text-grey-6 font-light`} /></button>
                    </CheckUserPermission>
                }


                {/* Delete Card (Services + Cities + Roles) Permission */}

                {
                    deletePermissionName && onDelete && <CheckUserPermission allowedPermission={deletePermissionName}>
                        <button onClick={onDelete} className={`w-14 h-14 bg-gray-200 flex justify-center items-center text-black rounded-xl hover:scale-95 transition`}><BiTrash className={`text-2xl text-grey-6 font-light`} /></button>
                    </CheckUserPermission>
                }


            </div>
        </div>
    )
}

export default Card