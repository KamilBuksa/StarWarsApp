import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { USER_STATUS } from '../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../generated/i18n.generated';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _i18nService: I18nService,
    private readonly configService: ConfigService,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    const findUser = await this._userRepositoryService.findOneByIdPure(
      user.id,
      {
        select: [
          'id',
          'status',
          'role',
          'lastActivityDate',
          'lang',
          'email',
          'isAccountVerified',
          'name',
          'surname',
        ],
      },
    );

    if (findUser) {
      const status = findUser.status;
      // validate user/admin status
      this.validateStatus(status);

      await this._userRepositoryService.update(findUser.id, {
        lastActivityDate: moment().format(),
      });
      request.user = findUser;
    } else {
      throw new NotFoundException();
    }

    return true;
  }

  validateStatus(status: USER_STATUS): void {
    if (status === USER_STATUS.BLOCKED) {
      throw new MethodNotAllowedException({
        key: 'validation.ACCOUNT_HAS_BEEN_BLOCKED',
      } as { key: I18nPath });
    }

    if (status === USER_STATUS.DELETED) {
      throw new MethodNotAllowedException({
        key: 'validation.ACCOUNT_HAS_BEEN_DELETED',
      } as { key: I18nPath });
    }

    if (status === USER_STATUS.WAITING_FOR_ACCEPTANCE) {
      throw new NotFoundException({
        key: 'validation.CONFIRM_YOUR_ACCOUNT',
      } as { key: I18nPath });
    }

    if (status !== USER_STATUS.ACTIVATED) {
      throw new UnauthorizedException({
        key: 'validation.CONFIRM_YOUR_ACCOUNT',
      } as { key: I18nPath });
    }
  }




}
