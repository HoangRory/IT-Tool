function run(input) {
    try {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed);
    } catch (error) {
        return 'Invalid JSON';
    }
}

export {run}