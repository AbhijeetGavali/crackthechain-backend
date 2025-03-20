import mailConfig, { NODE_MAILER_SENDER } from "../config/mail";
import logger from "../common/logger";

class EmailService {
  static async sendEmail({
    to,
    subject,
    text = "",
    html = "",
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      const mailOptions = {
        from: NODE_MAILER_SENDER, // Sender address
        to, // Receiver's address
        subject, // Subject line
        text, // Plain text body
        html, // HTML body (optional)
      };

      // Send email
      const info = await mailConfig.sendMail(mailOptions);
      logger.info("Email sent: ", info.messageId);
      return info.messageId;
    } catch (error) {
      logger.info("Error sending email: ", error);
      throw error; // Propagate error if needed
    }
  }
}

export default EmailService;
