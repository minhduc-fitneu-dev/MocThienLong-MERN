import { sendEmail } from "./emailService.js";

const sendEmailFun = async ({ to, subject, html }) => {
  const result = await sendEmail({ to, subject, html });

  if (result.success) {
    console.log("✅ Email sent successfully");
  } else {
    console.error("❌ Failed to send email:", result.error);
  }

  return result;
};

export default sendEmailFun;
