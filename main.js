// const fs = require("fs");

// let filelist = fs.readdirSync("."); // 디렉토리 안의 항목을 배열로 리턴
// console.log(filelist);

// fs.writeFileSync("new", "Hello!!!!"); // 'new'파는 파일에 두 번째 파라미터의 내용을 적음 'new' 없으면 파일 생성 기존에 있는 파일이면 덮어쓰기
// fs.unlinkSync("./new"); // 'new' 파일 삭제

const os = require("os");

console.log(os.cpus()); // 컴퓨터 정보 출력
