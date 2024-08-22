import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
  
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.dataSource
      .createEntityManager()
      .create(User, createUserDto);
    return await this.dataSource.createEntityManager().save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByUserName(username: string): Promise<User | undefined> {
    const user = await this.dataSource.createEntityManager().findOne(User, {
      where: {
        username: username,
      },
    });

    return user;
  }
  async findOne(userId: number): Promise<User | string> {
    const user = await this.dataSource.createEntityManager().findOne(User, {
      where: {
        id: userId,
      },
    });
    if (!user) {
      return `User with username ${userId} not found`;
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
