import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(private readonly httpService: HttpService) {}

  // callPicsumApi() {
  //   this.httpService
  //     .get('https://picsum.photos/v2/list?page=1&limit=10')
  //     .subscribe((response) => {
  //       // console.log('from pets.service.findAll response.data', response.data);

  //       const data = response.data;
  //       // Break circular reference if any
  //       const sanitizedData = JSON.parse(JSON.stringify(data));
  //       console.log('from pets.service.findAll sanitizedData', sanitizedData);
  //       // console.log(typeof sanitizedData);
  //       return sanitizedData;
  //     });
  // }
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
