import prisma from '../db';

export const getProducts = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });

    res.json({ data: user.products });
  } catch (e) {
    next(e);
  }
};

// Get one product
export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (product.belongsToId !== req.user.id) {
      return res.status(400).json({ message: 'Bad input' });
    }

    res.json({ data: product });
  } catch (e) {
    console.log(e);
    e.type = 'input';
    next(e);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });

    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

// Update Product
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
      data: {
        name: req.body.name,
      },
    });

    return res.json({ data: updatedProduct });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
    });

    return res.json({ data: deletedProduct });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};
