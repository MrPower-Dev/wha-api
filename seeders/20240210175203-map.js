'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Maps', [{
      location_name: 'WHA Corporation PCL.',
      lat: '13.6518526',
      lng: '100.6697272'
    },{
      location_name: 'เมกา บางนา',
      lat: '13.651034',
      lng: '100.6577282'
    },{
      location_name: 'โรงพยาบาลพริ้นซ์ สุวรรณภูมิ',
      lat: '13.651034',
      lng: '100.6577282'
    }]);
  },
  
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Maps', null, {});
  }
};
