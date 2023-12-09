import { Injectable } from '@nestjs/common';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { handleError } from '../../../utils/other.utils';
import { AdminUserUpdateQuery } from '../../users/dtos/request/update.user.query.dto';
import { UpdateLanguageDTO } from '../dtos/req/update.language.dto';
import { LanguageResponse } from '../dtos/res/get.version.dto';
import { I18nService } from 'nestjs-i18n';
import { LanguageModel } from '../../i18n/model/language.model';

@Injectable()
export class LanguageService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _i18nService: I18nService,
  ) {}

  async getUserLanguage(user: UserEntity): Promise<LanguageResponse> {
    return new LanguageResponse(user);
  }

  async translate(key: string, lang: LanguageModel.LANGUAGE) {
    return this._i18nService.translate(key, {
      lang: lang,
    });
  }

  async changeLanguage(
    data: UpdateLanguageDTO,
    currentUser: UserEntity,
    query: AdminUserUpdateQuery,
  ): Promise<LanguageResponse> {
    try {
      const { lang } = data;
      let userEntity: UserEntity = currentUser;
      if (userEntity.role === USER_ROLE.ADMIN && query.userId) {
        userEntity = await this._userRepositoryService.findOneByIdPure(
          query.userId,
          { select: ['id', 'lang'] },
        );
      }
      await this._userRepositoryService.update(userEntity.id, { lang });
      return new LanguageResponse(
        await this._userRepositoryService.findOneByIdPure(userEntity.id, {
          select: ['id', 'lang'],
        }),
      );
    } catch (error) {
      handleError(error);
    }
  }
}
