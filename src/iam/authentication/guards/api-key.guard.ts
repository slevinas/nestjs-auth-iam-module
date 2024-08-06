import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { Repository } from 'typeorm';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { ApiKeysService } from '../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyFromHeader(request);
    // console.log('from api-key.guard.ts the apiKey is', apiKey);
    if (!apiKey) {
      throw new UnauthorizedException();
    }
    const apiKeyEntityId = this.apiKeysService.extractIdFromApiKey(apiKey);
    try {
      const apiKeyEntity = await this.apiKeysRepository.findOne({
        where: { uuid: apiKeyEntityId },
        relations: { user: true },
      });
      console.log('from api-key.guard.ts the apiKeyEntity is', apiKeyEntity);
      await this.apiKeysService.validate(apiKey, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
      } as ActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    console.log('extractKeyFromHeader  ');
    console.log(
      ' the request.headers.authorization is',
      request.headers.authorization?.split(' '),
    );

    // console.log(request.headers.authorization);
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    // ⚠️ note that we're only interested in the ApiKey type
    // so if the type is not ApiKey, we return undefined
    return type === 'ApiKey' ? key : undefined;
  }
}
