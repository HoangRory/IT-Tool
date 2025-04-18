// jwt-parser.js

/**
 * Giải mã một chuỗi base64url (dùng trong JWT)
 * @param {string} str - Chuỗi base64url
 * @returns {string} - Chuỗi JSON giải mã
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad === 2) str += '==';
  else if (pad === 3) str += '=';
  else if (pad === 1) throw new Error('Invalid base64url string');

  const decoded = atob(str);
  try {
    return decodeURIComponent(
      Array.from(decoded)
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return decoded;
  }
}

/**
 * Parse một JWT và trả về header + payload
 * @param {string} input - Chuỗi JWT
 * @returns {{ header: object, payload: object }} - Kết quả giải mã
 */
function run(input) {
  try {
    const token = typeof input === 'string' ? input : input.jwt;
    if (!token) throw new Error('No JWT provided');

    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');

    const [encodedHeader, encodedPayload] = parts;
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    console.log(header, payload);

    return { header, payload };
  } catch (err) {
    return {
      error: { message: err.message }
    };
  }
}

export { run };
