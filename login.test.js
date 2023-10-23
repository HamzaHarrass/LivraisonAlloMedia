const { LoginUser } = require('./controllers/authControle');
const User = require('./models/Users');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('./models/Users');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('LoginUser', () => {
    
  it('should return the user does not exist', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'test',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await LoginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });

  it('should return the password is incorrect', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'incorrectpassword',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      email: 'test@example.com',
      password: 'correctpassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcryptjs.compare.mockResolvedValue(false);

    await LoginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });

  it('should return the login is successful', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'correctpassword',
      },
    };
    const res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      password: 'correctpassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    await LoginUser(req, res);

    expect(res.cookie).toHaveBeenCalledWith('toKen', 'token', { httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'token' });
  });
});
