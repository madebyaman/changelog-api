import { validationResult } from 'express-validator';
import prisma from '../db';

export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
  } else {
    next();
  }
};

export const checkIfProductBelongsToUser = async (req, res, next) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!update) {
    return res.json({ message: 'Unauthorized' });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: update.productId,
      belongsToId: req.user.id,
    },
  });

  if (!product) {
    return res.json({ message: "Product doesn't belong to user" });
  }

  next();
};
