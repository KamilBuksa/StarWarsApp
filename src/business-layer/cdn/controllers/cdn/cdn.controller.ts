import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../../guards/roles.guard';
import { ApiModel } from '../../../../models/api.model';
import { CDNModel } from '../../models/cdn.model';
import { MulterModel } from '../../models/multer.model';
import { CdnService } from '../../services/cdn/cdn.service';
import { ApiSwaggerModel } from '../../../../models/api.swagger.model';
import { LanguageHeadersModel } from '../../../i18n/model/language-headers.model';
import { AccessGuard } from '../../../../guards/access.guard';
@ApiTags('cdn')
@Controller('/cdn')
export class CdnController {
  constructor(private readonly _cdnService: CdnService) {}

  @ApiSwaggerModel.ApiFileCustom()
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: MulterModel.fileFilter,
      limits: {
        fileSize: MulterModel.MAX_FILE_SIZE,
      },
      storage: diskStorage({
        destination: MulterModel.UPLOAD_DIR,
        filename: MulterModel.filename,
      }),
    }),
  )
  @ApiResponse({
    type: CDNModel.UploadedFileResponse,
    status: HttpStatus.CREATED,
  })
  uploadFile(
    @UploadedFile() file: CDNModel.UploadedFile,
    @Req() req: ApiModel.RequestWithUser,
  ): Promise<CDNModel.UploadedFileResponse> {
    return this._cdnService.handleUploadedFile(file, req.user);
  }

  // endpoint for dynamic reading file by src in front
  @ApiExcludeEndpoint()
  @Get('files-url')
  async showFileByUrl(
    @Query() query: CDNModel.FilesUrlDTO,
    @Res() response: Response,
  ): Promise<void> {
    const filePath: string = await this._cdnService.showFileByUrl(query);
    response.sendFile(filePath);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Show not public file' })
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get(':fileId')
  async showFile(
    @Param('fileId') fileId: string,
    @Request() req: ApiModel.RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    const filePath: string = await this._cdnService.showFile(fileId, req.user);
    response.sendFile(filePath);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove file' })
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Delete(':fileId')
  async deleteFile(
    @Param('fileId') fileId: string,
    @Request() req: ApiModel.RequestWithUser,
  ): Promise<ApiModel.StatusResponse> {
    return this._cdnService.deleteFile(fileId, {
      userId: req.user.id,
      role: req.user.role,
    });
  }
}
