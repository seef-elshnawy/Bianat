import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Payload = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const { req } = context.getContext();
    console.log(req.payload);
    if (data) {
      return req.payload[data];
    }
    return req.payload;
  },
);
