// jwt-parser.js

/**
 * Giải mã một chuỗi base64url (dùng trong JWT)
 * @param {string} str - Chuỗi base64url
 * @returns {string} - Chuỗi JSON giải mã
 */
function base64UrlDecode(str) {
    // Bổ sung padding nếu thiếu
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad === 2) str += '==';
    else if (pad === 3) str += '=';
    else if (pad === 1) throw new Error('Invalid base64url string');
    const decoded = atob(str);
    try {
      return decodeURIComponent(escape(decoded)); // hỗ trợ UTF-8
    } catch {
      return decoded;
    }
  }
  
  /**
   * Parse một JWT và trả về header + payload
   * @param {string} token - Chuỗi JWT
   * @returns {{ header: object, payload: object }} - Kết quả giải mã
   */
  function jwtParser(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
  
    const [encodedHeader, encodedPayload] = parts;
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
  
    return { header, payload };
  }
  
  // Nếu dùng trong môi trường module
  export { jwtParser };
  