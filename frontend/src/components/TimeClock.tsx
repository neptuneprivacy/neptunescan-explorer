import { CSSProperties, useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface clockProps {
  timeStamp: number;
  style?: CSSProperties | undefined;
}

export const TimeClock = (props: clockProps) => {
  const { timeStamp, style } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setValue(dayjs.unix(timeStamp).fromNow());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [timeStamp]);

  return <span style={{ ...style }}>{value}</span>;
};

