import { Schema, model } from 'mongoose'
import User from '../../../domain/entities/User';

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = model<User>('User', UserSchema)

export default UserModel