let i = 0;
const recursiveLimit = 2000;

export const getRangeRandomNumber = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

export const getRandomNumber = (previousNumber, start, end) => {
    const currentNumber = getRangeRandomNumber(start, end);

    if (previousNumber && previousNumber > 0 && currentNumber > 0) {
        if (previousNumber < currentNumber) {
            return currentNumber;
        }

        if (previousNumber >= currentNumber && i < recursiveLimit) {
            i += 1;
            return getRandomNumber(previousNumber, start, end);
        }
    }
};
