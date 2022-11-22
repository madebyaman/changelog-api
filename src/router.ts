import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from './handlers/product';
import {
  createUpdate,
  deleteUpdate,
  editUpdate,
  getAllUpdates,
  getOneUpdate,
} from './handlers/update';
import {
  checkIfProductBelongsToUser,
  handleInputErrors,
} from './modules/middleware';

const router = Router();

/**
 * Product
 */
router.get('/product', getProducts);
router.get('/product/:id', getOneProduct);
router.put(
  '/product/:id',
  body('name').isString(),
  handleInputErrors,
  updateProduct
);
router.post(
  '/product',
  body('name').isString(),
  handleInputErrors,
  createProduct
);
router.delete('/product/:id', deleteProduct);

/**
 * Update
 */
router.get(
  '/update',
  body('productId').exists().isString(),
  handleInputErrors,
  getAllUpdates
);
router.get('/update/:id', checkIfProductBelongsToUser, getOneUpdate);
router.put(
  '/update/:id',
  body('title').optional(),
  body('body').optional(),
  body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRACATED']).optional(),
  body('version').optional(),
  handleInputErrors,
  checkIfProductBelongsToUser,
  editUpdate
);
router.post(
  '/update',
  body('title').exists().isString(),
  body('body').exists().isString(),
  body('productId').exists().isString(),
  handleInputErrors,
  createUpdate
);
router.delete('/update/:id', checkIfProductBelongsToUser, deleteUpdate);

// Error handling
router.use((err, req, res, next) => {
  if (err.type === 'auth') {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: 'invalid input' });
  } else {
    res.status(500).json({ message: "oops that's on us" });
  }
});

export default router;
