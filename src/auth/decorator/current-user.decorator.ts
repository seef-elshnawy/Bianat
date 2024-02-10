import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';

export const CurrentUser = createParamDecorator(
  async (data: keyof User, context: ExecutionContext) => {
    console.log('running');
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);

export function typeValues<T, S>(name: T, password: S): string {
  return `hello world ${name} ${password}`;
}
