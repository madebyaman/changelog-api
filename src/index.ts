import dotenv from 'dotenv';
import app from './server';
dotenv.config();
import config from './config';

app.listen(config.port, () => {
  console.log(`server started on http://localhost:${config.port}`);
});
