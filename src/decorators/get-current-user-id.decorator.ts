import { IJwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;
    return user.id;
  },
);
