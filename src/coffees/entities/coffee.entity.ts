import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name?: string;

  @Column()
  brand?: string;

  @JoinTable() // Join the 2 tables - only the OWNER-side does this
  @ManyToMany(
    (type) => Flavor,
    (flavor) => flavor.coffees, // what is "coffee" within the Flavor Entity
    { cascade: true }, // with cascade, if we save a coffee, it will save the flavors as well.
  )
  flavors: Flavor[];
}
