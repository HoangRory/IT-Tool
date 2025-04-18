export function run(obj) {
    const text = obj.text || "";
    const characters = text.length;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;

    const encoder = new TextEncoder();
    const bytes = encoder.encode(text).length;

    const formattedBytes = bytes < 1024
        ? `${bytes} Bytes`
        : `${(bytes / 1024).toFixed(2)} KB`;

    return { characters, words, lines, bytes: formattedBytes };
}
