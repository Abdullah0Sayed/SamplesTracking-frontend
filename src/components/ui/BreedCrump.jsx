import React from 'react'

const BreedCrump = ({ breed_title }) => {
    return (
        <div className={`breed-crump flex flex-col gap-2 my-4`}>
            <p className={`text-2xl font-black`}>{breed_title}</p>
        </div>
    )
}

export default BreedCrump