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

console.log(Object.keys(newInfo));

console.log(Object.entries(newInfo));

for (const property in newInfo) {
  console.log(property);
}

for (const property in newInfo) {
  console.log(`Key: ${property} => Value: ${newInfo[property]}`);
}
