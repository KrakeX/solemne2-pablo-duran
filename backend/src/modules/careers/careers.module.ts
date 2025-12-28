import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Career } from './career.entity';
import { CareersController } from './careers.controller';
import { CareersService } from './carreers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Career])],
    controllers: [CareersController],
    providers: [CareersService],
})
export class CareersModule {}
