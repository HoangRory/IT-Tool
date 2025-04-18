export function run(input) {
    const { msTotal } = input;
  
    // Validate input
    if (msTotal === undefined || msTotal === null || isNaN(msTotal)) {
      return { error: "Valid millisecond value is required" };
    }
  
    // Format milliseconds to HH:MM:SS.mmm
    const formattedTime = formatMs(msTotal);
  
    return {
      formattedTime,
    };
  }
  
  function formatMs(msTotal) {
    const ms = msTotal % 1000;
    const secs = ((msTotal - ms) / 1000) % 60;
    const mins = (((msTotal - ms) / 1000 - secs) / 60) % 60;
    const hrs = (((msTotal - ms) / 1000 - secs) / 60 - mins) / 60;
    const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';
  
    return `${hrsString}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(3, '0')}`;
  }