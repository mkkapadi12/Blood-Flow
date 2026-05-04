const requestCreated = (requesterName, bloodGroup, hospital) => `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e2e8f0; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 32px; border: 1px solid #2d2d5e;">
    <h2 style="color: #818cf8; margin-top: 0;">🩸 Request Created</h2>
    <p>Hi <strong>${requesterName}</strong>,</p>
    <p>Your blood request has been created successfully.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px 0; color: #94a3b8;">Blood Group</td><td style="padding: 8px 0; font-weight: 600;">${bloodGroup || "N/A"}</td></tr>
      <tr><td style="padding: 8px 0; color: #94a3b8;">Hospital</td><td style="padding: 8px 0; font-weight: 600;">${hospital}</td></tr>
    </table>
    <p>A dispatcher will pick up your request shortly. You'll be notified once someone accepts it.</p>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">— BloodFlow Team</p>
  </div>
</body>
</html>`;

const requestAccepted = (requesterName, dispatcherName) => `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e2e8f0; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 32px; border: 1px solid #2d2d5e;">
    <h2 style="color: #34d399; margin-top: 0;">✅ Request Accepted</h2>
    <p>Hi <strong>${requesterName}</strong>,</p>
    <p>Great news! Your blood request has been accepted by dispatcher <strong>${dispatcherName}</strong>.</p>
    <p>They will pick up the blood and deliver it to your hospital. Stay tuned for updates.</p>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">— BloodFlow Team</p>
  </div>
</body>
</html>`;

const requestInTransit = (requesterName) => `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e2e8f0; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 32px; border: 1px solid #2d2d5e;">
    <h2 style="color: #fbbf24; margin-top: 0;">🚚 Blood In Transit</h2>
    <p>Hi <strong>${requesterName}</strong>,</p>
    <p>Your blood is on its way! The dispatcher has picked up the blood and is en route to the hospital.</p>
    <p>You will receive a delivery PIN once the dispatcher arrives.</p>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">— BloodFlow Team</p>
  </div>
</body>
</html>`;

const requestDelivered = (requesterName) => `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e2e8f0; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 32px; border: 1px solid #2d2d5e;">
    <h2 style="color: #34d399; margin-top: 0;">🎉 Delivery Confirmed</h2>
    <p>Hi <strong>${requesterName}</strong>,</p>
    <p>Your blood delivery has been confirmed via PIN verification. Thank you for using BloodFlow!</p>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">— BloodFlow Team</p>
  </div>
</body>
</html>`;

const pinRequired = (requesterName, pin) => `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f23; color: #e2e8f0; padding: 32px;">
  <div style="max-width: 520px; margin: 0 auto; background: #1a1a3e; border-radius: 12px; padding: 32px; border: 1px solid #2d2d5e;">
    <h2 style="color: #818cf8; margin-top: 0;">🔐 Delivery PIN</h2>
    <p>Hi <strong>${requesterName}</strong>,</p>
    <p>The dispatcher has arrived with your blood. Please verify the delivery using the PIN below:</p>
    <div style="background: #2d2d5e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #818cf8;">${pin}</span>
    </div>
    <p style="color: #f87171; font-size: 13px;">⚠️ Do not share this PIN with anyone except the verified dispatcher.</p>
    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">— BloodFlow Team</p>
  </div>
</body>
</html>`;

module.exports = {
  requestCreated,
  requestAccepted,
  requestInTransit,
  requestDelivered,
  pinRequired,
};
