import { validationResult } from 'express-validator';
import prisma from '../db';

export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
  } else {
    next();
  }
};

export const checkIfProductBelongsToUser = async (req, res, next) => {
  try {
    const update = await prisma.update.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!update) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    const product = await prisma.product.findUnique({
      where: {
        id_belongsToId: {
          id: update.productId,
          belongsToId: req.user.id,
        },
      },
    });

    if (!product) {
      return res
        .status(400)
        .json({ message: "Product doesn't belong to user" });
    }

    next();
  } catch (e) {
    next(e);
  }
};
