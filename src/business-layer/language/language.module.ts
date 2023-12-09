import { Module } from '@nestjs/common';
import { LanguageController } from './controllers/language.controller';
import { LanguageService } from './services/language.service';
import { UserEntityModule } from '../../data-access-layer/user-entity/user-entity.module';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService],
  imports: [UserEntityModule],
})
export class LanguageModule {}
