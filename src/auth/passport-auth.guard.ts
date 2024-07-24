/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
  mixin,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';
import { Type } from '../auth/interfaces/type.interfaces';

import {
  AuthModuleOptions,
  IAuthModuleOptions,
} from './interfaces/auth-module.options';
import { defaultOptions } from './options';
import { memoize } from './utils/memoize.util';

export type IAuthGuard = CanActivate & {
  logIn<TRequest extends { logIn: Function } = any>(
    request: TRequest,
  ): Promise<void>;
  handleRequest<TUser = any>(
    err,
    user,
    info,
    context: ExecutionContext,
    status?,
  ): TUser;
  getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions | undefined;
};
export const AuthGuard: (type?: string | string[]) => Type<IAuthGuard> =
  memoize(createAuthGuard);

const NO_STRATEGY_ERROR = `In order to use "defaultStrategy", please, ensure to import PassportModule in each place where AuthGuard() is being used. Otherwise, passport won't work correctly.`;
const authLogger = new Logger('AuthGuard');

function createAuthGuard(type?: string | string[]): Type<CanActivate> {
  class MixinAuthGuard<TUser = any> implements CanActivate {
    @Optional()
    @Inject(AuthModuleOptions)
    protected options: AuthModuleOptions = {};

    constructor(@Optional() options?: AuthModuleOptions) {
      this.options = options ?? this.options;
      console.log(
        'from passport-auth.guard.ts, constructor, options: ',
        options,
      );
      if (!type && !this.options.defaultStrategy) {
        authLogger.error(NO_STRATEGY_ERROR);
      }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      console.log(
        'from passport-auth.guard.ts, canActivate line 60 context: ',
        context,
      );
      const options = {
        ...defaultOptions,
        ...this.options,
        ...(await this.getAuthenticateOptions(context)),
      };
      console.log('from passport-auth.guard.ts, options: ', options);

      const [request, response] = [
        this.getRequest(context),
        this.getResponse(context),
      ];
      const passportFn = createPassportContext(request, response);
      const user = await passportFn(
        type || this.options.defaultStrategy,
        options,
        (err, user, info, status) =>
          this.handleRequest(err, user, info, context, status),
      );
      console.log('from passport-auth.guard.ts line 78, user: ', user);
      request[options.property || defaultOptions.property] = user;
      return true;
    }

    getRequest<T = any>(context: ExecutionContext): T {
      return context.switchToHttp().getRequest();
    }

    getResponse<T = any>(context: ExecutionContext): T {
      return context.switchToHttp().getResponse();
    }

    async logIn<TRequest extends { logIn: Function } = any>(
      request: TRequest,
    ): Promise<void> {
      const user = request[this.options.property || defaultOptions.property];
      console.log('from passport-auth.guard.ts line 95, user: ', user);
      await new Promise<void>((resolve, reject) =>
        request.logIn(user, (err) => (err ? reject(err) : resolve())),
      );
    }

    handleRequest(err, user, info, context, status): TUser {
      console.log('from passport-auth.guard.ts line 102, user: ', user);
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user;
    }

    getAuthenticateOptions(
      context: ExecutionContext,
    ): Promise<IAuthModuleOptions> | IAuthModuleOptions | undefined {
      console.log('from passport-auth.guard.ts line 112, context: ', context);
      return undefined;
    }
  }
  const guard = mixin(MixinAuthGuard);
  return guard;
}

const createPassportContext =
  (request, response) => (type, options, callback: Function) =>
    new Promise<void>((resolve, reject) =>
      passport.authenticate(type, options, (err, user, info, status) => {
        try {
          request.authInfo = info;
          return resolve(callback(err, user, info, status));
        } catch (err) {
          reject(err);
        }
      })(request, response, (err) => (err ? reject(err) : resolve())),
    );
