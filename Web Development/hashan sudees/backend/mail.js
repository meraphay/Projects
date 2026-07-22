import { Resend } from 'resend'

let resend = null

export async function sendVerificationEmail(email, code) {
  const key = process.env.RESEND_API_KEY

  if (key) {
    if (!resend) resend = new Resend(key)
    try {
      const { error } = await resend.emails.send({
        from: 'BookMe <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your BookMe account',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f1a; color: #fff;">
            <div style="font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; color: #ff4d4d;">BookMe</div>
            <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 12px;">Verify your email</h1>
            <p style="color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Enter this code to verify your email address and complete your registration.</p>
            <div style="background: #1a1a2e; padding: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
              <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ff4d4d;">${code}</div>
            </div>
            <p style="color: #666; font-size: 12px;">This code expires in 10 minutes.</p>
          </div>
        `,
      })
      if (error) {
        console.error('Resend error:', error)
        return { error: error.message || 'Resend failed' }
      }
      console.log(`Email sent to ${email}`)
      return true
    } catch (err) {
      console.error('Email failed:', err.message)
      return { error: err.message }
    }
  }

  console.log(`[DEV] Verification code for ${email}: ${code}`)
  return { dev: true }
}
