import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  _id: any;
  name: string;
  role: 'customer' | 'admin' | 'volunteer' | 'supplier' | 'delivery';
  memberSince: Date;
  password: string;
  checkPassword(
    passwordToCheck: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'volunteer', 'supplier', 'delivery'],
    default: 'customer',
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 3, // should be longer but im lazy
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  passwordToCheck: string,
  userPassword: string
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

export default mongoose.model<IUser>('User', userSchema);
