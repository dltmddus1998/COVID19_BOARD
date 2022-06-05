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

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b46e7029-3e70-42f8-9483-9bacab733283/Untitled.png)

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

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0ceae9bf-5951-4267-a871-4c05fe3a0efa/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d068d673-f948-48f7-b51a-6f0bee7df655/Untitled.png)

## 5) 데이터베이스 준비하기

### 1. 코로나보드용 데이터베이스와 계정 만들기

1. 데이터베이스 생성
    
    `create database coronaboard;`
    
2. 계정 생성
    
    `create user 'coronaboard_admin'@'%' identified by '비밀번호';`
    
3. 권한 부여
    
    `grant create, alter, drop, index, insert, select, update, delete, lock tables on coronaboard.* to 'coronaboard_admin'@'%';`
    

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/23af4feb-9d09-48cf-8e7c-272ec99724e0/Untitled.png)

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

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2e76b137-c525-44a7-9fd1-1fb530275aae/Untitled.png)

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

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d3a05cda-9bfb-4e57-be61-a2ee49a6b886/Untitled.png)