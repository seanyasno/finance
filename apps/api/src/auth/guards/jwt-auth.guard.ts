import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isNotNullOrUndefined, isNullOrUndefined } from '@poke-playbook/libs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any) {
    if (isNotNullOrUndefined(error) || isNullOrUndefined(user)) {
      throw error || new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
