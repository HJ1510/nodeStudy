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

for (const property in newInfo) {
  console.log(`Key: ${property} => Value: ${newInfo[property]}`);
}
