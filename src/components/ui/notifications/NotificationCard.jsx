import React from 'react'

const NotificationCard = () => {
  return (
  <div className={`flex flex-row justify-between items-center p-4 cursor-pointer hover:bg-grey-8 transition border-b-2 border-grey-1/30 last:border-none`}>
                                        <div className={`notificationInfo flex flex-row gap-4 items-center`}>
                                            <div className={`w-12 h-12 bg-primary-color text-white font-bold rounded-full flex justify-center items-center`}>
                                                A
                                            </div>  
                                            <div className={`flex flex-col gap-2`}>
                                                <p className={`text-lg font-semibold`}>العنوان</p>
                                                <p className={`text-sm`}>الوصف</p>

                                            </div>
                                        </div>
                                      <p className={`text-sm`}>منذ دقيقة</p>
                                    </div>  )
}

export default NotificationCard