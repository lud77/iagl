import express from 'express';

const app = express();
const port = process.env.API_PORT;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
