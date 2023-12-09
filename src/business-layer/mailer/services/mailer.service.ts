import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { LanguageModel } from '../../i18n/model/language.model';
import {
  handleError,
  isArray,
  uniqueValuesFromArray,
} from '../../../utils/other.utils';
import { I18nService } from 'nestjs-i18n';
import { I18nPath } from '../../../generated/i18n.generated';
import {
  MailerAttachmentOptions,
  MailerChoseAttachments,
  MailerVariables,
} from '../mailer.types';

@Injectable()
export class MailService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _i18nService: I18nService,
  ) { }

  async sendMail(options: {
    email: string | string[];
    template: string;
    subject: I18nPath;
    variables?: MailerVariables;
    lang: LanguageModel.LANGUAGE;
    attachments?: {
      filename: string;
      path: string;
    }[];
    choseAttachments?: MailerChoseAttachments;
  }): Promise<void> {
    const { template, subject, variables, lang, email, choseAttachments } =
      options;
    const attachments: { filename: string; path: string; cid?: string }[] = [
      ...this.createAttachments(options, choseAttachments),
    ];

    try {
      if (typeof email === 'string') {
        await this._mailerService
          .sendMail({
            to: email,
            subject: `${this._i18nService.translate(subject, {
              lang: lang ?? LanguageModel.DEFAULT_LANGUAGE,
              args: variables,
            })}`,
            template: `./${template}`,
            context: {
              ...variables,
              i18nLang: lang ?? LanguageModel.DEFAULT_LANGUAGE,
            },
            attachments,
          })
          .then(() => {
            console.info('Email sent');
          })
          .catch((error) => {
            console.error('Email error:');
            handleError(error);
          });
      }
      if (email instanceof Array && isArray(email)) {
        const uniqueEmails = uniqueValuesFromArray(email);
        for await (const e of uniqueEmails) {
          await this._mailerService
            .sendMail({
              to: e,
              subject: `${this._i18nService.translate(subject, {
                lang: lang ?? LanguageModel.DEFAULT_LANGUAGE,
                args: variables,
              })}`,
              template: `./${template}`,
              context: {
                ...variables,
                i18nLang: lang ?? LanguageModel.DEFAULT_LANGUAGE,
              },
            })
            .then(() => {
              console.info('Email sent');
            })
            .catch((error) => {
              console.error('Email error:', error);
            });
        }
      }
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  createAttachments(
    options: MailerAttachmentOptions,
    choseAttachments?: MailerChoseAttachments,
  ): { filename: string; path: string; cid?: string }[] {
    const attachments: { filename: string; path: string; cid?: string }[] = [];

    attachments.push({
      filename: 'logo.png',
      path: process.cwd() + '/public/img/logo.png',
      cid: 'logo',
    });

    if (options.attachments) {
      attachments.push(...options.attachments);
    }

    if (choseAttachments) {
      if (choseAttachments.step1) {
        attachments.push({
          filename: '1.png',
          path: process.cwd() + '/public/img/1.png',
          cid: 'step1',
        });
      }
      if (choseAttachments.step2) {
        attachments.push({
          filename: '2.png',
          path: process.cwd() + '/public/img/2.png',
          cid: 'step2',
        });
      }

      if (choseAttachments.step3) {
        attachments.push({
          filename: '3.png',
          path: process.cwd() + '/public/img/3.png',
          cid: 'step3',
        });
      }
    }

    return attachments;
  }
}
