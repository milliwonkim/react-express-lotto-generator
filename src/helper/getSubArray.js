export const getSort = (object) => {
    // const sortByDesc = Object.entries(object).sort(([, a], [, b]) => b - a);
    // return Object.fromEntries(sortByDesc);
    return Object.entries(object).sort(([, a], [, b]) => b - a);
};

export const getNewArray = (array, object) => {
    if (object) {
        array.push(object);
    } else {
        array.push(null);
    }
};

export const getSubArray = (array, freqObject, i) => {
    const { no1, no2, no3, no4, no5, no6, bonusNumber } = freqObject;
    getNewArray(array, getSort(no1)[i]);
    getNewArray(array, getSort(no2)[i]);
    getNewArray(array, getSort(no3)[i]);
    getNewArray(array, getSort(no4)[i]);
    getNewArray(array, getSort(no5)[i]);
    getNewArray(array, getSort(no6)[i]);
    getNewArray(array, getSort(bonusNumber)[i]);
};
