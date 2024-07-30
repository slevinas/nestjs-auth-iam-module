import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../permission.type';
export enum CoffeesPermission {
  CreateCoffee = 'create_coffee',
  UpdateCoffee = 'update_coffee',
  DeleteCoffee = 'delete_coffee',
}

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
