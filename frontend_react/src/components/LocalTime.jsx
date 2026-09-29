import React, { useEffect, useState } from 'react';

import { PROFILE } from '../constants';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: PROFILE.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const LocalTime = ({ className = '', showSeconds = true }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));

  return (
    <time className={`local-time ${className}`} dateTime={now.toISOString()}>
      {parts.hour}
      <span className="local-time__colon">:</span>
      {parts.minute}
      {showSeconds && <span className="local-time__seconds">:{parts.second}</span>}
    </time>
  );
};

export default LocalTime;
