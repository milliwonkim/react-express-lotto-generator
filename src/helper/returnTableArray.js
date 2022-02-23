import { getSubArray } from './getSubArray';

const getMostLongerWinning = (object) => {
    const { no1, no2, no3, no4, no5, no6 } = object;
    const lengthOne = Object.keys(no1).length;
    const lengthTwo = Object.keys(no2).length;
    const lengthThree = Object.keys(no3).length;
    const lengthFour = Object.keys(no4).length;
    const lengthFive = Object.keys(no5).length;
    const lengthSix = Object.keys(no6).length;

    const lengthArray = [
        lengthOne,
        lengthTwo,
        lengthThree,
        lengthFour,
        lengthFive,
        lengthSix,
    ];

    let biggestNumber = lengthOne;
    for (let i = 0; i < lengthArray.length; i++) {
        if (biggestNumber <= lengthArray[i]) {
            biggestNumber = lengthArray[i];
        }
    }

    return biggestNumber;
};

export const injectLottoFreq = (freqObject, key, no) => {
    if (no) {
        if (freqObject[`${key}`][`${no}`]) {
            freqObject[`${key}`][`${no}`] += 1;
        } else {
            freqObject[`${key}`][`${no}`] = 1;
        }
    }
};

export const returnTableArray = (freqObject, freqArray) => {
    const one = [];
    const two = [];
    const three = [];
    const four = [];
    const five = [];
    const six = [];
    const bonus = [];

    for (let i = 0; i < getMostLongerWinning(freqObject); i++) {
        if (i === 0) getSubArray(one, freqObject, i);
        if (i === 1) getSubArray(two, freqObject, i);
        if (i === 2) getSubArray(three, freqObject, i);
        if (i === 3) getSubArray(four, freqObject, i);
        if (i === 4) getSubArray(five, freqObject, i);
        if (i === 5) getSubArray(six, freqObject, i);
        if (i === 6) getSubArray(bonus, freqObject, i);
    }

    freqArray.push(one);
    freqArray.push(two);
    freqArray.push(three);
    freqArray.push(four);
    freqArray.push(five);
    freqArray.push(six);
    freqArray.push(bonus);
};
