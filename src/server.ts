import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { body } from 'express-validator';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';
import { handleInputErrors } from './modules/middleware';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {options} from './swaggerOptions'

const specs = swaggerJsdoc(options)

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.get('/', (req, res) => {
  res.status(200);
  res.json({ message: 'hello' });
});

app.use('/api', protect, router);

app.post(
  '/user',
  body('username').exists().isString(),
  body('password').exists().isString(),
  handleInputErrors,
  createNewUser
);
app.post(
  '/signin',
  body('username').exists().isString(),
  body('password').exists().isString(),
  handleInputErrors,
  signin
);

app.use((err, req, res, next) => {
  if (err.type === 'auth') {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: 'invalid input' });
  } else {
    res.status(500).json({ message: "oops that's on us" });
  }
});

export default app;
