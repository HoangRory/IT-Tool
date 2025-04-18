// basic-auth-generator.js

/**
 * Mã hóa chuỗi sang Base64 (UTF-8 safe)
 * @param {string} str - Chuỗi cần mã hóa
 * @returns {string} - Chuỗi Base64
 */
function base64Encode(str) {
  if (typeof TextEncoder !== 'undefined') {
    const utf8 = new TextEncoder().encode(str);
    const binary = String.fromCharCode(...utf8);
    return btoa(binary);
  } else {
    // Fallback cho môi trường không hỗ trợ TextEncoder
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Tạo Basic Authorization header từ username và password
 * @param {object} input - Đối tượng chứa username và password 
 * @returns {string} - Header: "Authorization: Basic xxx"
 */
function run(input) {
  const username = input.username || "";
  const password = input.password || "";
  return {result : `Authorization: Basic ${base64Encode(`${username}:${password}`)}`};
}

// Export nếu dùng trong module
export { run };
