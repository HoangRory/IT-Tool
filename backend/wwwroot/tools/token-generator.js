export function generateToken(uppercase, lowercase, numbers, symbols, length) {
    const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    const NUMBER_CHARS = "0123456789";
    const SYMBOL_CHARS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    let charPool = "";
    if (uppercase) charPool += UPPERCASE_CHARS;
    if (lowercase) charPool += LOWERCASE_CHARS;
    if (numbers) charPool += NUMBER_CHARS;
    if (symbols) charPool += SYMBOL_CHARS;

    if (charPool.length === 0) {
        return { error: "At least one character type must be selected." };
    }

    if (length < 1 || length > 512) {
        return { error: "Length must be between 1 and 512." };
    }

    try {
        const randomBytes = new Uint8Array(length);
        crypto.getRandomValues(randomBytes);

        const poolArray = charPool.split("");
        let result = "";
        for (let i = 0; i < length; i++) {
            const index = randomBytes[i] % poolArray.length;
            result += poolArray[index];
        }

        return { token: result };
    } catch (err) {
        return { error: "An error occurred while generating the token." };
    }
}
