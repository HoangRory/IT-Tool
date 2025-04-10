import { useEffect, useState } from "react";

export function useURLParserLoader() {
    const [parserFn, setParserFn] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:5074/api/tools/url-parser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ returnType: "js" })
                });

                if (!res.ok) {
                    throw new Error(`Failed to load parser: ${res.statusText}`);
                }

                let jsCode = await res.text();

                const blob = new Blob([jsCode], { type: "application/javascript" });
                const blobUrl = URL.createObjectURL(blob);

                const module = await import(  /* @vite-ignore */ blobUrl);
                setParserFn(() => module.parseUrl);
            } catch (error) {
                console.error("Error loading parser tool:", error);
            }
        })();
    }, []);

    // log the parser function to see if it is loaded correctly
    useEffect(() => {
        if (parserFn) {
            console.log("Parser function loaded:", parserFn);
        }
    }, [parserFn]);
    return parserFn;
}

