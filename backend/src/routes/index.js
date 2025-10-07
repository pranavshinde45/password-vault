const express = require('express');
const { signup, login } = require('../controllers/authController');
const { getVault, addItem, updateItem, deleteItem, searchVault } = require('../controllers/vaultController');
const auth = require('../middleware/auth');

const router = express.Router();
// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Vault routes (protected)
router.get('/vault', auth, getVault);
router.post('/vault', auth, addItem);
router.put('/vault/:id', auth, updateItem); // Use :id in params for update
router.delete('/vault/:id', auth, deleteItem);
router.get('/vault/search', auth, searchVault);

module.exports = router;