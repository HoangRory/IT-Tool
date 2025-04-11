import { useEffect, useState } from "react";

export function useHashTextLoader() {
    const [hashFn, setHashFn] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:5074/api/tools/hash-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ returnType: "js" })
                });

                if (!res.ok) {
                    throw new Error(`Failed to load hash function: ${res.statusText}`);
                }

                let jsCode = await res.text();

                const blob = new Blob([jsCode], { type: "application/javascript" });
                const blobUrl = URL.createObjectURL(blob);

                const module = await import(/* @vite-ignore */ blobUrl);

                setHashFn(() => module.hashText);
            } catch (error) {
                console.error("Error loading hash function:", error);
            }
        })();
    }
    , []);
    return hashFn;
}