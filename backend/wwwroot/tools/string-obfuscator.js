export function run(obj) {
  const str = obj?.text || "";
  const visibleStart = obj?.visibleStart ?? 4;
  const visibleEnd = obj?.visibleEnd ?? 4;
  const obfuscationChar = obj?.char || "*";
  const keepSpaces = obj?.keepSpaces || false;

  const totalVisible = visibleStart + visibleEnd;

  if (str.length <= totalVisible) {
    const start = str.slice(0, visibleStart);
    const end = str.slice(-visibleEnd);
    const hiddenLength = Math.max(str.length - totalVisible, 0);
    const hidden = Array(hiddenLength).fill(obfuscationChar).join("");
    return { obfuscated: start + hidden + end };
  }

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middle = str.slice(visibleStart, str.length - visibleEnd);

  let obfuscatedMiddle = "";

  if (keepSpaces) {
    // Giữ nguyên " ", obfuscate các ký tự khác
    obfuscatedMiddle = middle
      .split("")
      .map((ch) => (ch === " " ? " " : obfuscationChar))
      .join("");
  } else {
    // Obfuscate toàn bộ, kể cả khoảng trắng
    obfuscatedMiddle = obfuscationChar.repeat(middle.length);
  }

  return {
    obfuscated: start + obfuscatedMiddle + end
  };
}
