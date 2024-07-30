import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
  ) {}

  async create(createCoffeeDto: CreateCoffeeDto) {
    const newCoffee = new Coffee();
    Object.assign(newCoffee, createCoffeeDto);

    // console.log('newUser', newUser);

    // return await this.userRepository.save(newUser);
    return await this.coffeesRepository.save(newCoffee);
  }

  public async getAllCoffees(): Promise<Coffee[]> {
    return await this.coffeesRepository.find({
      relations: {
        flavors: true,
      },
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeesRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeesRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeesRepository.save(coffee);
  }

  remove(id: number) {
    return `This action removes a #${id} coffee`;
  }
}
