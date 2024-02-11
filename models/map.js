const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Map = sequelize.define('Map', {
  // Define attributes of the maps table
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
  },
  location_name: {
    type: DataTypes.STRING, allowNull: false,
  },
  lat: {
    type: DataTypes.STRING, allowNull: false,
  },
  lng: {
    type: DataTypes.STRING, allowNull: false,
  },
}, {
  timestamps: false, // Disable timestamps
});

module.exports = Map;
