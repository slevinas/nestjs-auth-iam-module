import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Auth } from 'src/iam/decorators/auth.decorator';
import { AuthType } from 'src/iam/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../../decorators/auth.decorator';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { ApiKeyGuard } from '../api-key/api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.ApiKey]: this.apiKeyGuard,
    [AuthType.None]: { canActivate: () => true },
  };
  constructor(
    // reflector is used to read metadata from the SetMetadata in auth.decorator.ts
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    console.log('from authentication.guard.ts authTypes are', authTypes);
    console.log('authTypes[0] is', authTypes[0]);
    console.log('authTypes[1] is', authTypes[1]);
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    // console.log('from authentication.guard.ts the guards are', guards);

    let error = new UnauthorizedException();

    for (const instance of guards) {
      console.log('from authentication.guard.ts instance is', instance);
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
