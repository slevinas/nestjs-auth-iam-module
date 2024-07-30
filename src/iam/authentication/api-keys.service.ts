import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HashingService } from '../hashing/hashing.service';

export interface GeneratedApiKeyPayload {
  // ⚠️ note ideally this should be its own file, putting it here just for brevity
  apiKey: string;
  hashedKey: string;
}

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashingService: HashingService) {}

  async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return { apiKey, hashedKey };
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    console.log(
      'from api-keys.service.validate was called with:',
      apiKey,
      hashedKey,
    );
    const isValid = await this.hashingService.compare(apiKey, hashedKey);
    // console.log('from api-keys.service.ts the isValid is', isValid);
    return isValid;
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    console.log('apiKey', apiKey);
    return Buffer.from(apiKey).toString('base64');
  }
}
