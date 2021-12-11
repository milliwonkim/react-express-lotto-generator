const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express(); // create express app
const cors = require('cors');
const roundNumber = require('./src/lotto.json');

app.use(cors());

app.use(express.static(path.join(__dirname, 'public', 'index.html')));
app.use(express.static('public'));

const getWholeWinningNumber = async () => {
    // const lastEnd = roundNumber[0].roundNumber;
    const lastEnd = 10;

    const winningArray = [];

    for (let i = 0; i < lastEnd; i++) {
        const response = await axios.get(
            `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${
                i + 1
            }`
        );

        const {
            drwtNo1,
            drwtNo2,
            drwtNo3,
            drwtNo4,
            drwtNo5,
            drwtNo6,
            bnusNo,
            drwNo,
            drwNoDate,
        } = response.data;

        const winning = {
            no1: drwtNo1,
            no2: drwtNo2,
            no3: drwtNo3,
            no4: drwtNo4,
            no5: drwtNo5,
            no6: drwtNo6,
            bonusNumber: bnusNo,
            roundDate: drwNoDate,
            roundNumber: drwNo,
        };

        winningArray.push(winning);
    }

    return winningArray;
};

app.get('/lotto', async (req, res) => {
    try {
        const winningNumber = await getWholeWinningNumber();
        return res.send(winningNumber);
    } catch (error) {
        console.log('error: ', error);
    }
});

app.post('/lotto', (req, res) => {
    try {
        console.log('req.body: ', req.body);
        console.log('res.body: ', res.body);
    } catch (error) {
        console.log('post lotto error: ', error);
    }
});

// start express server on port 5000
app.listen(5000, () => {
    console.log('server started on port 5000');
});
