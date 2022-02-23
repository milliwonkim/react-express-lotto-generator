import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import {
    getRandomNumber,
    getRangeRandomNumber,
} from './helper/getRandomNumber';
import { getSort } from './helper/getSubArray';
import { injectLottoFreq, returnTableArray } from './helper/returnTableArray';

function App() {
    const [array, setArray] = useState([]);
    const [sortArray, setSortArray] = useState([]);
    const [isLoading, setIsLoading] = useState(0);

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

        const freqArray = [];

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

        returnTableArray(freqObject, freqArray);
        setSortArray(freqArray);

        return [
            getSort(no1),
            getSort(no2),
            getSort(no3),
            getSort(no4),
            getSort(no5),
            getSort(no6),
            getSort(bonusNumber),
        ];
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
                el.no4 === number.no4 &&
                el.no5 === number.no5 &&
                el.no6 === number.no6;

            if (StandardAlreadyWonData) return returnTempLottoNumber(response);

            setIsLoading(0);
            setArray([...array, number]);

            return number;
        });
    };

    const returnTempLottoNumber = (responseData) => {
        setIsLoading(2);

        // limit
        // 40 41 42 43 44 45

        // 1 ~ 40
        const limitFor1 = { start: 1, end: 20 };

        //  7 ~ 41
        const limitFor2 = { start: 7, end: 17 };

        // 13 ~ 42
        const limitFor3 = { start: 13, end: 22 };

        // 21 ~ 43
        const limitFor4 = { start: 21, end: 35 };

        // 33 ~ 44
        const limitFor5 = { start: 26, end: 40 };

        // 39 ~ 45
        const limitFor6 = { start: 31, end: 45 };

        const randomNumber1 = getRangeRandomNumber(
            limitFor1.start,
            limitFor1.end
        );
        const randomNumber2 =
            randomNumber1 &&
            getRandomNumber(randomNumber1, limitFor2.start, limitFor2.end);
        const randomNumber3 =
            randomNumber2 &&
            getRandomNumber(randomNumber2, limitFor3.start, limitFor3.end);
        const randomNumber4 =
            randomNumber3 &&
            getRandomNumber(randomNumber3, limitFor4.start, limitFor4.end);
        const randomNumber5 =
            randomNumber4 &&
            getRandomNumber(randomNumber4, limitFor5.start, limitFor5.end);
        const randomNumber6 =
            randomNumber5 &&
            getRandomNumber(randomNumber5, limitFor6.start, limitFor6.end);
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
                            {i + 1}번&nbsp;
                            {`${no1} ${no2} ${no3} ${no4} ${no5} ${no6} * ${bonusNumber}`}{' '}
                            <br />
                        </div>
                    );
                });
            case 1:
                return <p>Get Lotto From Server</p>;
            case 2:
                return <p>Generate Lotto Number</p>;
            default:
                return <p>Get Valid Lotto Number(Verify)</p>;
        }
    };

    return (
        <div className='App'>
            <button onClick={getLotto}>생산</button>
            <br />
            {renderLottoClient()}
            <table style={{ width: '100%', border: '1px solid #424242' }}>
                <thead>
                    <tr>
                        <td>no1</td>
                        <td>no2</td>
                        <td>no3</td>
                        <td>no4</td>
                        <td>no5</td>
                        <td>no6</td>
                        <td>bonus number</td>
                    </tr>
                </thead>
                <tbody style={{ border: '1px solid #424242' }}>
                    {sortArray.map((el, i) => {
                        return (
                            <tr key={i}>
                                {el.map((e, j) => {
                                    if (e === null) {
                                        return <td key={j}></td>;
                                    }
                                    return (
                                        <td key={j}>
                                            {e[0]}({e[1]})
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
