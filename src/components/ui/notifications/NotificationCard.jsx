import React from "react";
import { BiBell } from "react-icons/bi";

const NotificationCard = ({
  alertTitle,
  alertDescription,
  isReading,
  onClick,
}) => {
  return (
    <div
      className={`w-full flex flex-row justify-between items-center p-2 cursor-pointer ${isReading ? "bg-primary-color/0 rounded-md" : "bg-white border rounded-md"} hover:bg-grey-8 transition border-b-2 border-grey-1/30 last:border-none`}
      onClick={onClick}
    >
      <div
        className={`notificationInfo flex flex-row gap-2 justify-between items-center`}
      >
        <div className={`w-fit`}>
          <div
            className={`w-8 h-8 bg-primary-color/80 text-white font-bold rounded-full flex justify-center items-center`}
          >
            <BiBell />
          </div>
        </div>

        <div className={`flex flex-col gap-1`}>
          <p className={`text-sm font-semibold`}>{alertTitle}</p>
          <p className={`text-xs max-w-2xl text-justify leading-tight`}>
            {alertDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
