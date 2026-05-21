import Book from '../models/Book.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    res.json(book);
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: 'Ошибка' });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res
      .status(err.name === 'ValidationError' ? 400 : 500)
      .json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    res.json(book);
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книга не найдена' });
    res.json({ message: 'Книга удалена' });
  } catch (err) {
    res
      .status(err.name === 'CastError' ? 404 : 500)
      .json({ message: err.message });
  }
};
