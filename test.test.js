const { register } = require('./controllers/authControle'); 
const User = require('./models/Users');
const Role = require('./models/Roles');

describe('register', () => {
    it('should return a validation error for missing fields', async () => {
        const req = {
            body: {
                username: 'user',
                email: 'user@gmail.com',
                password: 'test',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Veuillez remplir tous les champs.');
    });

    it('should return a user exists error', async () => {
      const req = {
        body: {
          username: 'user',
          email: 'user@gmail.com',
          password: 'test',
          role: 'client',
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };
  
      User.findOne = jest.fn().mockResolvedValue({}); 
  
      await register(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should create a new user', async () => {
        const req = {
            body: {
                username: 'user',
                email: 'user@gmail.com',
                password: 'test',
                role: 'client',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        User.findOne = jest.fn().mockResolvedValue(null);
        Role.findOne = jest.fn().mockResolvedValue({ name: 'client', _id: 'role_id' });
        User.prototype.save = jest.fn();

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'user enregistred, check your email for configuration' });

        expect(User.prototype.save).toHaveBeenCalled();
    });
});
