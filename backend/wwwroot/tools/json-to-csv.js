function run(data) {
  try {
    // Xử lý dấu phẩy cuối cùng trước khi parse
    let jsonStr = data.json
      .replace(/,\s*}/g, '}')  // loại dấu , trước dấu }
      .replace(/,\s*]/g, ']'); // loại dấu , trước dấu ]

    let parsed = JSON.parse(jsonStr);

    // Nếu là object đơn, bọc vào mảng
    const jsonArray = Array.isArray(parsed) ? parsed : [parsed];

    if (jsonArray.length === 0) return { csv: "" };

    // Lấy các keys từ object đầu tiên làm headers
    const headers = Object.keys(jsonArray[0]);
    const csvRows = [];

    // Thêm dòng header
    csvRows.push(headers.join(","));

    // Thêm từng dòng dữ liệu
    for (const row of jsonArray) {
      const values = headers.map(header => {
        const val = row[header] ?? "";
        return typeof val === "string"
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      });
      csvRows.push(values.join(","));
    }

    return { csv: csvRows.join("\n") };

  } catch (error) {
    return { csv: "", error: "Invalid JSON format" };
  }
}


const copyToClipboard = (csv) => {
  navigator.clipboard.writeText(csv).then(() => {
    console.log("CSV copied to clipboard!");
  }).catch(err => {
    console.error("Error copying CSV to clipboard: ", err);
  });
};
export {
    run,
    copyToClipboard
}