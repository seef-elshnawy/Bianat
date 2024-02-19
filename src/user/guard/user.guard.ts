import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../uesr.service';
import { Reflector } from '@nestjs/core';
import { PoliticKey } from '../decorator/premission.decorator';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      const { authorization } = req.headers;
      if (!authorization) {
        throw new UnauthorizedException('please provide token');
      }
      const token = authorization.split('Bearer ')[1];
      const premissons = this.reflector.getAllAndOverride(PoliticKey, [
        ctx.getHandler(),
      ]);
      const user = await this.userService.validateToken(token);
      req.user = user;
      if (!premissons) return true;
      //@ts-expect-error
      return user.SecurityGroup.premissons.includes(...premissons);
    } catch (err) {
      throw err;
    }
  }
}
