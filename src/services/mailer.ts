import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { getErrorMessage } from '../utils/errors.util';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SendMail = async (message: MailDataRequired) => {
  try {
    sgMail.send(message).catch((error) => {
      console.error(getErrorMessage(error));
    });
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};

export { SendMail };
