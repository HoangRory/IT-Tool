import { useEffect, useState } from "react";

/**
 * Hook tải động một hàm từ file JS từ server (dạng hot plug tool)
 * @param {string} toolName - Tên công cụ (ví dụ: "bcrypt", "hash-text", "url-parser")
 * @param {string} exportName - Tên hàm export trong module JS (ví dụ: "runBcryptTool", "hashText", "parseUrl")
 * @returns {(params: any) => Promise<any>} - Hàm được tải về hoặc null nếu chưa tải xong
 */
export function useDynamicToolLoader(toolName, exportName) {
    const [toolFn, setToolFn] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                if(toolName === null || exportName === null) {
                    console.error(`Tool name or export name is null`);
                    return;
                }
                const res = await fetch(`http://localhost:5074/api/tools/${toolName}`, {
                    method: "POST",
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

                if (!module[exportName]) {
                    throw new Error(`Function "${exportName}" not found in tool "${toolName}"`);
                }

                setToolFn(() => module[exportName]);
            } catch (err) {
                console.error(`Error loading tool "${toolName}":`, err);
            }
        })();
        console.log(`Loading tool "${toolName}"...`);
    }, [toolName, exportName]);

    return {toolFn, error};
}
