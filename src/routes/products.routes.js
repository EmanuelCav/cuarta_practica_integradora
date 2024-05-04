import { Router } from 'express';

import { upload } from '../lib/images.js';

import { products, productGet, productCreate, productUpdate, productDelete } from '../controller/products.ctrl.js';
import { auth, admin, premium } from '../middleware/auth.js';

const router = Router()

router.get('/api/products', auth, products)
router.get('/api/products/:pid', auth, productGet)

router.post('/api/products', [auth, premium, admin], upload.array("files", 10), productCreate)

router.put('/api/products/:pid', [auth, admin], productUpdate)

router.delete('/api/products/:pid', [auth, premium, admin], productDelete)

export default router


