const express = require('express');

const app = express();

let members = require('./members');

app.use(express.json());

// app.use((req, res, next) => {
//   console.log(req.query);
//   next();
// });

app.get('/api/members', (req, res) => {
  const { team } = req.query;
  if (team) {
    const teammembers = members.filter((m) => m.team === team);
    res.send(teammembers);
  } else {
    res.send(members);
  }
});

// app.get('/api/members', async (req, res) => {
//   const { team } = req.query;
//   if (team) {
//     const teamMembers = await Member.findAll({ where: { team } });
//     res.send(teamMembers);
//   } else {
//     const members = await Member.findAll();
//     res.send(members);
//   }
// });

app.get('/api/members/:id', (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id === Number(id));
  if (members.length < membersCount) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such employee' });
  }
});

app.post('/api/members', (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such employee' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id !== Number(id));
  if (members.length < membersCount) {
    res.send({ message: 'Deleted' });
  } else {
    res.status(404).send({ message: 'There is no such employee' });
  }
});

app.listen(5000, () => {
  console.log('server is listening...');
});
