const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController');
const verifyAccessToken = require('../app/middlewares/verifyToken')

router.get('/users/search', userController.searchUsers);
router.get('/users/advanced-search', userController.advancedSearchUsers);
router.post('/users/create', userController.createUser); // Create a new user
router.get('/users', userController.getAllUsers); // Get all users
router.get('/users/:id', userController.getUserById); // Get a single user by ID
router.put('/users/update/:id', userController.updateUser); // Update a user
router.delete('/users/delete/:id', userController.deleteUser); // Delete a user

module.exports = router;