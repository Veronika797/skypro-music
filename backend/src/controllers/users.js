import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: 'Ошибка' });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res
      .status(err.name === 'ValidationError' ? 400 : 500)
      .json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user)
      return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: err.message });
  }
};
