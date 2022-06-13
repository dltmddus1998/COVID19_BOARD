# COVID19_BOARD
MUST HAVE 코로나 보드로 배우는 실전 웹 서비스 개발 클론 코딩

# 1. 백엔드에서 서비스 준비하기

---

## 1) 패키지 설정 파일 생성하기

```json
// package.json
{
  "name": "covid19_board",
  "version": "1.0.0",
  "description": "MUST HAVE 코로나 보드로 배우는 실전 웹 서비스 개발 클론 코딩",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dltmddus1998/COVID19_BOARD.git"
  },
  "author": "seungyeonLee",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/dltmddus1998/COVID19_BOARD/issues"
  },
  "homepage": "https://github.com/dltmddus1998/COVID19_BOARD#readme",
  "dependencies": {
    "lodash": "^4.17.20"
  }
}
```

## 2) API 서버용 노드JS 프로젝트 만들기

![image](https://user-images.githubusercontent.com/73332608/172057779-4395d404-58e1-4d6d-a93e-1eaf50667ffd.png)

[coronaboard-api] 디렉터리를 만든 후 그 안에서 `npm init` 실행하기.

```json
// coronaboard-api/package.json
{
  "name": "coronaboard-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

## 3) 익스프레스 준비하기

✔︎ npm install 명령으로 express 프레임 워크와 body-parser 라이브러리를 설치한다.

⭐️ `body-parser`은 **서버로 들어오는 HTTP 요청에 포함된 바디를 파싱해서 코드에서 해당 내용을 읽는 기능을 제공하는 라이브러리**로, 익스프레스로 API 서버를 만들 때 필수라고 생각해도 좋다.

## 4) 익스프레스 동작 확인하기

**‼️ 코딩 시작~~!!**

```jsx
// index.js
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
```

## 5) 데이터베이스 준비하기

### 1. 코로나보드용 데이터베이스와 계정 만들기

1. 데이터베이스 생성
    
    `create database coronaboard;`
    
2. 계정 생성
    
    `create user 'coronaboard_admin'@'%' identified by '비밀번호';`
    
3. 권한 부여
    
    `grant create, alter, drop, index, insert, select, update, delete, lock tables on coronaboard.* to 'coronaboard_admin'@'%';`
    

![image](https://user-images.githubusercontent.com/73332608/172057812-17c18500-f27c-49b0-b12c-eb7bcd7256a5.png)

## 6) API 서버와 데이터베이스 연동하기

<aside>
💡 **API 서버는 데이터베이스 테일블을 직접 조작하지 않고 중간에 ORM을 이용할 예정이다.**

</aside>

> **ORM이란, 프로그래밍 언어에서의 객체 모델을 관계형 데이터베이스 테이블로 자동 매핑하는 계층을 말한다.**
> 

✔︎ ORM을 이용하면 SQL을 따로 작성할 필요가 없어, 개발 생산성이 높아진다.

✔︎ ORM을 이용하기 위해서는 **Sequelize ORM**과 **MySQL 커넥터** 설치가 필요하다.

설치 이후 데이터베이스에 연동해보자.

1. Sequelize ORM과 MySQL 커넥터 설치
2. 객체 모델 설계 
3. Sequelize로 객체 모델 정의
4. 데이터베이스 연결 설정
5. 데이터베이스와 객체 모델 동기화

### MySQL 커넥터와 Sequelize ORM 설치하기

```jsx
// coronaboard-api/database/global-stat.model.js
const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    return sequelize.define(
        'GlobalStat',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED, // 양의 정수
                allowNull: false,
                primaryKey: true,
            },
            cc: { // country code
                type: DataTypes.CHAR(2),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            confirmed: { // 확진자 수
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            death: { // 사망자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            released: { // 완치자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            tested: { // 총 검사자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            testing: { // 검사중 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            negative: { // 결과 음성 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,  // 시퀄라이즈 인스턴스
            tableName: 'GlobalStat',    // 데이터베이스에서 테이블명
            indexes: [  // 테이블 인덱스
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'ccWithDate',
                    unique: true,
                    fields: [{ name: 'cc' }, { name: 'date' }],
                },
            ],
            timestamps: false, // 타임스탬프 속성 자동 생성 x
        },
    );
};
```

### 데이터베이스 연결 설정

✔︎ 위에서 만든 객체 모델을 MySQL 서버와 연결하기.

```jsx
const Sequelize = require('sequelize');

// 1. 데이터베이스 연결 정보 설정
const config = {
    host: process.env.CORONABOARD_MYSQL_HOST || '127.0.0.1',
    port: 3306,
    database: 'coronaboard',
    user: 'coronaboard_admin',
    password: process.env.CORONABOARD_MYSQL_PASSWORD || 'lavulavu',
};

// 2. 데이터베이스 연결 정보를 입력해 시퀄라이즈 인스턴스 생성
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql',
});

// 3. 외부 모듈에서 사용할 수 있도록 내보내기
module.exports = {
    sequelize,
    // 데이터베이스 연결이 완료된 객체 모델 생성
    GlobalStat: require('./global-stat.model.js')(sequelize),
    // 또 다른 객체 모델이 필요하면 똑같은 방식으로 아래 줄에 추가
}
```

1. **데이터베이스 연결 정보 설정**
    
    ✔︎ host의 주소로 환경 변수에 지정된 값을 불러오거나, 없다면 127.0.0.1 할당
    
    ✔︎ 개발할 때는 로컬 호스트에 설치한 MySQL 서버를 사용하다가, 차후 운영 환경에 배포할 때는 CORONABOARD_MYSQL_HOST 환경 변수를 설정해 실제 MySQL 서버 연결
    
2. **데이터베이스 연결 정보를 입력해 시퀄라이즈 인스턴스 생성**
    
    ✔︎ 앞에서 준비한 설정값들을 이용해 시퀄라이즈 인스턴스 생성
    
3. 외부 모듈에서 사용할 수 있도록 내보내기
    
    ✔︎ 방금 생성한 인스턴스를 다른 모듈에서 사용할 수 있도록 익스포트한다.
    
    ✔︎ `require('./global-stat.model.js')(sequelize),` → sequelize 인스턴스를 입력으로 건네 `global-stat.model.js`에서 export한 화살표 함수 호출
    
    ✔︎ 이렇게 호출하면 화살표 함수가 데이터베이스 연결까지 완료된 GlobalStat 객체 모델을 생성해 반환해준다.
    
     만약 또 다른 객체 모델이 필요하다면 global-stat.model.js 같은 모델 정의 파일을 새로 생성해 같은 방식으로 이 위치에 추가하면 된다.
    
    이 방식을 사용하면 객체 모델의 수가 많아지더라도 모델당 하나의 파일로 분산해 편리하게 코드를 관리할 수 있다.
    

### 데이터베이스와 객체 모델 동기화

```jsx
// coronaboard-api/index.js Refactoring
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database');

async function launchServer() { // 1
    const app = express(); // 익스프레스 인스턴스 생성
    // Content-Type의 application/json인 HTTP 요청의 바디를 파싱할 수 있도록 설정
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Hello CoronaBoard!' });
    });

    try {
        await sequelize.sync(); // 2
        console.log('Database is ready!');
    } catch(error) {
        console.log('Unable to connect to the database:');
        console.log(error);
        process.exit(1);
    }

    const port = process.env.PORT || 8080; // 포트 기본값을 8080으로 지정
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

launchServer();
```

✔︎ 처음 API 서버를 띄웠던 코드와 비교하면, 서버를 초기화하고 시작하는 코드를 `launchServer()`라는 비동기 함수로 감쌈. (1)

✔︎ 내부에 `sequelize.sync()`를 실행하는 코드를 추가함 (2)

→ `sequelize.sync()`메서드는 이름 그대로 **sequelize에 정의된 객체 모델을 기준으로 실제 데이터베이스와 동기화를 수행해 테이블 스키마를 생성 또는 변경**하는 역할을 한다.

![image](https://user-images.githubusercontent.com/73332608/172057832-f0413ed2-0f47-429d-90f5-ddc69215201e.png)

## 7) API 만들기

> **익스프레스 프레임워크 기반의 웹 애플리케이션 서버가 준비되었고, 서버에서 시퀄라이즈 ORM을 이용해 데이터베이스에 접근하는 준비도 완료되었다. 
이제 마지막으로 클라이언트가 서버에 정의된 API를 호출해서 원하는 데이터를 저장하거나 조회할 수 있도록 연결하는 일만 남았다.**
> 

### 코로나보드에서 필요한 통계 데이터 API

1. 모든 국가, 모든 날짜에 대한 전체 통계 데이터를 불러오는 API
2. 새로운 데이터를 삽입하거나 또는 기존 데이터를 갱신하는 API
3. 잘못 입력된 데이터를 삭제하는 API

‼️ 이 API들을 구현하려면 먼저 라우팅과 컨트롤러 개념을 이해해야 한다. 

### Router & Controller

✔︎ 서버에서 여러 API들을 제공하려면 HTTP 요청에 따라 실행될 코드를 메서드와 경로별로 미리 연결해줘야 한다. (→ **라우팅** [Routing])

✔︎ 요청을 받고, 요청에 맞게 비즈니스 로직을 수행한 후 다시 응답을 돌려주는 역할을 하는 코드 (→ **컨트롤러** [controller])

### 컨트롤러 구현하기

```jsx
// coronaboard-api/controller/global-stat.controller.js
const { GlobalStat } = require('../database');

// 데이터 조회
async function getAll(req, res) {
    const result = await GlobalStat.findAll();
    res.status(200).json({ result });
}

// 데이터 삽입 또는 업데이트
async function insertOrUpdate(req, res) {
    const { cc, date } = req.body;
    if (!cc || !date) {
        res.status(400).json({ error: 'cc and date are required' });
        return;
    }

    // 조건(cc & date)에 맞는 데이터 개수 확인
    const count = await GlobalStat.count({
        where: { cc, date }
    });

    if (count === 0) {
        await GlobalStat.create(req.body);
    } else {
        await GlobalStat.update(req.body, {
            where: { cc, date }
        });
    }

    res.status(200).json({ result: 'success' });
}

// 데이터 삭제
async function remove(req, res) {
    const { cc, date } = req.body;
    if (!cc || ! date) {
        res.status(400).json({ error: 'cc and date are required' });
        return;
    }

    await GlobalStat.destroy({
        where: { cc, date }
    });

    res.status(200).json({ result: 'success' });
}

module.exports = {
    getAll,
    insertOrUpdate,
    remove,
};
```

‼️ **GlobalStat.destroy() 함수 호출시, 조건(where절)을 명시하지 않으면, GlobalStat 테이블 안의 모든 데이터가 삭제되니 주의해야 한다.**

### 컨트롤러와 라우팅 연결하기

서버의 특정 경로에 HTTP 요청이 왔을 때 해당 경로에 맞는 컨트롤러의 함수로 요청을 전달하도록 라우팅을 설정해주자.

```jsx
// coronaboard-api/index.js
.
.
.
const globalStatController = require('./controller/global-stat.controller.js');

async function launchServer() {
   .
	 .
	 .
    app.get('/global-stats', globalStatController.getAll);
    app.post('/global-stats', globalStatController.insertOrUpdate);
    app.delete('/global-stats', globalStatController.remove);
	 .
	 .
	 .
}

launchServer();
```

### 예외 처리를 하는 공통 에러 핸들러 만들기

```jsx
// coronaboard-api/util.js
const errorHandler = block => async (req, res) => {
    try {
        await block(req, res);
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
};

const wrapWithErrorHandler = obj => {
    Object.keys(obj).forEach(key => { // 1
        obj[key] = errorHandler(obj[key]); // 2
    });
    return obj;
};

module.exports = {
    wrapWithErrorHandler,
};
```

> **`block()` 함수를 인수로 받는 `errorHandler()` 함수를 만들고, 해당 함수가 try-catch 구문이 포함된 함수를 반환한다. 인수로 받은 `block()` 함수는 try 구문 내에서 실행된다. 컨트롤러에 정의된 `getAll()`, `insertOrUpdate()`, `remove()` 같은 함수들이 `errorHandler()` 함수의 `block()` 함수에 대입되어 사용된다고 생각하면 된다.**
> 
1. `Object.keys()` 함수는 해당 객체가 가진 모든 키를 배열로 반환하는 함수이다. 
2. 이렇게 얻은 배열을 `forEach()` 함수를 이용하여 순회하면서 전달받은 obj 객체에 들어있는 기존 함수들을 errorHandler로 한 번 감싸주게 된다.

‼️ **이제 wrapWithErrorHandler() 함수를 기존에 작성했던 컨트롤러의 각 메서드에 일괄 적용해보자.**

```jsx
// coronaboard-api/controller/global-stat.controller.js
.
.
.
module.exports = wrapWithErrorHandler({
    getAll,
    insertOrUpdate,
    remove,
});
```

✔︎ **이와 같이 에러핸들링을 해놓으면, 잘못된 데이터가 post될 경우 다음과 같이 500 상태코드와 에러메시지를 바로 볼 수 있다.**

![image](https://user-images.githubusercontent.com/73332608/172057840-63c5fa49-631c-4163-b3d8-ec826b8f6d0b.png)

<br>
<br>

### 🙄 다양한 값을 저장하는 범용 API 만들기

> 잡다한 데이터를 저장하고 쓰는 새로운 API를 추가해보자.
> 

웹 서비스를 만들다 보면 단순 설정값 또는 간단한 데이터 등 데이터 양이 많지 않아서 데이터베이스에 별도 테이블까지 만들어서 저장할 정도는 아닌 애매한 데이터를 다루는 경우가 종종 있다. 이러한 데이터를 테이블 하나에 키값 쌍을 한 행으로 저장해서 어떤 데이터든 유연하게 저장하고 불러올 수 있는 key-value API를 만들 것이다. 성별/나이대별 확진자 통계의 경우 날짜별 데이터가 필요 없고 오늘 날짜 데이터 하나만 필요하므로 (데이터양이 매우 적음) 이 API를 사용해 저장할 예정이다.

방식은 위에서 global-stat API를 만든 방식과 동일하니 설명은 생략한다.

```jsx
// coronaboard-api/database/key-value.model.js
const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    return sequelize.define(
        'KeyValue',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'KeyValue',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'key',
                    unique: true,
                    fields: [{ name: 'key' }],
                },
            ],
        },
    );
};
```

```jsx
// coronaboard-api/controller/key-value.controller.js
const { KeyValue } = require('../database');
const { wrapWithErrorHandler } = require('../util.js');

async function get(req, res) {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error: 'key is required' });
        return;
    }

    const result = await KeyValue.findOne({
        where: { key },
    });
    res.status(200).json({ result });
}

async function insertOrUpdate(req, res) {
    const { key, value } = req.body;
    if (!key || !value) {
        res.status(400).json({ error: 'key and value are required' });
        return;
    }

    await KeyValue.upsert({ key, value });

    res.status(200).json({ result: 'success' });
}

async function remove(req, res) {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error: 'key is required' });
        return;
    }

    await KeyValue.destroy({
        where: { key },
    });

    res.status(200).json({ result: 'success' });
}

module.exports = wrapWithErrorHandler({
    get,
    insertOrUpdate,
    remove,
});
```

```jsx
// coronaboard-api/database/index.js
.
.
.
// 3. 외부 모듈에서 사용할 수 있도록 내보내기
module.exports = {
    sequelize,
    // 데이터베이스 연결이 완료된 객체 모델 생성
    GlobalStat: require('./global-stat.model.js')(sequelize),
    KeyValue: require('./key-value.model.js')(sequelize),
};
```

```jsx
// coronaboard-api/index.js
.
.
.
app.get('/key-value/:key', keyValueController.get);
app.post('/key-value', keyValueController.insertOrUpdate);
app.delete('/key-value/:key', keyValueController.remove);
```

<br>
<br>

# 2. 저장소 구축하기: 구글 시트

---

<aside>
💡 **구글 시트 서비스를 이용하여 스프레드시트에 콘텐츠를 입력, 가공, 활용해보자.**

</aside>

## 1) Start

### 🔗 순서

1. **코로나보드와 구글 시트**
2. **구글 시트 API 사용 설정**
    1. GCP(Google Could Platform) 콘솔에서 신규 프로젝트 생성하기
    2. 구글 시트 API 활성화하기
    3. OAuth 동의 화면 설정하기 
    4. OAuth 클라이언트 ID 생성 및 설정 파일 내려받기
    5. 구글 시트 API 클라이언트 생성하기
3. **구글 시트 API로 데이터 읽기**
    1. 자료 형태 미리보기
    2. 데이터 읽어 객체로 변환하기 
    3. 실제 데이터에 적용해보기 

> **구글 시트는 구글에서 제공하는 무료 온라인 스프레드시트 애플리케이션이다. 
엑셀 파일을 가져오거나 엑셀 파일로 내보낼 수도 있다.**
> 

### 구글 시트의 장.단점

♥️ **장점**

- 온라인 스프레드시트이므로 인터넷에세만 연결되어 있으면 어디서든 이용 가능
- 다른 사람과 공유하여 하나의 시트를 동시에 편집 가능
- 변경 추적 기능을 이용하면 누가 언제 어느 내용을 변경했는지 쉽게 찾아낼 수 있어서 공동 작업에 유리
- 내용을 읽고 수정하는 API를 제공하여 일종의 데이터베이스처럼 활용할 수 있음

**🚨 단점** 

- 저장 가능한 데이터양이 시트당 최대 500만 개의 셀로 제한됨
- API를 통해 구글 시트의 데이터를 읽거나 수정하는 작업은 100초 동안 최대 100번만 호출 가능
- API를 통해 시트 데이터 전체를 읽어들이는 코드는 작성하기 쉽지만 원하는 셀을 찾아 데이터를 업데이트하는 코드는 작성하기 어려운 편
- API 응답 속도가 조금 느린 편

### 📉 코로나보드와 구글 시트

코로나19 상황에 따라, 어떤 통계 데이터가 제공될지, 어떤 기능이 필요할지 예측 불가능했음

→ 새로운 형태의 정보가 공개될 때마다 그 정보를 보여주는 기능을 최대한 빠르게 개발하는 것이 중요했음 & 콘텐츠를 손쉽게 입력하는 도구 필요

SO, 구축 시간이 더 걸리는 RDBMS를 이용하면 비효율적이라 판단 → 데이터베이스 대신 구글 시트를 주요 데이터 저장소로 선택

```jsx
// coronaboard-api/tools/sheet_api_client_factory.js
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'accessToekn.json';

class SheetApiClientFactory {
    static async create() {
        // 1. 구글 OAuth 클라이언트 사용을 위해 credentionals.json파일 읽기
        const credential = fs.readFileSync('credentials.json');
        // 2. 해당 파일을 이용해서 OAuth 인증 절차 진행
        const auth = await this._authorize(JSON.parse(credential));
        // 3. 생성된 OAuth 클라이언트를 이용하여 구글 시트 API 클라이언트 생성
        return google.sheets({ version: 'v4', auth });
    }

    static async _authorize(credentials) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        // 4. 구글 OAuth 클라이언트 초기화 
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0],
        );

        // 5. 기존에 발급받아둔 엑세스 토큰이 없다면 새롭게 발급 요청
        if (!fs.existsSync(TOKEN_PATH)) {
            const token = await this._getNewToken(oAuth2Client);
            oAuth2Client.setCredentials(token);

            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to', TOKEN_PATH);

            return oAuth2Client;
        }

        // 6. 기존에 발급받아둔 엑세스 토큰이 있으면 바로 사용
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);

        return oAuth2Client;
    }

    static async _getNewToken(oAuth2Client) {
        // 7. OAuth 인증 진행을 위한 URL 생성
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('다음 URL을 브라우저에서 열어 인증을 진행하세요:', authUrl);

        // 8. 터미널에서 키보드 입력 대기
        const rl = readline.createInterface({
            input: process.stdin,
            ouput: process.stdout,
        });

        const code = await new Promise((resolve) => {
            rl.question('인증이 완료되어 발급된 코드를 여기에 붙여넣으세요: ', (code) => {
                resolve(code);
            });
        });

        rl.close();

        // 9. 인증 코드를 이용하여 엑세스 토큰 발급
        const resp = await oAuth2Client.getToken(code);
        return resp.tokens;
    }
}

module.exports = SheetApiClientFactory;
```

> 해당 코드는 OAuth 클라이언트를 통해 구글 시트 API 호출을 할 수 있는 권한을 가진 액세스 토큰을 발급하고, 이 토큰을 사용하는 구글 시트 API 클라이언트를 생성한다.
> 
- 1. 구글 OAuth 클라이언트 사용하는 데 필요한 클라이언트 ID와 클라이언트 보안 비밀번호가 담긴 `credentials.json` 파일을 읽어들인다.
    
    → 이렇게 읽어들인 정보로 4. 구글 OAuth 인증 절차를 진행하기 위한 OAuth 클라이언트를 초기화한다.
    
- 5. 이미 발급받은 액세스 토큰이 없다면 새롭게 발급 요청을 한   후, 액세스 토큰을 파일로 저장한다.
    
    → 저장해둔 액세스 토큰이 이미 있으면, 매번 OAuth 인증 절차를 거칠 필요 없이 6.에서처럼 저장된 토큰을 재활용해서 구글 시트 API를 계속 호출할 수 있다. 
    
- **OAuth 인증 절차**는 인증 코드를 먼저 획득하고 이 인증 코드를 이용하여 액세스 토큰을 발급받는 순서로 진행된다.
    
    → 7. 은 이러한 인증 과정을 웹브라우저에서 진행하는 데 필요한 웹페이지의 URL을 생성한다. 
    
    ✔︎ 이 URL에 웹브라우저로 접속하여 실제 구글 계정으로 로그인을 하면 이 OAuth 클라이언트에 구글 시트 API를 사용할 권한을 부여할 것인지 물어본다. 
    
    ✔︎ 여기서 권한을 부여하면 인증 코드가 생성된다.
    
- 8.에서는 터미널에서 입력 프롬포트를 띄우고 사용자가 인증 코드를 입력할 때까지 키보드 입력을 기다린다.
    
    ✔︎ 생성된 인증 코드를 사용자가 입력하면 해당 코드를 이용하여 9.에서 액세스 토큰 발급 요청을 진행한다.
    

<aside>
💡 실제로 인증 절차를 수행해서 액세스 토큰을 발급받으려면 방금 만든 SheetApiClientFactory 클래스를 실행해주는 진입점이 필요하다.

</aside>

```jsx
// coronaboard-api/tools/sheet_api_client_factory_tester.js
const SheetApiClientFactory = require('./sheet_api_client_factory.js');

async function main() {
    try {
        await SheetApiClientFactory.create();
    } catch (e) {
        console.error(e);
    }
}

main();
```

```jsx
// tools/sheet_downloader.js
const fs = require('fs');
const path = require('path');

class SheetDownloader {
    constructor(apiClient) { // 1
        this.apiClient = apiClient;
    }

    /**
     * 명시한 스프레드시트의 시트 내용을 읽어 JSON 객체로 변환해준다.
     * @param spreadsheetId 스프레드시트 ID
     * @param sheetName 시트 이름
     * @param filePath 저장할 JSON 파일 생략 시 파일로 저장하지 않음
     */
    async downloadToJson(spreadsheetId, sheetName, filePath = null) { // 2
        // 3. 명시한 시트의 내용을 가져온다.
        const res = await this.apiClient.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });

        // 행 데이터(배열)을 얻어온다.
        const rows = res.data.values;

        // 행이 0개라면, 즉 시트에 아무런 데이터가 없다면 빈 JSON 객체를 반환한다.
        if (rows.length === 0) {
            const message = 'No data found on the sheet';
            console.error(message);
            return {};
        }

        // 4. 행 데이터(배열)를 객체로 반환한다.
        const object = this._rowsToObject(rows);

        // 5. filePath를 명시했다면 지정한 파일로 저장
        if (filePath) {
            // 마지막 인수는 space 의미.
            // 이곳에 2를 넣으면 출력되는 JSON 문자열에 2칸 들여쓰기와 줄바꿈이 적용되어 보기 편해진다.
            const jsonText = JSON.stringify(object, null, 2);

            const directory = path.dirname(filePath);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            fs.writeFileSync(filePath, jsonText);
            console.log(`Written to ${filePath}`);
        }
        return object;
    }

    _rowsToObject(rows) {
        ...생략...
    }
}

module.exports = SheetDownloader;
```

1. 생성자에 apiClient 객체를 받고 있다. 여기에는 앞 절에서 작성한 코드의 SheetApiClientFactory.create()를 호출하여 구글 시트 API 클라이언트 객체를 넣어주면 된다.
2. downloadToJson() 함수를 살펴보면 앞에서 설명했던대로
3. 스프레드시트 아이디와 시트명을 입력받아 해당 시트를 읽어들인 후,
4. 내부 함수인 _rowsToObject()를 호출하여 2차원 배열을 키값 형태의 객체로 변환한다. 
5. 변환된 객체는 filePath가 지정된 경우 JSON 형태로 직렬화해서 파일로 저장한다. 
    
    → 이렇게 파일로 저장해두면, 나중에 읽어들여 사용할 수 있다.
    

### _rowsToObject()

```jsx
/**
     * 주어진 배열을 JSON 객체로 변환해준다.
     * @params rows 변환할 2차원 배열
     */
    _rowsToObject(rows) {
        const headerRow = rows.slice(0, 1)[0]; // 1
        const dataRows = rows.slice(1, rows.length); // 2

        return dataRows.map(row => {
            const item = {};
            for (let i = 0; i < headerRow.length; i++) { // 열(제목) 수만큼 반복
                const fieldName = headerRow[i]; // 키 (열 제목)
                const fieldValue = row[i]; // 값 (내용)
                item[fieldName] = fieldValue;
            }
            return item;
        });
    }
```

### 실제 데이터 적용

> 위에 작성한 `SheetApiClientFactory` 클래스와 `SheetDownloader` 클래스를 이용하여 앞서 계속 사용하던 **‘코로나보드 데이터 예제’** 스프레드시트로부터 공지사항 데이터가 들어있는 `notice` 시트와 전 세계 국가 정보가 들어 있는 `countryInfo` 시트에서 데이터를 내려받아 json 파일로 저장하고, 생성된 객체를 콘솔로 출력하는 코드 작성하기.
> 

```jsx
// tools/main.js
const SheetApiClientFactory = require('./sheet_api_client_factory.js');
const SheetDownloader = require('./sheet_downloader.js');

async function main() {
    try {
        const sheetApiClient = await SheetApiClientFactory.create();
        const downloader = new SheetDownloader(sheetApiClient);

        // '코로나보드 데이터 예제' 스프레드시트의 실제 ID 값
        const spreadsheetId = '1z2d4gBO8JSI8SEotnHDKdcq8EQ9X4O5fWPxeUCAqW1c';

        // 공지 내려받기
        const notice = await downloader.downloadToJson(
            spreadsheetId,
            'notice',
            'downloaded/notice.json',
        );

        console.log(notice);

        // 국가 정보 내려받기
        const countryInfo = await downloader.downloadToJson(
            spreadsheetId,
            'countryInfo',
            'downloaded/countryInfo.json',
        );

        console.log(countryInfo);
    } catch (e) {
        console.error(e);
    }
}

main();
```

![image](https://user-images.githubusercontent.com/73332608/173293484-efc48e03-0648-4d42-ab0c-118a41cae173.png)
