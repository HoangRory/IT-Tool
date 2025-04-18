function run(input) {
    try {
        const parsed = JSON.parse(input?.json);
        return {
            jsonMinify: JSON.stringify(parsed),
        };
    } catch (error) {
        return 'Invalid JSON';
    }
}

export {run}