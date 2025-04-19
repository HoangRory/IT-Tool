export function shuffleString(str) {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  }
  
  export function run(input) {
    console.log("run called with input:", input); // Debug log
  
    const {
      withUppercase = true,
      withLowercase = true,
      withNumbers = true,
      withSymbols = false,
      length = 64,
      refreshTrigger = 0, // Included to trigger re-run
    } = input;
  
    // Validate inputs
    if (!withUppercase && !withLowercase && !withNumbers && !withSymbols) {
      return { error: "At least one character set must be selected" };
    }
    if (length < 1 || length > 512) {
      return { error: "Length must be between 1 and 512" };
    }
  
    // Define character sets
    const alphabet = [
      withUppercase ? "ABCDEFGHIJKLMOPQRSTUVWXYZ" : "",
      withLowercase ? "abcdefghijklmopqrstuvwxyz" : "",
      withNumbers ? "0123456789" : "",
      withSymbols ? ".,;:!?./-\"'#{([-|\\@)]=}*+" : "",
    ].join("");
  
    // Generate token
    const token = shuffleString(
      alphabet.repeat(Math.ceil(length / alphabet.length))
    ).substring(0, length);
  
    console.log("Generated token:", token); // Debug log
    return { token };
  }