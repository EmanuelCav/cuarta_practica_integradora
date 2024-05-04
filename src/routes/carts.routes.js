import { Router } from 'express';

import { createCart, getCart, addProductCart, removeProductCart, quantityProductCart, removeAllProducts, purchaseCart } from '../controller/carts.ctrl.js';
import { auth } from '../middleware/auth.js';

const router = Router()

router.post('/api/carts', auth, createCart)

router.get('/api/carts/:cid', auth, getCart)

router.patch('/api/carts/:cid/products/:pid', auth, addProductCart)

router.delete('/api/carts/:cid/products/:pid', auth, removeProductCart)
router.delete('/api/carts/:cid', auth, removeAllProducts)

router.put('/api/carts/:cid/products/:pid', auth, quantityProductCart)

router.patch('/:cid/purchase', auth, purchaseCart)

export default router