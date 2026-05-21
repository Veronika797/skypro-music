import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  username: {
    type: String,
    required: true,
    maxlength: 5,
    minlength: 2,
    unique: true,
  },
});

export default mongoose.model('User', userSchema);
