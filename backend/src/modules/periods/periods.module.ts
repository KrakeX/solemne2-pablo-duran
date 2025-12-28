import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Period } from './period.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Period])],
})
export class PeriodsModule {}
