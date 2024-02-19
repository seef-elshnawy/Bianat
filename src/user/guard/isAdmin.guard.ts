import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PoliticKey } from '../decorator/premission.decorator';
import { User } from '../entity/user.entity';
import { Actions, Role } from '../user.enum';
import { UserService } from '../uesr.service';

@Injectable()
export class isAdmin implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedException('please provide token');
    }
    const token = authorization.split('Bearer ')[1];
    const user = await this.userService.validateToken(token);
    const premissons = this.reflector.getAllAndOverride(PoliticKey, [
      ctx.getHandler(),
    ]);
    //@ts-expect-error
    return user.SecurityGroup.premissons.includes(...premissons);
  }
}
