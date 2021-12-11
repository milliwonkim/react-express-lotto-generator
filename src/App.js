import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
    const [array, setArray] = useState([]);
    const [isLoading, setIsLoading] = useState(0);

    let i = 0;
    const recursiveLimit = 2000;

    const getCurrentNumber = (limitFor) => {
        const digit = Math.floor(Math.random() * (limitFor + 1));

        return digit;
    };

    const getRandomNumber = (previousNumber, limitFor) => {
        const currentNumber = getCurrentNumber(limitFor);

        if (previousNumber && previousNumber > 0 && currentNumber > 0) {
            if (previousNumber < currentNumber) {
                return currentNumber;
            }

            if (previousNumber >= currentNumber && i < recursiveLimit) {
                i += 1;
                return getRandomNumber(previousNumber, limitFor);
            }
        }
    };

    const injectLottoFreq = (freqObject, key, no) => {
        if (no) {
            if (freqObject[`${key}`][`${no}`]) {
                freqObject[`${key}`][`${no}`] += 1;
            } else {
                freqObject[`${key}`][`${no}`] = 1;
            }
        }
    };

    const getSort = (object) => {
        const sortByDesc = Object.entries(object).sort(([, a], [, b]) => b - a);
        return Object.fromEntries(sortByDesc);
    };

    // TODO 1번째 당첨번호에서 무슨 번호가 가장 많이 등장했는지 순서별로 확인 필요
    const getRankByColumn = (response) => {
        const freqObject = {
            no1: {},
            no2: {},
            no3: {},
            no4: {},
            no5: {},
            no6: {},
            bonusNumber: {},
        };

        response.data.forEach((element) => {
            const { no1, no2, no3, no4, no5, no6, bonusNumber } = element;
            injectLottoFreq(freqObject, 'no1', no1);
            injectLottoFreq(freqObject, 'no2', no2);
            injectLottoFreq(freqObject, 'no3', no3);
            injectLottoFreq(freqObject, 'no4', no4);
            injectLottoFreq(freqObject, 'no5', no5);
            injectLottoFreq(freqObject, 'no6', no6);
            injectLottoFreq(freqObject, 'bonusNumber', bonusNumber);
        });

        const { no1, no2, no3, no4, no5, no6, bonusNumber } = freqObject;

        freqObject[no1] = getSort(no1);
        freqObject[no2] = getSort(no2);
        freqObject[no3] = getSort(no3);
        freqObject[no4] = getSort(no4);
        freqObject[no5] = getSort(no5);
        freqObject[no6] = getSort(no6);
        freqObject[bonusNumber] = getSort(bonusNumber);

        return freqObject;
    };

    const getValidNumber = (number, response) => {
        setIsLoading(3);

        const newAlreadyWonData = response.map((el) => {
            return {
                no1: el.no1,
                no2: el.no2,
                no3: el.no3,
                no4: el.no4,
                no5: el.no5,
                no6: el.no6,
            };
        });

        return newAlreadyWonData.filter((el) => {
            const StandardAlreadyWonData =
                el.no1 === number.no1 &&
                el.no2 === number.no2 &&
                el.no3 === number.no3 &&
                el.no4 === number.no4;

            if (StandardAlreadyWonData) {
                return returnTempLottoNumber(response);
            }

            setIsLoading(0);
            setArray([...array, number]);

            return number;
        });
    };

    const returnTempLottoNumber = (responseData) => {
        setIsLoading(2);

        // limit
        // 40 41 42 43 44 45
        const limitFor1 = 40;
        const limitFor2 = 41;
        const limitFor3 = 42;
        const limitFor4 = 43;
        const limitFor5 = 44;
        const limitFor6 = 45;

        const randomNumber1 = Math.floor(Math.random() * (limitFor1 + 1));
        const randomNumber2 =
            randomNumber1 && getRandomNumber(randomNumber1, limitFor2);
        const randomNumber3 =
            randomNumber2 && getRandomNumber(randomNumber2, limitFor3);
        const randomNumber4 =
            randomNumber3 && getRandomNumber(randomNumber3, limitFor4);
        const randomNumber5 =
            randomNumber4 && getRandomNumber(randomNumber4, limitFor5);
        const randomNumber6 =
            randomNumber5 && getRandomNumber(randomNumber5, limitFor6);
        const randomBonusNumber = Math.floor(Math.random() * (44 + 1));

        const tempLottoNumber = {
            no1: randomNumber1,
            no2: randomNumber2,
            no3: randomNumber3,
            no4: randomNumber4,
            no5: randomNumber5,
            no6: randomNumber6,
            bonusNumber: randomBonusNumber,
        };

        if (
            randomNumber1 < randomNumber2 &&
            randomNumber2 < randomNumber3 &&
            randomNumber3 < randomNumber4 &&
            randomNumber4 < randomNumber5 &&
            randomNumber5 < randomNumber6 &&
            randomNumber1 > 0 &&
            randomBonusNumber > 0
        ) {
            return getValidNumber(tempLottoNumber, responseData);
        } else {
            return returnTempLottoNumber(responseData);
        }
    };

    const getLotto = async () => {
        setIsLoading(1);
        const response = await axios.get('http://localhost:5000/lotto');

        console.log('getRankByColumn(response)', getRankByColumn(response));
        getRankByColumn(response);
        returnTempLottoNumber(response.data);
    };

    useEffect(() => {
        getLotto();
    }, []);

    const renderLottoClient = () => {
        switch (isLoading) {
            case 0:
                return array.map((el, i) => {
                    const { no1, no2, no3, no4, no5, no6, bonusNumber } = el;
                    return (
                        <div key={i}>
                            {`${no1} ${no2} ${no3} ${no4} ${no5} ${no6} * ${bonusNumber}`}{' '}
                            <br />
                        </div>
                    );
                });
            case 1:
                console.log('Get Lotto From Server');
                return <p>Get Lotto From Server</p>;
            case 2:
                console.log('Generate Lotto Number');
                return <p>Generate Lotto Number</p>;
            default:
                console.log('Get Valid Lotto Number(Verify)');
                console.log('------------------------------');
                return <p>Get Valid Lotto Number(Verify)</p>;
        }
    };

    return (
        <div className='App'>
            <button onClick={getLotto}>생산</button>
            <br />
            {renderLottoClient()}
        </div>
    );
}

export default App;
