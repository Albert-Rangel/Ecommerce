
import mongoose from 'mongoose';
import date from 'date-and-time';
const now = new Date();

const UserPasswordCollection = 'usersPassword';

const userPasswordSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String
  },
  token: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  timestamp:{
    type: Number,
}, 
});

const userPasswordModel = mongoose.model(UserPasswordCollection, userPasswordSchema);

export { userPasswordModel };