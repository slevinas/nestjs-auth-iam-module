import { Injectable } from '@nestjs/common';

// this service will be used As a interface to the hashing service that will be implemented via bcrypt

@Injectable()
export abstract class HashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
