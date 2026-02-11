const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async register({ name, email, password, phone, address }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw { status: 400, message: 'Email already registered' };
    }
    const user = await User.create({ name, email, password, phone, address });
    const token = this.generateToken(user);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    if (!user.password) {
      throw { status: 401, message: 'Please login with Google' };
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    const token = this.generateToken(user);
    return { user, token };
  }

  async googleAuth({ google_id, email, name, avatar }) {
    let user = await User.findOne({ where: { google_id } });
    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        user.google_id = google_id;
        if (avatar) user.avatar = avatar;
        await user.save();
      } else {
        user = await User.create({ name, email, google_id, avatar, role: 'customer' });
      }
    }
    const token = this.generateToken(user);
    return { user, token };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'User not found' };
    const { name, phone, address, avatar } = data;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;
    await user.save();
    return user;
  }
}

module.exports = new AuthService();
