const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // 익스프레스 인스턴스 생성

// Content-Type의 application/json인 HTTP 요청의 바디를 파싱할 수 있도록 설정
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello CoronaBoard!' });
});

const port = process.env.PORT || 8080; // 포트 기본값을 8080으로 지정
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});