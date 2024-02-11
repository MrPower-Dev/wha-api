const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const mapsController = require('../controllers/mapsController');

// route for get all data from maps table
router.get('/', mapsController.index);

// route for filter data from maps table
router.post('/filter', [
    // set validate location_name not empty string
    body('location_name').not().isEmpty().withMessage('Location name is required'),
], mapsController.filter);

// route for insert data to maps table
router.post('/', [
    // set validate not empty string
    body('location_name').not().isEmpty().withMessage('Location name is required'),
    body('lat').not().isEmpty().withMessage('lat is required'),
    body('lng').not().isEmpty().withMessage('lng is required'),
], mapsController.insert);
        
// route for update data to maps table
router.put('/:id', [
    // set validate not empty string
    body('location_name').not().isEmpty().withMessage('Location name is required'),
    body('lat').not().isEmpty().withMessage('lat is required'),
    body('lng').not().isEmpty().withMessage('lng is required'),
], mapsController.update);

// route for delete data to maps table
router.delete('/:id', mapsController.delete);

module.exports = router;
