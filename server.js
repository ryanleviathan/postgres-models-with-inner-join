const app = require('./lib/app');

const PORT = process.env.PORT || 7880;

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

