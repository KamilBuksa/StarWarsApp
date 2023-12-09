export class DefaultSelectFields {

  static userSelectFields: string[] = [
    'user.id',
    'user.name',
    'user.surname',
    'user.email',
    'user.createdAt',
    'user.modifiedAt',
    'user.lang',
  ];

  static extendedUserSelectFields: string[] = [
    'user.id',
    'user.email',
    'user.name',
    'user.surname',
    'user.role',
    'user.status',
    'user.lastActivityDate',
    'user.lang',
    'user.isAccountVerified',
    'user.createdAt',
  ];

  static filesSelectFields: string[] = [
    'files.id',
    'files.createdAt',
    'files.modifiedAt',
    'files.originalname',
    'files.type',
    'files.order',
    'files.contentType',
    'files.status',
  ];

}
