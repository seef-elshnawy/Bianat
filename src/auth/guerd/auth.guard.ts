import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/uesr.service';

@Injectable()
export class AuthGuards implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
      const user = await this.authService.validateToken(token);
      req.user = user;
      return true;
    } catch (err) {
      throw err;
    }
  }
}
