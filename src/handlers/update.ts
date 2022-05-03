import prisma from '../db';

// Get all updates
export const getAllUpdates = async (req, res) => {
  const updates = await prisma.update.findMany({
    where: {
      productId: req.body.productId,
    },
  });

  res.json({ data: updates });
};

// Get one update
export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!update) {
    return res.json({ message: 'Nothing to get' });
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

  res.json({ data: update });
};

// Edit an update
export const editUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (product) {
    if (product.belongsToId !== req.user.id) {
      return res.statusCode(401).json({ message: 'no' });
    } else {
      const update = await prisma.update.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

      res.json({ data: update });
    }
  } else {
    return res.json({ message: 'no' });
  }
};

// Create new update
export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (product) {
    if (product.belongsToId !== req.user.id) {
      return res.statusCode(401).json({ message: 'no' });
    } else {
      const update = await prisma.update.create({
        data: req.body,
      });

      return res.json({ data: update });
    }
  } else {
    return res.json({ message: 'no' });
  }
};

// Delete an update
export const deleteUpdate = async (req, res) => {
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!update) {
    return res.json({ message: 'Nothing to delete' });
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

  const deletedUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  return res.json({ data: deletedUpdate });
};
