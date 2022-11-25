import { AuthGuard } from '@nestjs/passport';

export class JwtAUthGuard extends AuthGuard('jwt') {}