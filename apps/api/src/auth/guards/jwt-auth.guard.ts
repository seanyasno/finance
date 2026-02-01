import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isNotNullOrUndefined, isNullOrUndefined } from '@finance/libs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(error: any, user: any, _info: any, _context: ExecutionContext) {
    if (isNotNullOrUndefined(error) || isNullOrUndefined(user) || !user) {
      throw error || new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
