import { type User } from '../models/User';
import userModel from '../models/userModel.js';

export default class UserRepository {
  async add(user: User) {
    return await userModel.create(user);
  }

  async findById(id: string) {
    return await userModel.findById(id);
  }

  async find(name: string, login: boolean = false) {
    return login === true
      ? await userModel.findOne({ name: name }).select('+password')
      : await userModel.findOne({ name: name });
  }

  async list() {
    return await userModel.find();
  }

  async deleteById(id: string) {
    return await userModel.findByIdAndDelete(id);
  }
}
