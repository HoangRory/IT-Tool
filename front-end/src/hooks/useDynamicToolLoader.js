import { useEffect, useState } from "react";

/**
 * Hook tải dynamic các hàm từ file JS trên server (dạng hot plug tool)
 * @param {string} toolName - Tên công cụ (vd: "json-beautify")
 * @param {string[]} exportNames - Danh sách các export cần lấy (vd: ["runBeautify", "handleClick"])
 */
export function useDynamicToolLoader(toolName, exportNames = []) {
  const [exports, setExports] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (!toolName || !Array.isArray(exportNames)) return;

        const res = await fetch(`http://localhost:5074/api/tools/${toolName}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnType: "js" })
        });

        if (!res.ok) {
                    if (res.status === 403) {
          const msg = await res.text();
                        setError("Forbid");
                        console.error(`Tool "${toolName}" is forbidden:`, msg);
          return;
                    }
                    throw new Error(`Failed to load tool "${toolName}": ${res.statusText}`);
        }

        const jsCode = await res.text();
        const blob = new Blob([jsCode], { type: "application/javascript" });
        const blobUrl = URL.createObjectURL(blob);

        const module = await import(/* @vite-ignore */ blobUrl);

        const loadedExports = {};
        for (const name of exportNames) {
          if (module[name]) {
            loadedExports[name] = module[name];
            console.log(`Loaded export "${name}" from module "${toolName}"`);
          } else {
            console.warn(`Export "${name}" not found in module "${toolName}"`);
          }
        }

        setExports(loadedExports);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    })();
  }, [toolName, exportNames.join(",")]);

  return { exports, error };
}
