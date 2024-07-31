import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Auth } from 'src/iam/decorators/auth.decorator';
import { AuthType } from 'src/iam/enums/auth-type.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


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
    console.log('from pets.controller.ccallPricsumApi()');

    try {
      const response = await firstValueFrom(
        this.httpService.get('https://picsum.photos/v2/list?page=1&limit=10')
      );

      const data = response.data;
      // Break circular reference if any
      const sanitizedData = JSON.parse(JSON.stringify(data));
      console.log('from pets.controller.ccallPricsumApi()-sanitizedData', sanitizedData);
      return sanitizedData;
    } catch (error) {
      console.error('Error calling Picsum API', error);
      throw error;
    }
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
