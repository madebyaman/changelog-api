import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct
} from './handlers/product';
import {
  createUpdate,
  deleteUpdate,
  editUpdate,
  getAllUpdates,
  getOneUpdate
} from './handlers/update';
import {
  checkIfProductBelongsToUser,
  handleInputErrors
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
  checkIfProductBelongsToUser,
  editUpdate
);
router.post(
  '/update',
  body('title').exists().isString(),
  body('body').exists().isString(),
  body('productId').exists().isString(),
  createUpdate
);
router.delete('/update/:id', checkIfProductBelongsToUser, deleteUpdate);

/**
 * Update Points
 */
router.get('/updatepoint', () => {});
router.get('/updatepoint/:id', () => {});
router.put(
  '/updatepoint/:id',
  body('name').optional().isString,
  body('description').optional().isString(),
  () => {}
);
router.post(
  '/updatepoint',
  body('name').isString,
  body('description').isString(),
  () => {}
);
router.delete('/updatepoint/:id', () => {});

export default router;
