import React, { useState, useEffect } from 'react';
import axios from 'axios';
import XLSX from 'xlsx';
import './App.css';

/* list of supported file types */
const SheetJSFT = [
    'xlsx',
    'xlsb',
    'xlsm',
    'xls',
    'xml',
    'csv',
    'txt',
    'ods',
    'fods',
    'uos',
    'sylk',
    'dif',
    'dbf',
    'prn',
    'qpw',
    '123',
    'wb*',
    'wq*',
    'html',
    'htm',
]
    .map(function (x) {
        return '.' + x;
    })
    .join(',');

function App() {
    const [data, setData] = useState({});

    const getLotto = async () => {
        const response = await axios.get('http://localhost:5000');
        console.log('response', response);
    };

    useEffect(() => {
        getLotto();
    }, []);

    /* generate an array of column objects */
    const make_cols = (refstr) => {
        let o = [],
            C = XLSX.utils.decode_range(refstr).e.c + 1;
        for (var i = 0; i < C; ++i)
            o[i] = { name: XLSX.utils.encode_col(i), key: i };
        return o;
    };

    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) handleFile(files[0]);
    };

    const handleFile = (file /*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            console.log(rABS, wb);
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            /* Update state */
            setData({ data: data, cols: make_cols(ws['!ref']) });
        };
        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    };

    return (
        <div className='App'>
            <form className='form-inline'>
                <div className='form-group'>
                    <label htmlFor='file'>Spreadsheet</label>
                    <input
                        type='file'
                        className='form-control'
                        id='file'
                        accept={SheetJSFT}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </div>
    );
}

export default App;
