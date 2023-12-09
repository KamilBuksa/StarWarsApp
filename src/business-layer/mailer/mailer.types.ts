export interface MailerAttachmentOptions {
  attachments?: { filename: string; path: string; cid?: string }[];
}

export interface MailerChoseAttachments {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
}

export interface MailerVariables {
  name?: string;
  title?: string;
  link?: string;

  text?: string;
  thankYou?: string;

  userEmail?: string;

  email?: string;
}
