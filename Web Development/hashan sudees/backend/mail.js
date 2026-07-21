import nodemailer from 'nodemailer'

let transporter = null
let devUrl = null

async function getTransporter() {
  if (transporter) return transporter
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env

  if (EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(EMAIL_PORT) || 587,
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
    await transporter.verify()
    console.log('Email transporter ready (SMTP)')
    return transporter
  }

  const testAccount = await nodemailer.createTestAccount()
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
  devUrl = 'https://ethereal.email/login'
  console.log('Email transporter ready (Ethereal test)')
  console.log(`View captured emails at ${devUrl} (user: ${testAccount.user})`)
  return transporter
}

export async function sendVerificationEmail(email, code) {
  try {
    const t = await getTransporter()
    const info = await t.sendMail({
      from: `"BookMe" <${process.env.EMAIL_USER || 'bookme@ethereal.email'}>`,
      to: email,
      subject: 'Verify your BookMe account',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f1a; color: #fff;">
          <div style="font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; color: #ff4d4d;">BookMe</div>
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 12px;">Verify your email</h1>
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Enter this code to verify your email address and complete your registration.
          </p>
          <div style="background: #1a1a2e; padding: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
            <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ff4d4d;">${code}</div>
          </div>
          <p style="color: #666; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      `,
    })
    if (info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log(`Verification email preview: ${previewUrl}`)
      }
    }
    return true
  } catch (err) {
    console.error('Failed to send email:', err.message)
    return false
  }
}
