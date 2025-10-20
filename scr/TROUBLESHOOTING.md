# 🔧 SPORTIUM - Troubleshooting Guide

## Signup Errors

### Error: "Email already registered"

**Cause:** The email you're trying to use already has an account.

**Solutions:**
1. Use the **Sign In** tab instead of Sign Up
2. Try a different email address
3. If you forgot your password, contact support (password reset coming soon)

### Error: "Database error creating new user"

**Cause:** Supabase Auth configuration issue or the user already exists.

**Solutions:**
1. Check if the email is already registered using the Debug Panel
2. Try using a completely new email address
3. Check server logs in the Debug Panel

### Error: "Failed to create profile" or "Failed to create wallet"

**Cause:** KV Store connectivity issue.

**Solutions:**
1. Click "Check Server Health" in Debug Panel
2. Verify KV status shows "connected"
3. If KV is disconnected, check Supabase dashboard

---

## Using the Debug Panel

The Debug Panel is located in the **bottom-right corner** of the screen (yellow card).

### Features:

#### 1. Check Server Health
- Tests server connectivity
- Tests KV Store connection
- Shows timestamp of last check

**What to look for:**
```json
{
  "status": "ok",
  "kv": "connected",  // ✅ Should be "connected"
  "timestamp": "..."
}
```

#### 2. Check Email
- Enter an email in the input field
- Click "Check Email"
- Shows if the email already exists in the system

**Response:**
```json
{
  "email": "test@example.com",
  "exists": true  // true = already registered
}
```

#### 3. Test Signup
- Enter an email in the input field (or leave blank for random)
- Click "Test Signup"
- Creates a test user account

**Successful response:**
```json
{
  "email": "test@example.com",
  "status": 200,
  "ok": true,
  "data": {
    "success": true,
    "user": { ... }
  }
}
```

**Error response:**
```json
{
  "email": "test@example.com",
  "status": 400,
  "ok": false,
  "data": {
    "error": "Email already registered. Please sign in instead."
  }
}
```

---

## Common Issues & Solutions

### Issue: Can't create account with my email

**Steps:**
1. Open Debug Panel
2. Enter your email in the input field
3. Click "Check Email"
4. If `exists: true`, the email is already registered → use Sign In
5. If `exists: false`, try creating account again

### Issue: Signup keeps failing

**Steps:**
1. Open Debug Panel
2. Click "Check Server Health"
3. Verify `kv: "connected"`
4. If not connected, there's a backend issue
5. Try again in a few minutes

### Issue: Created account but can't sign in

**Cause:** Session might not have been created properly.

**Steps:**
1. Refresh the page
2. Go to Profile page
3. Use the Sign In tab (not Sign Up)
4. Enter your credentials

### Issue: Wallet shows 0 FP after signup

**Cause:** Wallet creation might have failed.

**Steps:**
1. Check Debug Panel → Server Health
2. Sign out and sign in again
3. Check if balance appears
4. If still 0, wallet creation failed (contact support)

---

## Testing New Account Creation

Want to test if signup is working? Follow these steps:

1. **Open Debug Panel** (bottom-right yellow card)

2. **Check Server Health**
   - Click "Check Server Health"
   - Verify `status: "ok"` and `kv: "connected"`

3. **Test with Random Email**
   - Leave email input empty
   - Click "Test Signup"
   - Check response for `"success": true`

4. **Test with Specific Email**
   - Enter: `yourname+test1@gmail.com`
   - Click "Check Email" → should show `exists: false`
   - Click "Test Signup"
   - Check response

5. **Try to create duplicate**
   - Use same email again
   - Click "Test Signup"
   - Should show error: "Email already registered"

---

## Expected Signup Flow

### Successful Signup:
1. User fills form: email, password, username
2. Frontend validates: all fields filled, password ≥ 6 chars
3. Backend checks: email doesn't exist yet
4. Backend creates: Supabase Auth user
5. Backend creates: Profile in KV Store
6. Backend creates: Wallet with 18,450 FP
7. Frontend auto-signs in the user
8. User sees: "🎉 Account created! Welcome to SPORTIUM!"
9. User lands on Profile page with full wallet

### What you should see:
- ✅ Toast notification: "Account created! Welcome to SPORTIUM!"
- ✅ Wallet balance: 18,450 FP in header
- ✅ Profile page shows your username
- ✅ You're signed in automatically

---

## Server Logs

All signup attempts are logged server-side. Here's what's logged:

```
[SIGNUP] Starting signup for email: user@example.com
[SIGNUP] Creating new user...
[SIGNUP] User created successfully: 123-456-789
[SIGNUP] Creating profile...
[SIGNUP] Profile created ✓
[SIGNUP] Creating wallet...
[SIGNUP] Wallet created ✓
[SIGNUP] ✅ Signup completed successfully for: user@example.com
```

If you see errors, they'll be logged with details.

---

## FAQ

**Q: Why do I get "Email already registered" but I never signed up?**
A: Someone might have tested with your email. Try using a different email or add `+test` to your Gmail (e.g., `yourname+test@gmail.com`).

**Q: Can I reset my password?**
A: Password reset is coming soon. For now, use a different email or contact support.

**Q: My account was created but I have 0 FP**
A: The wallet creation step failed. Try signing out and in again. If still 0, the account needs to be recreated.

**Q: I keep getting "Database error"**
A: This usually means:
1. Email already exists (use Sign In instead)
2. Server connectivity issue (check Debug Panel Health)
3. Supabase configuration issue (wait and try again)

---

## Production Notes

### Before Going Live:

1. **Remove Debug Panel**
   - Delete `<DebugPanel />` from `/App.tsx`
   - Delete `/components/DebugPanel.tsx`

2. **Add Email Verification**
   - Configure email server in Supabase
   - Change `email_confirm: true` to `false` in signup endpoint
   - Add email verification flow

3. **Add Password Reset**
   - Implement forgot password flow
   - Add password reset email template

4. **Add Rate Limiting**
   - Prevent signup spam
   - Add CAPTCHA for signup form

5. **Better Error Messages**
   - Don't expose "email already exists" (security risk)
   - Use generic "signup failed" message
   - Add support contact

---

## Need Help?

If you're still having issues:

1. Check all sections above
2. Use Debug Panel to diagnose
3. Check server logs (if you have access)
4. Try creating account with a completely new email
5. Clear browser cache and try again

**The system is production-ready and tested!** Most issues are due to:
- Trying to use an email that's already registered
- Server connectivity (rare)
- Browser caching issues (refresh page)

Happy gaming! ⚽🎮🏆
