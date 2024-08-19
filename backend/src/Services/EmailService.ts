import { Resend } from "resend";
import config from "../Config/config";



const resend = new Resend(config.server.resend_email_api_key); // Replace with your actual API key

export const sendEmail = async (to: string[], subject: string, html: string) => {

  try {
    const { data, error } = await resend.emails.send({
      from: "Taaskify <noreply@taaskify.com>",  // Use your domain's email address here
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      throw new Error(error.message || 'Failed to send email');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || JSON.stringify(error));
  }
};
