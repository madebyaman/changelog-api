import prisma from '../db';

// Get all products
export const getProducts = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });

  res.json({ data: user.products });
};

// Get one product
export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findFirst({
    where: {
      id,
      belongsTo: req.user.id,
    },
  });

  res.json({ data: product });
};

export const createProduct = async (req, res) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      belongsToId: req.user.id,
    },
  });

  res.json({ data: product });
};

export const updateProduct = async (req, res) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
    },
  });

  return res.json({ data: updateProduct });
};

export const deleteProduct = async (req, res) => {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: req.params.id,
      belongsToId: req.user.id,
    },
  });

  return res.json({ data: deleteProduct });
};
