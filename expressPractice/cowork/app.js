const express = require('express');

const app = express();

let members = require('./members');

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

app.listen(5000, () => {
  console.log('server is listening...');
});
