import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import * as fs from 'fs';
import { firstValueFrom } from 'rxjs';
import { Auth } from 'src/iam/decorators/auth.decorator';
import { AuthType } from 'src/iam/enums/auth-type.enum';
// import staticPets from 'src/pets/pets-data/mock.js';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

@Auth(AuthType.None)
@Controller('pets')
export class PetsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly petsService: PetsService,
  ) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get('call-picsum-api')
  async ccallPicsumApi() {
  

    const responseFromService = await this.petsService.callPicsumApi();

    return responseFromService;
  }

  @Get('api-static-data')
  async getApiStaticData() {
   
    const staticPets = [
      {
        name: 'Calvin',
        type: 'Dog',
        imageUrl: 'https://placedog.net/336/360',
        description: 'Great at giving warm hugs.',
      },
      {
        name: 'Carly',
        type: 'Dog',
        imageUrl: 'https://placedog.net/360/336',
        description: 'Has a little nice tail',
      },
      {
        name: 'Muffy',
        type: 'Cat',
        imageUrl: 'https://placekitten.com/336/360',
        description: 'Loves drinking milk',
      },
      {
        name: 'Beth',
        type: 'Cat',
        imageUrl: 'https://placekitten.com/360/336',
        description: 'Very playful',
      },
    ];

    return staticPets;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
