const { register } = require('./controllers/authControle');
const User = require('./models/Users'); 
const Role = require('./models/Roles'); 
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const {sendEmail} = require('./config/nodeMailerConfig');

jest.mock('./models/Users'); 
jest.mock('./models/Roles'); 
jest.mock('bcryptjs'); 
jest.mock('jsonwebtoken'); 
jest.mock('./config/nodeMailerConfig');

describe('register', () => {
  
  it('should return a message that all fields are required', async () => {
    const req = {
      body: {
        username: '',
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Veuillez remplir tous les champs.");
  });


  it('should return a user already exist', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue({});


    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });
 
  it('should return a message invalid role', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid role',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);


    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'invalid role' });
  });


  it('should return a success response when registering a new user', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    bcryptjs.hash.mockResolvedValue('hashedPassword');

    Role.findOne.mockResolvedValue({ _id: 'roleId' });

    jwt.sign.mockReturnValue('token');

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'user enregistred, check your email for configuration' });
  });

});