/**
 * Pick an item from the given array by probability evaluation functions.
 */
export function pickByProbability(array, evaluators) {
    if (array.length < 1) {
        return null;
    }
    const results = array.map(() => 0.0);
    // execute each evaluators
    for (const evaluator of evaluators) {
        const { func, weight } = evaluator;
        let min = Infinity;
        let max = -Infinity;
        const evaluatorResults = array.map((value) => {
            const evaluatorResult = func(value);
            min = Math.min(min, evaluatorResult);
            max = Math.max(max, evaluatorResult);
            return evaluatorResult;
        });
        const range = max - min;
        if (range > 0.0) {
            evaluatorResults.map((v, i) => {
                results[i] += weight * (v - min) / range;
            });
        }
    }
    // find an index of an element which has the highest result
    let highestResult = -Infinity;
    let highestIndex = 0;
    for (const [i, result] of results.entries()) {
        if (result > highestResult) {
            highestResult = result;
            highestIndex = i;
        }
    }
    return array[highestIndex];
}
