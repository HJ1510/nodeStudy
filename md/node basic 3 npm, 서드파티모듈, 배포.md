### 모듈
모듈은 하나의 파일로 구성될수도 있고 하나의 디렉토리로 구성될수도 있음

-서드파티 모듈 (package)
package.json 파일을 가진 디렉토리

#### package.json
```
  "main": "./index", // 패키지를 사용할때 로드할 파일 이름 명시 없으면 index.js를 로드함
  "scripts": {
    "prepare": "rollup -c",
    "test": "tape test/**/*.js | tap-dot"
  }, // 프로젝트에서 자주 사용되는 명령어를 스크립트로 등록
  "engines": {
    "node": ">= 0.10.0"
  }, // 필요한 node 버전 정보
  "dependencies" // 배포시 포함됨
  "devDependencies" // 배포시 불포함(개발환경에서만 사용)
```
-   배포 용도로 필요한 패키지들은 dependencies 필드에,
-   개발 용도로만 필요한 패키지들은 devDependencies 필드에

#### package-lock.json
'실제로' 설치된 패키지들의 정확한 버전들이 기록되어있음
cf) package.json에는 버전이 범위로 기록되어있는 경우 多

-npm init으로 배포를 위한 package.json 작성 가능
```
npm init
```

#### 전역 설치
```
// nodemon: 코드 변경 시 자동으로 재실행
npm install -g nodemon // -g global 전역설치 옵션
```
설치시 권한오류가 뜨면
```
sudo npm install -g nodemon // sudo 관리자권한 그 다음에 비밀번호 적으면 됨
```
nodemon으로 파일을 실행하면 nodemon 기능 사용!
```
nodemon (실행하려는 js파일)
```

```
npm install //package.json 파일에 적혀있던 패키지들을 설치
```
```
npm install --production //devDependencies에 있는 패키지들(개발 용도로만 필요하고 배포 용도로는 필요하지 않은 패키지들)은 제외하고 dependencies에 있는 패키지들만 node_modules 디렉토리에 설치
NODE_ENV=production npm install
```

사실 프로젝트의 코드를 배포 용도로 실행하기 전에는 보통 이런 순서의 작업을 거칩니다.

(1) 실제 개발 중이던 프로젝트 디렉토리를 하나 더 복사 
(2) 새 디렉토리에서 node_modules 디렉토리 삭제 
(3) **npm install --production**를 실행해서 devDependencies 필드에 있던 패키지들은 제외하고, dependencies 필드에 있던 패키지들만 node_modules 디렉토리에 재설치 
(4) 실제 서비스를 위해 코드 실행(**npm start** 등 실행)
