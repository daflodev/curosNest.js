import { Module } from '@nestjs/common';

import { BreedsController } from './breeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { BreedsService } from './breeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Breed])],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports : [TypeOrmModule],
})
export class BreedsModule {}
