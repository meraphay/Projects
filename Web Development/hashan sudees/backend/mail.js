export async function sendVerificationEmail(email, code) {
  const key = process.env.SMTP2GO_API_KEY
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP2GO_SENDER

  if (key && fromEmail) {
    try {
      const r = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
        body: JSON.stringify({
          to: [email],
          subject: 'Verify your BookMe account',
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f1a;color:#fff">
              <div style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;color:#ff4d4d">BookMe</div>
              <h1 style="font-size:24px;font-weight:800;margin-bottom:12px">Verify your email</h1>
              <p style="color:#999;font-size:14px;line-height:1.6;margin-bottom:24px">Enter this code to verify your email address.</p>
              <div style="background:#1a1a2e;padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px">
                <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#ff4d4d">${code}</div>
              </div>
              <p style="color:#666;font-size:12px">This code expires in 10 minutes.</p>
            </div>`,
          sender: fromEmail,
        }),
      })
      const data = await r.json()
      if (data.error) {
        console.error('SMTP2GO error:', data)
        return { error: data.error?.message || JSON.stringify(data.error) }
      }
      console.log(`Email sent to ${email} via SMTP2GO`)
      return true
    } catch (err) {
      console.error('Email failed:', err.message)
      return { error: err.message }
    }
  }

  console.log(`[DEV] Verification code for ${email}: ${code}`)
  return { dev: true }
}
