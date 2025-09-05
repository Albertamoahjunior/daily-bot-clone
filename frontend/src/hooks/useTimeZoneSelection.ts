import { useState } from "react";

//props for timzone contex

export const useTimeZoneSelection = ({ timezone }: { timezone: string | '' }) => {
  const timezoneOptions = [
    { value: "GMT", label: "GMT (Greenwich Meridian Time)" },
    { value: "UTC", label: "UTC" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "IST", label: "IST (Indian Standard Time)" },
  ];

  const [selectedTimezone, setSelectedTimezone] = useState(timezone);

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
    console.log("Selected Timezone:", value);
  };

  return { selectedTimezone, handleTimezoneChange, timezoneOptions };
};
