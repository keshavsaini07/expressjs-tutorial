import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },

  salary: {
    type: mongoose.Schema.Types.Number,
  },

  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export const User = mongoose.model('User', UserSchema);