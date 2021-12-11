const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express(); // create express app

app.use(express.static(path.join(__dirname, 'public', 'index.html')));
app.use(express.static('public'));

const getHtml = async () => {
    try {
        const response = await axios.get(
            'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=861'
        );
        console.log(response.data);
        return response;
    } catch (error) {
        console.log('error: ', error);
    }
};

getHtml();

app.get('/', (req, res) => {
    res.send({ DATA: getHtml().json() });
});

// start express server on port 5000
app.listen(5000, () => {
    console.log('server started on port 5000');
});
