import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PetsService {
  constructor(private readonly httpService: HttpService) {}

  async callPicsumApi() {


    try {
      const response = await firstValueFrom(
        this.httpService.get('https://picsum.photos/v2/list?page=1&limit=10'),
      );

      const data = response.data;
      // Break circular reference if any
      const sanitizedData = JSON.parse(JSON.stringify(data));
     
      return sanitizedData;
    } catch (error) {
      console.error('Error calling Picsum API', error);
      throw error;
    }
  }
  create(createPetDto: CreatePetDto) {
    return 'This action adds a new pet';
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
