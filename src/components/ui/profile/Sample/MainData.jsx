import React from 'react'
import { useTranslation } from 'react-i18next'
import formatArabicDate from '../../../../utils/formatArabicDate';
const MainData = ({ sample = {} }) => {
    const { t } = useTranslation('global');
    const formattedDate = formatArabicDate;
    const spanColoring = (value) => {
        var color = 'bg-blue-200 text-blue-600';
        switch (value) {
            case 'received':
                color = 'bg-blue-200 text-blue-600'
                break;
            case 'in_progress':
            case 0:
                color = 'bg-yellow-200 text-yellow-600'
                break;
            case 'accepted':
            case 'completed':
            case 1:
            case 'سليمة':
                color = 'bg-green-200 text-green-600'
                break;
            case 'rejected':
            case 'canceled':
            case 'غير صالحة':
                color = 'bg-red-200 text-red-600'
                break;
            case 'pending':
                color = 'bg-gray-200 text-gray-600'
                break;



        }

        return color
    }
    return (
        <div
            className="w-full bg-white rounded-xl shadow-md grid grid-cols-3 p-4 gap-4"
            style={{
                backgroundImage: "url('/labPattern.jpg')",
                backgroundSize: "32rem",
                backgroundRepeat: "repeat",
                backgroundBlendMode: "multiply",
            }}
        >

            {/* Serial Name */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.serial_name')}</p>
                <p className={`text-base font-semibold`}>{sample?.serial_name}</p>
            </div>

            {/* Serial Number */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.serial_number')}</p>
                <p className={`text-base font-semibold`}>{sample?.serial_number}</p>
            </div>

            {/* Serial Full */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.serial_full')}</p>
                <p className={`text-base font-semibold`}>{sample?.serial_full}</p>
            </div>

            {/* Received From */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.received_from')}</p>
                <p className={`text-base font-semibold`}>{sample?.received_from}</p>
            </div>

            {/* Received By */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.received_by')}</p>
                <p className={`text-base font-semibold`}>{sample?.received_by}</p>
            </div>

            {/* Sample Condition */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.sampleCondition')}</p>
                <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 ${spanColoring(sample?.sample_condition)}`}>{sample?.sample_condition}</p>
            </div>

            {/* current status */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.current_status')}</p>
                <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100  ${spanColoring(sample?.current_status)}`}>{sample?.current_status}</p>
            </div>


            {/* is completed */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.is_completed')}</p>
                <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100  ${spanColoring(sample?.is_completed)}`}>{sample?.is_completed === 1 ? t('global.completed') : t('global.in_progress')}</p>
            </div>


            {/* qc status */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.qc_status')}</p>
                <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100  ${spanColoring(sample?.qc_status)}`}>{sample?.qc_status}</p>
            </div>

            {/* rejection reason if qc status -> rejected */}

            {
                sample?.qc_status === 'rejected' &&
                <div className={`flex flex-col gap-1`}>
                    <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.rejectionReason')}</p>
                    <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100  ${spanColoring(sample?.qc_status)}`}>{sample?.reject_reason}</p>
                </div>
            }


            {/* received at */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.received_at')}</p>
                <p className={`text-base font-semibold`}>{formattedDate(sample?.received_at).toLocaleDateString("ar-EG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}</p>
            </div>


            {/* started at */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.started_at')}</p>
                <p className={`text-base font-semibold`}>{sample?.started_at ? formattedDate(sample?.started_at).toLocaleDateString("ar-EG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) : t('global.unSelected')}</p>
            </div>


            {/* completed at */}
            {
                sample?.current_status === 'completed' && <div className={`flex flex-col gap-1`}>
                    <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.completed_at')}</p>
                    <p className={`text-base font-semibold`}>{sample?.completed_at ? formattedDate(sample?.completed_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }) : t('global.unSelected')}</p>
                </div>
            }

            {/* canceled at */}
            {
                sample?.current_status === 'rejected' && <div className={`flex flex-col gap-1`}>
                    <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.canceled_at')}</p>
                    <p className={`text-base font-semibold`}>{sample?.canceled_at ? formattedDate(sample?.canceled_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }) : t('global.unSelected')}</p>
                </div>
            }


            {/* sample code */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.sampleCodeData')}</p>
                <p className={`text-base font-semibold`}>{`الرقم التعريفي : ${sample?.sample_code?.id} , الكود : ${sample?.sample_code?.code}`}</p>
            </div>


            {/* workflow */}
            <div className={`flex flex-col gap-1`}>
                <p className={`text-sm text-black/80`}>{t('samplesManagement.sampleProfile.mainInfoData.workflowData')}</p>
                <p className={`text-base font-semibold`}>{`الرقم التعريفي : ${sample?.workflow?.id} , الكود : ${sample?.workflow?.code}`}</p>
            </div>




        </div>
    )
}

export default MainData