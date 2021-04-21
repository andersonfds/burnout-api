import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@src/resources/user/enum/user-role.enum";

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);