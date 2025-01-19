import sgMail from "@sendgrid/mail";

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Send an email using SendGrid.
 */
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const msg = {
      to,
      from: "flamesofloverosarygroup@gmail.com", // Replace with your verified sender email
      subject,
      text,
    };
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
}
