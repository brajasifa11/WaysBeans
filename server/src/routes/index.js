const express = require('express');
const router = express.Router();
const { authentication } = require('../middlewares/authentication');
const { authorizaton } = require('../middlewares/authorizaton');
const { uploadFile } = require('../middlewares/uploadFile');

const { login } = require('../controllers/user-controllers/login');
const { register } = require('../controllers/user-controllers/register');
const { getUser } = require('../controllers/user-controllers/user');
const { addOrder } = require('../controllers/order-controllers/order');
const {
  getProducts,
  getProduct,
  addProduct,
} = require('../controllers/product-controllers/product');
const {
  getTransactions,
  getDetailTransaction,
  editTransaction,
  addTransaction
} = require('../controllers/transaction-controllers/transaction');
const {
  getUserCharts,
  editChart,
  addChart,
  deleteCharts
} = require('../controllers/cart-controllers/cart');

router.post('/login', login);
router.post('/register', register);
router.get('/users/:id', getUser);

router.get('/products', getProducts);
router.get('/product/:id', getProduct);
router.post('/product', authentication, authorizaton, uploadFile('photo'), addProduct);

router.get('/my-cart', authentication, getUserCharts);
router.post('/cart', authentication, addChart);
router.patch('/cart/edit/:id', authentication, editChart);
router.delete('/cart/delete/:id', authentication, deleteCharts);

router.get('/transactions', authentication, authorizaton, getTransactions);
router.get('/my-transaction', authentication, getDetailTransaction);
router.post('/transaction', authentication, uploadFile('attachment'), addTransaction);
router.patch('/transaction/edit/:id', authentication, editTransaction);

router.post('/order', addOrder);

module.exports = router;
