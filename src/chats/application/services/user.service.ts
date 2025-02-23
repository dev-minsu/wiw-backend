import {Injectable, Logger} from '@nestjs/common';
import {User, UserDocument} from "../../domain/models/user.model";
import {CreateUserInput} from "../../domain/dto/create-user.input";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Args} from "@nestjs/graphql";



const AVATAR_URLS = [
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/01.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/02.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/03.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/04.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/05.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/06.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/07.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/08.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/09.svg',
  'https://despread-labs.s3.ap-northeast-2.amazonaws.com/img/dummy-profile/10.svg',
];

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { address } = createUserInput;

    this.logger.log(`address: ${address}`);

    const existingUser = await this.userModel.findOne({ address }).exec();
    if (existingUser) {
      return existingUser;
    }

    const avatar = AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)];
    const createdUser = new this.userModel({ ...createUserInput, avatar });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async findUserByAddress(address: string): Promise<User | null> {
    return this.userModel.findOne({ address }).exec();
  }

  async findUsersByAddresses(addresses: string[]): Promise<User[] | null> {
    return this.userModel.find({ address: { $in: addresses } }).exec();
  }
}
