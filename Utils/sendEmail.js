import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // switch to your provider (SendGrid, SES, etc.) if not Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use a Gmail App Password, not your real password
  },
});

// ---------------------------------------------
// sendOrderConfirmationEmail
// Call this AFTER an order is successfully saved with paymentStatus: "paid"
// ---------------------------------------------
export const sendOrderConfirmationEmail = async (toEmail, order) => {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
           <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
           <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
           <td style="padding:8px;border-bottom:1px solid #eee;">₹${item.price}</td>
         </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#111;">Order Confirmed 🎉</h2>
      <p>Thanks for your order! Here's your summary:</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:left;">Qty</th>
            <th style="padding:8px;text-align:left;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <p><strong>Total: ₹${order.total}</strong></p>
      <p>Order ID: ${order._id}</p>

      <p style="margin-top:24px;color:#666;font-size:14px;">
        We'll notify you again once your order ships.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Order Confirmation",
      html,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    // Don't throw — a failed email shouldn't block the order response
  }
};