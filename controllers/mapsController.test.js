// Mocking required modules
jest.mock('express-validator', () => ({
	validationResult: jest.fn(),
}));
  
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const {
	index,
	filter,
	insert,
	update,
	delete: deleteMap,
} = require('./mapsController');
const Map = require('../models/map');

// Testing index function
describe('Index Function Tests', () => {
	describe('Unit Tests', () => {
		it('should return all maps data', async () => {
      // Mocking Map.findAll to return mockMaps
			const mockMaps = [{ id: 1, location_name: 'Test Location' }];
			Map.findAll = jest.fn().mockResolvedValue(mockMaps);

			const req = {};
			const res = {
        status: jest.fn().mockReturnThis(), // Mocking status method
        json: jest.fn(), // Mocking json method
			};

			await index(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ data: mockMaps });
		});

		it('should handle errors', async () => {
      // Mocking Map.findAll to throw an error
			const errorMessage = 'Test Error';
			Map.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await index(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: { message: errorMessage } });
		});
	});

  // Testing integration with the database
	describe('Integration Tests', () => {
		it('should return all maps data from the database', async () => {
			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			const mockMaps = [{ id: 1, location_name: 'Test Location' }];
      Map.findAll = jest.fn().mockResolvedValue(mockMaps); // Mocking Map.findAll

			await index(req, res);

      // Expect Map.findAll to be called and res.status and res.json to be called with correct arguments
			expect(Map.findAll).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ data: mockMaps });
		});
	});
});

// Testing filter function
describe('Filter Function Tests', () => {
	describe('Unit Tests', () => {
		it('should return filtered maps data', async () => {
      // Mocking Map.findAll to return mockFilteredMaps
			const mockFilteredMaps = [{ id: 1, location_name: 'Filtered Location' }];
			Map.findAll = jest.fn().mockResolvedValue(mockFilteredMaps);

			const req = { body: { location_name: 'Filtered' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			await filter(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ data: mockFilteredMaps });
		});

		it('should handle validation errors', async () => {
			const errorMessage = 'Validation Error';
			const req = { body: { location_name: 'Filtered' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return validation errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue(errorMessage) });

			await filter(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: { message: 'validation error', validation: errorMessage } });
		});
	});

  // Testing integration with the database
	describe('Integration Tests', () => {
		it('should return filtered maps data from the database', async () => {
			const req = { body: { location_name: 'Filtered' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			const mockFilteredMaps = [{ id: 1, location_name: 'Filtered Location' }];
      Map.findAll = jest.fn().mockResolvedValue(mockFilteredMaps); // Mocking Map.findAll

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			await filter(req, res);

      // Expect Map.findAll to be called and res.status and res.json to be called with correct arguments
			expect(Map.findAll).toHaveBeenCalledWith({ where: { location_name: { [Op.like]: '%Filtered%' } } });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ data: mockFilteredMaps });
		});
	});
});

// Testing insert function
describe('Insert Function Tests', () => {
	describe('Unit Tests', () => {
		it('should insert new map data', async () => {
			const req = { body: { location_name: 'New Location', lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			const saveMock = jest.fn().mockResolvedValue();
			jest.spyOn(Map.prototype, 'save').mockImplementation(saveMock);

			await insert(req, res);

      // Expect saveMock to be called and res.status and res.json to be called with correct arguments
			expect(saveMock).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'Insert successfully.' });
		});

		it('should handle validation errors', async () => {
			const errorMessage = 'Validation Error';
			const req = { body: { location_name: 'New Location', lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return validation errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue(errorMessage) });

			await insert(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: { message: 'validation error', validation: errorMessage } });
		});
	});

  // Testing integration with the database
	describe('Integration Tests', () => {
		it('should insert new map data into the database', async () => {
			const req = { body: { location_name: 'New Location', lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			const saveMock = jest.fn().mockResolvedValue();
			jest.spyOn(Map.prototype, 'save').mockImplementation(saveMock);

			await insert(req, res);

      // Expect saveMock to be called
			expect(saveMock).toHaveBeenCalled();
		});
	});
});

// Testing update function
describe('Update Function Tests', () => {
	describe('Unit Tests', () => {
		it('should update map data', async () => {
			const req = { body: { location_name: 'Updated Location', lat: 0, lng: 0 }, params: { id: 1 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			const updateMock = jest.fn().mockResolvedValue([1]);
			Map.update = updateMock;

			await update(req, res);

      // Expect updateMock to be called and res.status and res.json to be called with correct arguments
			expect(updateMock).toHaveBeenCalledWith(
				{ location_name: 'Updated Location', lat: 0, lng: 0 },
				{ where: { id: 1 } }
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'Update successfully.' });
		});

		it('should handle validation errors', async () => {
			const errorMessage = 'Validation Error';
			const req = { body: { location_name: 'Updated Location', lat: 0, lng: 0 }, params: { id: 1 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return validation errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue(errorMessage) });

			await update(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: { message: 'validation error1111', validation: errorMessage } });
		});
	});

  // Testing integration with the database
	describe('Integration Tests', () => {
		it('should update map data in the database', async () => {
			const req = { body: { location_name: 'Updated Location', lat: 0, lng: 0 }, params: { id: 1 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

      // Mocking validationResult to return empty errors
			validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });

			const updateMock = jest.fn().mockResolvedValue([1]);
			Map.update = updateMock;

			await update(req, res);

      // Expect updateMock to be called
			expect(updateMock).toHaveBeenCalledWith(
				{ location_name: 'Updated Location', lat: 0, lng: 0 },
				{ where: { id: 1 } }
			);
		});
	});
});

// Testing delete function
describe('Delete Function Tests', () => {
	describe('Unit Tests', () => {
		it('should delete map data', async () => {
			const mockMap = [{ id: 1, lat: 0, lng: 0 }];
			Map.findAll = jest.fn().mockResolvedValue(mockMap);
			const destroyMock = jest.fn();
			Map.destroy = destroyMock;

			const req = { params: { lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await deleteMap(req, res);

      // Expect Map.findAll and Map.destroy to be called and res.status and res.json to be called with correct arguments
			expect(Map.findAll).toHaveBeenCalledWith({ where: { lat: 0, lng: 0 } });
			expect(destroyMock).toHaveBeenCalledWith({ where: { lat: 0, lng: 0 } });
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'Delete successfully.' });
		});

		it('should handle data not found', async () => {
			Map.findAll = jest.fn().mockResolvedValue([]);
			const req = { params: { lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await deleteMap(req, res);

      // Expect res.status and res.json to be called with correct arguments
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: { message: 'Data not found' } });
		});
	});

  // Testing integration with the database
	describe('Integration Tests', () => {
		it('should delete map data from the database', async () => {
			const req = { params: { lat: 0, lng: 0 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			const mockMap = [{ id: 1, lat: 0, lng: 0 }];
			Map.findAll = jest.fn().mockResolvedValue(mockMap);
			const destroyMock = jest.fn();
			Map.destroy = destroyMock;

			await deleteMap(req, res);

      // Expect Map.findAll and Map.destroy to be called
			expect(Map.findAll).toHaveBeenCalledWith({ where: { lat: 0, lng: 0 } });
			expect(destroyMock).toHaveBeenCalledWith({ where: { lat: 0, lng: 0 } });
		});
	});
});
