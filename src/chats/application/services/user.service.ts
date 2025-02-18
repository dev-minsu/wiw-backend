import {Injectable} from '@nestjs/common';
import {User, UserDocument} from "../../domain/models/user.model";
import {NewUserInput} from "../../domain/dto/new-user.input";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: NewUserInput): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
