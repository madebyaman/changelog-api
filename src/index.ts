import app from './server';
require('dotenv').config();
import config from './config';

app.listen(config.port, () => {
  console.log(`server started on http://localhost:${config.port}`);
});
