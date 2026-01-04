import React from 'react'

const Modal = ({ onClose, children }) => {
    return (
        <div className={`fixed inset-0 p-24 z-50 bg-black/50 flex items-center justify-center`} onClick={onClose}>

            <div className={`max-w-3xl w-full bg-white transition ease-in-out rounded-2xl shadow-md p-4 py-8`} onClick={(e) => e.stopPropagation()}>
                {
                    children
                }
            </div>
        </div>
    )
}

export default Modal