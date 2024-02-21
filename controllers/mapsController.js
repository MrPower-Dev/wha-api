const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Map = require('../models/map');

exports.index = async (req, res, next) => {
    try {
        // select all data from maps table
        const maps = await Map.findAll();

        // response all data from maps table
        res.status(200).json({
            data: maps
        });

    } catch (error) {
        // response error
        res.status(500).json({
            error: {
                message: error.message
            }
        });
    }
}

exports.filter = async (req, res, next) => {
    try {
        // get request body
        const { location_name } = req.body;
        
        // validation result from routes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // set error message
            const error = new Error('validation error')
            error.validation = errors.array();
            throw error;
        }

        // select data from maps table where location_name like '%location_name%'
        const map = await Map.findAll({ where: { location_name: {
            [Op.like]: '%'+location_name+'%',
          } } });
        
        // response data filter
        res.status(200).json({
            data: map
        });
    } catch (error) {
        // response error
        res.status(400).json({ 
            error: {
                message: error.message,
                validation: error.validation ?? ''
            }
        });
    }
}

exports.insert = async (req, res, next) => {
    try {
        // get request body
        const { location_name, lat, lng } = req.body;
        
        // validation result from routes
        const errors = validationResult(req);
        // set error message
        if (!errors.isEmpty()) {
            const error = new Error('validation error')
            error.validation = errors.array();
            throw error;
        }

        // add value from request body to model Map
        let map = new Map();
        map.location_name = location_name;
        map.lat = lat;
        map.lng = lng;

        // insert value into database
        await map.save();

        // response message successfully
        res.status(200).json({ 
            message: 'Insert successfully.'
        });
        
    } catch (error) {
        // response error
        res.status(400).json({ 
            error: {
                message: error.message,
                validation: error.validation ?? ''
            }
        });
    }
}

exports.update = async (req, res, next) => {
    try {
        // get request body
        const { location_name, lat, lng } = req.body;
        const id = parseInt(req.params.id);
        
        // validation result from routes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // set error message
            const error = new Error('validation error1111')
            error.validation = errors.array();
            throw error;
        }

        // update value to database
        await Map.update({
            location_name: location_name,
            lat: lat,
            lng: lng,
        }, {
            where: {
              id: id,
            },
        });

        // response message successfully
        res.status(200).json({ 
            message: 'Update successfully.'
        });

    } catch (error) {
        // response error
        res.status(400).json({ 
            error: {
                message: error.message,
                validation: error.validation ?? ''
            }
        });
    }
}

exports.delete = async (req, res, next) => {
    try {
        // check data from id request params
        const map = await Map.findAll({ where: { lat: req.params.lat, lng: req.params.lng} } );
        if (map.length === 0) {
            // set error message
            throw new Error('Data not found');
        }

        // delete row from map table
        Map.destroy({
            where: {
                lat: req.params.lat, 
                lng: req.params.lng
            }
        })

        // response message successfully
        res.status(200).json({ message: 'Delete successfully.' });

    } catch (error) {
        // response error
        res.status(400).json({ 
            error: {
                message: error.message
            }
        });
    }
}
