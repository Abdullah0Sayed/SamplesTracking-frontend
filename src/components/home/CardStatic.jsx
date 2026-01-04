import React from 'react'
import { BiLabel, BiLaptop, BiSolidPolygon } from 'react-icons/bi'
import { BsGeo } from 'react-icons/bs'
import { FaMicroscope } from 'react-icons/fa6'
import { GiChampions } from 'react-icons/gi'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

const CardStatic = ({ card_static_title, dataForChart, Icon, card_static_value, card_static_measurement, icon_color, card_bg_color, card_icon_bg_color, card_text_bg_color }) => {
    return (
        <div className={`card relative flex flex-1 mx-1 flex-row ${card_bg_color} gap-1 p-4 hover:ring-1 ring-primary-color shadow transition-all`} >
            {/* <div className={`absolute inset-0 bg-black/10 rounded-md`}></div> */}
            <div className={`w-full flex flex-col `}>
                <div className={`w-full card-body flex flex-col gap-1`}>
                    <p className={`text-black text-3xl font-bold font-montserrat`}>{card_static_value ?? '...'}</p>
                </div>
                <div className={`card-header flex flex-row justify-between items-center`}>
                    <div className={`flex flex-col gap-2`}>
                        <p className={`text-black text-xl font-bold rounded-md`}>{card_static_title}</p>
                        <p className={`text-sm text-green-600 font-light`}>{card_static_measurement}</p>

                    </div>

                    {
                        Icon && <Icon className={`${icon_color} text-3xl font-bold ${card_icon_bg_color} px-2 py-1 rounded-full`} />
                    }

                </div>

            </div>

            <div className={`flex justify-center items-center text-4xl text-black/10`}>
                <FaMicroscope />
            </div>
            {/* <ResponsiveContainer width="50%" height={100}>
                <AreaChart
                    data={dataForChart}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                    <Area type="bumpX" dataKey="count" fill="none" />    </AreaChart>
            </ResponsiveContainer> */}


        </div>
    )
}

export default CardStatic