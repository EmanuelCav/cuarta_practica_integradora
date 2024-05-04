import { Router } from 'express';
import passport from 'passport';

import { users, register, login, forgotPassword, recoverPassword, updatePremium, uploadDocument } from'../controller/users.ctrl.js';

import { auth, emailAuth, admin } from'../middleware/auth.js';

import { UserDTO } from '../dto/user.dto.js';

import { documents } from '../lib/images.js';

const router = Router()

router.get('/api/users', users)

router.post('/register', register)
router.post('/login', login)

router.get('/api/users/premium/:id', [auth, admin], updatePremium)

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/products');
  });

router.get('/api/sesions/current', auth, passport.authenticate("current"), (req, res) => {
  return res.json(new UserDTO(req.user))
})

router.post('/api/users', forgotPassword)
router.post('/api/users/:uid/documents', auth, documents.array("files", 3), uploadDocument)

router.put('/api/users/:email', emailAuth, recoverPassword)

export default router
