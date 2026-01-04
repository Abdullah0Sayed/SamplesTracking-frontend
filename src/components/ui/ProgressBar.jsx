import React from 'react'

const ProgressBar = ({ step, total_steps }) => {
    return (
        <div className={`w-full h-2 bg-slate-200 rounded-full`}>
            <div className={`h-full bg-third-color rounded-full`} style={{ width: `${(step / total_steps) * 100}%` }}>

            </div>
        </div>
    )
}

export default ProgressBar