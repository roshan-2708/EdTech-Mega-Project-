module.exports = ({
    studentName,
    amount,
    orderId,
    paymentId
}) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            
            <h2 style="color: #16a34a; text-align: center;">
                🎉 Payment Successful!
            </h2>

            <p>Hi <strong>${studentName}</strong>,</p>

            <p>
                Your payment has been completed successfully. You are now enrolled in the selected course(s).
            </p>

            <hr style="margin: 20px 0;" />

            <h3>💳 Payment Details</h3>

            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Amount Paid</td>
                    <td style="padding: 8px;">₹${amount}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Order ID</td>
                    <td style="padding: 8px;">${orderId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Payment ID</td>
                    <td style="padding: 8px;">${paymentId}</td>
                </tr>
            </table>

            <hr style="margin: 20px 0;" />

            <p>
                If you have any questions, feel free to contact our support team.
            </p>

            <p>
                Happy Learning 🚀 <br />
                <strong>Team EduPlatform</strong>
            </p>

        </div>
    </div>
    `;
};
