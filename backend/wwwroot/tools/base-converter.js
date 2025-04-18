export function run(input) {
    const { number, inputBase, customBase } = input;
  
    // Validate inputs
    if (!number || !inputBase) {
      return { error: "Number and input base are required" };
    }
  
    const inputBaseNum = parseInt(inputBase);
    if (isNaN(inputBaseNum) || inputBaseNum < 2 || inputBaseNum > 64) {
      return { error: "Input base must be between 2 and 64" };
    }
  
    // Convert input number to decimal
    let decimalValue;
    try {
      if (inputBaseNum <= 36) {
        decimalValue = parseInt(number, inputBaseNum);
      } else {
        decimalValue = parseCustomBaseToDecimal(number, inputBaseNum);
      }
      if (isNaN(decimalValue)) {
        return { error: "Invalid number for the specified base" };
      }
    } catch (e) {
      return { error: "Invalid number format" };
    }
  
    // Use parsed input number string as default custom base, capped at 64
    const defaultCustomBase = Math.min(parseInt(number) || 64, 64);
    const effectiveCustomBase = customBase !== undefined ? customBase : defaultCustomBase;
  
    // Validate custom base
    if (effectiveCustomBase < 2 || effectiveCustomBase > 64) {
      return { error: "Custom base must be between 2 and 64" };
    }
  
    // Prepare output bases
    const output = {
      binary: decimalValue.toString(2), // Base 2
      octal: decimalValue.toString(8), // Base 8
      decimal: decimalValue.toString(10), // Base 10
      hexadecimal: decimalValue.toString(16).toUpperCase(), // Base 16
      base64: toBase64(decimalValue), // Base 64
      custom: convertToCustomBase(decimalValue, effectiveCustomBase), // Custom base
    };
  
    return output;
  }
  
  // Convert number from custom base (up to 64) to decimal
  function parseCustomBaseToDecimal(number, base) {
    const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    let decimal = 0;
    number = number.toString().toUpperCase();
  
    for (let char of number) {
      const value = digits.indexOf(char);
      if (value === -1 || value >= base) {
        throw new Error("Invalid character for base");
      }
      decimal = decimal * base + value;
    }
    return decimal;
  }
  
  // Convert decimal to custom base (up to 64)
  function convertToCustomBase(decimal, base) {
    if (base < 2 || base > 64) {
      return "Invalid base";
    }
    if (decimal === 0) {
      return "0";
    }
  
    const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    let result = "";
    let num = decimal;
  
    while (num > 0) {
      const remainder = num % base;
      result = digits[remainder] + result;
      num = Math.floor(num / base);
    }
  
    return result || "0";
  }
  
  // Convert decimal to base64 (using standard alphabet)
  function toBase64(decimal) {
    if (decimal === 0) {
      return "0";
    }
  
    const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let num = decimal;
  
    while (num > 0) {
      const remainder = num % 64;
      result = digits[remainder] + result;
      num = Math.floor(num / 64);
    }
  
    return result || "0";
  }