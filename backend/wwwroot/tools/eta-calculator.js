/**
 * Tính toán thời điểm kết thúc và tổng thời gian tiêu thụ
 * @param {number} amountToConsume - Tổng lượng cần tiêu thụ
 * @param {Date | string} startTime - Thời gian bắt đầu (Date hoặc ISO string)
 * @param {number} amountPerSpan - Lượng tiêu thụ mỗi khoảng thời gian
 * @param {number} timeSpanValue - Giá trị khoảng thời gian (ví dụ: 6)
 * @param {"seconds" | "minutes" | "hours" | "days"} unit - Đơn vị khoảng thời gian
 * @returns {{ endTime: Date, durationMs: number }}
 */
function calculateETA(amountToConsume, startTime, amountPerSpan, timeSpanValue, unit) {
  if (!amountToConsume || !amountPerSpan || !timeSpanValue || amountToConsume <= 0 || amountPerSpan <= 0) {
    throw new Error("Invalid input values");
  }

  const unitToMs = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };

  const timePerUnitMs = timeSpanValue * unitToMs[unit];
  const totalSpans = (amountToConsume / amountPerSpan);
  const durationMs = totalSpans * timePerUnitMs;
  const start = new Date(startTime);
  const endTime = new Date(start.getTime() + durationMs);

  return { endTime, durationMs };
}

function formatEndTime(endDate, now = new Date()) {
  if (!(endDate instanceof Date) || isNaN(endDate.getTime()) || endDate.getFullYear() > 275760) {
    return null;
  }
  const isSameDay = endDate.toDateString() === now.toDateString();
  const isTomorrow =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() === endDate.toDateString();

  const hhmm = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (isSameDay) {
    return `Today at ${hhmm}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${hhmm}`;
  }
   else {
    return `${endDate.getDate().toString().padStart(2, "0")}/${(endDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${endDate.getFullYear()} at ${hhmm}`;
  }
}

function formatDuration(durationMs) {
  let remaining = durationMs;
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  remaining %= 60 * 60 * 1000;
  const minutes = Math.floor(remaining / (60 * 1000));
  remaining %= 60 * 1000;
  const seconds = Math.floor(remaining / 1000);
  const milliseconds = remaining % 1000;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
  if (milliseconds > 0) parts.push(`${milliseconds} millisecond${milliseconds > 1 ? "s" : ""}`);

  return parts.join(" ");
}


function run(input) {
  const amountToConsume = input.amountToConsume || 186;
  const startTime = input.startTime || new Date().toISOString();
  const amountPerSpan = input.amountPerSpan || 3;
  const timeSpanValue = input.timeSpanValue || 5;
  const unit = input.unit || "minutes";
  try {
    const { endTime, durationMs } = calculateETA(amountToConsume, startTime, amountPerSpan, timeSpanValue, unit);
    return {
      endTime: formatEndTime(new Date(endTime)),
      duration: formatDuration(durationMs),
    };
  } catch (error) {
    return { error: error.message };
  }
}

export {
  run,
}