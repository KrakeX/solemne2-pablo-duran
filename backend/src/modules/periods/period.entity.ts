import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('periods')
@Unique(['year', 'semester'])
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @Column()
  semester: number; // 1 o 2
}
