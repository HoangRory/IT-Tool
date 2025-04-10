export function parseUrl(url) {
    const urlObj = new URL(url);
    const searchParams = Object.fromEntries(urlObj.searchParams.entries());

    return {
        protocol: urlObj.protocol,
        username: urlObj.username,
        password: urlObj.password,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        searchParams: searchParams
    };
}
