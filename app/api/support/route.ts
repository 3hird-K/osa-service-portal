import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { category, subject, message, userEmail, userName } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Configure the transporter
    // IMPORTANT: In production, you should use environment variables for these values
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dime.neil03@gmail.com", // Destination email from the UI
      subject: `[Support Ticket] ${category.toUpperCase()}: ${subject}`,
      text: `
        New Support Ticket Received:
        
        From: ${userName || "Anonymous"} (${userEmail || "No email provided"})
        Category: ${category}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px 20px; text-align: center;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 12px; margin-bottom: 15px;">
               <div style="font-weight: 900; font-size: 24px; letter-spacing: -1px;">OSA Service Portal</div>
            </div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">New Support Ticket</h2>
            <p style="margin: 5px 0 0; opacity: 0.8; font-size: 12px;">Office of Student Affairs Service Portal</p>
          </div>
          <div style="padding: 30px; color: #1e293b; background-color: #ffffff;">
            <div style="margin-bottom: 25px;">
              <p style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px;">Sender Details</p>
              <p style="margin: 0; font-size: 15px; font-weight: 600;">${userName || "Anonymous"} <span style="color: #f97316; font-weight: 400;">(${userEmail || "No email provided"})</span></p>
            </div>
            
            <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
              <div>
                <p style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px;">Category</p>
                <span style="display: inline-block; background: #fff7ed; color: #c2410c; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid #ffedd5;">${category.toUpperCase()}</span>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px;">Subject</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">${subject}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
            
            <p style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px;">Message Body</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${message}</div>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: #1e293b;">OSA Service Portal</p>
            <p style="margin: 4px 0 0; font-size: 10px; color: #64748b;">This is an automated operational broadcast from your management system.</p>
          </div>
        </div>
      `,
      replyTo: userEmail,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
