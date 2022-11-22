import { User } from '@prisma/client';
import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';

export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};

export const signin = async (req, res, next) => {
  let user: User | undefined;
  let isPasswordValid: boolean | undefined;
  try {
    user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    isPasswordValid = await comparePasswords(req.body.password, user.password);
  } catch (e) {
    // Not catching errors due to server crashing
    e.type = 'input';
    next(e);
  }

  if (!isPasswordValid) {
    res.status(401);
    res.json({ message: 'Unauthorized' });
  }
  const token = createJWT(user);
  res.json({ token });
};
