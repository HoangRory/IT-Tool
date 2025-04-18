function percentOf(a, b) {
    return (a * 1.0 / 100) * b;
}

function whatPercentOf(a, b) {
    return (a * 1.0 / b) * 100;
}

function percentageChange(from, to) {
    return ((to - from) * 1.0 / from) * 100;
}

function run(input) {
    const percentValue = Number(input?.percentValue) || 0;
    const percentBase = Number(input?.percentBase) || 0;
    const partValue = Number(input?.partValue) || 0;
    const wholeValue = Number(input?.wholeValue) || 0;
    const fromValue = Number(input?.fromValue) || 0;
    const toValue = Number(input?.toValue) || 0;

    const percentOfResult = percentOf(percentValue, percentBase);
    const whatPercentResult = whatPercentOf(partValue, wholeValue);
    const changePercentResult = percentageChange(fromValue, toValue);

    return {
        percentOfResult,
        whatPercentResult,
        changePercentResult
    };
}

export { run };
