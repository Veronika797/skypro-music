import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db/connection.js';
import User from './src/models/User.js';
import Book from './src/models/Book.js';
import userRouter from './src/routes/users.js';
import bookRouter from './src/routes/books.js';

dotenv.config();

const app = express();
const PORT = 3005;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
  res.send('<h1>SkyPro Books</h1>');
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так', error: err.message });
});

const startServer = async () => {
  try {
    await connectDB();

    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();

    if (userCount === 0) {
      await User.insertMany([
        { firstName: 'Иван', lastName: 'Иванов', username: 'ivan1' },
        { firstName: 'Мария', lastName: 'Петрова', username: 'masha' },
      ]);
    }

    if (bookCount === 0) {
      await Book.insertMany([
        { title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
        { title: '1984', author: 'Джордж Оруэлл', year: 1949 },
      ]);
    }

    app.listen(PORT, '127.0.0.1');
  } catch {
    process.exit(1);
  }
};

startServer();
