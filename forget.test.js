const { ForgotPassword } = require('./controllers/authControle');
const User = require('./models/Users');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('./config/nodeMailerConfig');

jest.mock('./models/Users');
jest.mock('jsonwebtoken');
jest.mock('./config/nodeMailerConfig');

describe('ForgotPassword', () => {
  it('should return a message when email is not provided', async () => {
    const req = {
      body: {
        email: '',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ForgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please provide your email address' });
  });

  it('should return a message when user is not found', async () => {
    const req = {
      body: {
        email: 'nonexistent@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await ForgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should send a password reset link and return a success message', async () => {
    const req = {
      body: {
        email: 'test@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      email: 'test@example.com',
    };

    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('token');

    await ForgotPassword(req, res);

    // Ensure that jwt.sign is called with the correct parameters
    expect(jwt.sign).toHaveBeenCalledWith({ email: mockUser.email }, 'AZERTYUIO123456789', { expiresIn: '1h' });

    // Ensure that sendEmail is called with the correct parameters
    expect(sendEmail).toHaveBeenCalledWith({
      from: 'allo media <' + process.env.MAIL_USERNAME + '>',
      to: mockUser.email,
      subject: 'Password Reset',
      html: expect.stringContaining('http://localhost:3000/auth/reset-password?token=token'),
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password reset link sent to your email' });
  });
});
