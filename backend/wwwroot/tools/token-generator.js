// token-generator-tool.js

const CHAR_SETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  };
  
  /**
   * Tạo token ngẫu nhiên
   * @param {Object} obj
   * @param {boolean} obj.uppercase
   * @param {boolean} obj.lowercase
   * @param {boolean} obj.numbers
   * @param {boolean} obj.symbols
   * @param {number} obj.length
   * @returns {{ result: string }}
   */
  export function run(obj) {
    const {
      uppercase = false,
      lowercase = false,
      numbers = false,
      symbols = false,
      length = 1,
    } = obj;
  
    if (typeof length !== "number" || length < 1 || length > 512)
      throw new Error("Length must be a number between 1 and 512.");
  
    const enabledSets = Object.entries({ uppercase, lowercase, numbers, symbols })
      .filter(([_, enabled]) => enabled)
      .map(([key]) => CHAR_SETS[key])
      .join("");
  
    if (!enabledSets) {
      throw new Error("At least one character type must be selected.");
    }
  
    const pool = enabledSets.split("");
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
  
    const result = Array.from(randomBytes, (byte) => pool[byte % pool.length]).join("");
  
    return {token: result}; ;
  }
  