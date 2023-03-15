## express
자유도가 높음

-server
1 web server
response body에 웹페이지를 담아서 보내줌(화면을 그리는데 필요)
2 **API server**
response body에 요청을 처리한 결과를 담아서 보내줌(최근엔 보통 JSON 사용)

### API server
express 사용
```
npm install express
```
`app.js`
```js
const  express  =  require('express');

const  app  =  express(); // 관습적으로 app이라고 함

app.get('/hello', (req, res) => {
  res.send('<h1>Hello!!</h1>');
}); // 이때 콜백함수를 '라우트 핸들러'라고 칭하기도 함

app.listen(5000, () => {
  console.log('server is listening...');
}); // 리퀘스트를 기다림 서버 상태를 확인하기 위해 console 메세지를 적어두는 것이 보통
```
-(req, res)
req : 클라이언트가 보낸 리퀘스트를 핸들링
res : 리스폰스를 보낼 수 있음

-활용
```js
const express = require('express');

const app = express();

let members = require('./members');

app.get('/api/members', (req, res) => {
  res.send(members);
});

app.get('/api/members/:id', (req, res) => {
  // const id = req.params.id;
  const { id } = req.params; // url에서 정보 꺼내 쓸 때 req.params 사용 이때 id는 string
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
	  res.status(404).send({ "message":  'There is no such employee'}); // 상태코드 지정하고 메세지 출력 이때 메세지도 json 형식으로 보내주는 것이 일반적
  }
 
}); 

app.listen(5000, () => {
  console.log('server is listening...');
});
```
-쿼리 사용
쿼리는 서버에 있는 데이터를 조회할 때 기준으로 사용하는 경우가 많음
```js
const express = require('express');

const app = express();

let members = require('./members');

app.get('/api/members', (req, res) => {
  const { team } = req.query;
  if (team) {
    const teammembers = members.filter((m) => m.team === team); // filter 메소드로 검색기능 구현
    res.send(teammembers);
  } else {
    res.send(members); // 다른 파라미터가 들어올 경우 전체 직원 출력
  }
});

app.listen(5000, () => {
  console.log('server is listening...');
});
```

#### app.get
조회

#### app.post
등록
vscode 확장 프로그램중에 REST Client 활용
`test.http` 리퀘스트를 보내볼 수 있음
```
GET http://localhost:5000/api/members

###
POST http://localhost:5000/api/members
Content-Type:application/json

{
  "id": 11,
  "name": "dooly",
  "team": "engineering",
  "position": "Server Developer",
  "emailAddress": "benjamin@google.com",
  "phoneNumber": "010-xxxx-xxxx",
  "admissionDate": "2021/01/20",
  "birthday": "1992/03/26",
  "profileImage": "profile2.png",  
}
```
`app.js`
```js
const express = require('express');

const app = express();

let members = require('./members');

app.use(express.json()); // 리퀘스트 body에 JSON 데이터가 있을 때 그것을 req 객체의 body 프로퍼티에 설정. 전처리를 하는 middleware

app.get('/api/members', (req, res) => {
  const { team } = req.query;
  if (team) {
    const teammembers = members.filter((m) => m.team === team);
    res.send(teammembers);
  } else {
    res.send(members);
  }
});

app.get('/api/members/:id', (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such employee' });
  }
});

app.post('/api/members', (req, res) => {
  const newMember = req.body; // body를 newMember로 받아서
  members.push(newMember); // members 배열에 추가
  res.send(newMember); // 추가한 객체를 res에 반환
});

app.listen(5000, () => {
  console.log('server is listening...');
});

```


cf)
`package.json`
```
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
 }
```
여기서 npm 명령어를 설정할 수 있음 기본적으로 npm run (명령어)로 수행 (start처럼 미리 정의 된 명령어는 run생략 가능)

#### app.put
수정
```js
...
app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = members.find((m) => m.id === Number(id));
  if(member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    }); // id로 조회되는 member가 있을 때 해당 객체의 모든 프로퍼티의 값을 수정함
    res.send(member);
  }else {
    res.status(404).send({ message: 'There is no such employee' })
  }
});
...
```
Object.keys : 특정 객체의 모든 프로퍼티를 조회
Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    }); : newInfo의 모든 프로퍼티를 조회하고 member객체에서 일치하는 프로퍼티의 값에 대입
 `test.http`
 ```
PUT http://localhost:5000/api/members/2
Content-Type:application/json

{
  "id": 2,
  "phoneNumber": "010-xxxx-0000"
}
 ```

**특정객체의 모든 프로퍼티 조회**
```js
const newInfo = {
  id: 11,
  name: 'William',
  team: 'Engineering',
  position: 'Android Developer',
  emailAddress: 'zake@google.com',
  phoneNumber: '010-xxxx-xxxx',
  admissionDate: '2021/06/12',
  birthday: '1995/09/27',
  profileImage: 'profile11.png',
};
```
1.Object.keys
각 프로퍼티의 이름들이 하나의 배열에 담긴다
```js
console.log(Object.keys(newInfo));
```
[
  'id',
  'name',
  'team',
  'position',
  'emailAddress',
  'phoneNumber',
  'admissionDate',
  'birthday',
  'profileImage'
]
2.Object.entries
[프로퍼티 이름, 프로퍼티의 값] 배열들이 담긴 하나의 배열이 리턴
```js
console.log(Object.entries(newInfo));
```
[
  [ 'id', 11 ],
  [ 'name', 'William' ],
  [ 'team', 'Engineering' ],
  [ 'position', 'Android Developer' ],
  [ 'emailAddress', 'zake@google.com' ],
  [ 'phoneNumber', '010-xxxx-xxxx' ],
  [ 'admissionDate', '2021/06/12' ],
  [ 'birthday', '1995/09/27' ],
  [ 'profileImage', 'profile11.png' ]
]
3. for ... in 구문
```js
for (const property in newInfo) {
  console.log(property);
}
```
id
name
team
position
emailAddress
phoneNumber
admissionDate
birthday
profileImage

```js
for (const property in newInfo) {
  console.log(`Key: ${property} => Value: ${newInfo[property]}`);
}
```
Key: id => Value: 11
Key: name => Value: William
Key: team => Value: Engineering
Key: position => Value: Android Developer
Key: emailAddress => Value: zake@google.com
Key: phoneNumber => Value: 010-xxxx-xxxx
Key: admissionDate => Value: 2021/06/12
Key: birthday => Value: 1995/09/27
Key: profileImage => Value: profile11.png

#### app.delete
삭제
```js
...
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id !== Number(id)); // id와 일치하지 않는 정보만 가지고 배열을 새로 만들고 그 배열을 직원 정보로 설정
  if (members.length < membersCount) {
    res.send({ message: 'Deleted' });
  } else {
    res.status(404).send({ message: 'There is no such employee' });
  }
});
...
```

 `test.http`
 ```
DELETE http://localhost:5000/api/members/2 
 ```
body 필요없음
