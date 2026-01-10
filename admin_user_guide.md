# Operon Admin Guide: User Management

## Table of Contents
1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [Creating New Users](#creating-new-users)
4. [Managing Existing Users](#managing-existing-users)
5. [Understanding Roles & Permissions](#understanding-roles--permissions)
6. [Organization Statistics](#organization-statistics)
7. [Activity Monitoring](#activity-monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Accessing the Admin Dashboard

### Prerequisites

To access the Admin Dashboard, you must:
- ✅ Have an account in the organization
- ✅ Have **admin privileges** granted to your account
- ✅ Be logged in to Operon

### How to Access

1. **Log in** to your Operon account
2. Navigate to **Dashboard** from the main menu
3. Click on **"Admin"** in the sidebar
   - If you don't see this option, you don't have admin access

> [!IMPORTANT]
> If you see "Admin Access Required" message, contact your organization owner to grant you admin permissions.

---

## Admin Dashboard Overview

The Admin Dashboard is your central hub for managing your organization's users and monitoring platform activity.

### What You'll See

1. **Organization Stats** (4 metric cards at the top):
   - **Active Users**: Current active users vs. max allowed
   - **Drafts (7d)**: Total drafts generated in last 7 days
   - **Open Tasks**: Total outstanding tasks across organization
   - **Emails (7d)**: Email activity in last 7 days

2. **Outstanding Tasks**: View all organization tasks across all users

3. **Team Members**: List of all users in your organization

4. **Activity Feed**: Real-time log of important events and user actions

---

## Creating New Users

### Step-by-Step Process

#### 1. Open Create User Modal

1. Navigate to **Admin Dashboard**
2. Scroll to the **"Team Members"** section
3. Click the **"+ Create User"** button (top right of Team Members section)
4. A modal will appear with a user creation form

#### 2. Fill in User Details

The create user form has the following fields:

##### **Email Address*** (Required)
- Enter the user's work email address
- Must be a valid email format
- **Example**: `jane.doe@company.com`
- This will be their username for login

> [!WARNING]
> Each email can only be used once per organization. You cannot create multiple users with the same email.

##### **First Name** (Optional)
- User's first name
- Helps identify them in the system
- Displays in the UI instead of email

##### **Last Name** (Optional)
- User's last name
- Combined with first name for full display name

##### **Password*** (Required)
- Set the initial password for the user
- **Minimum**: 8 characters
- **Best Practice**: Use a strong, unique password
- User can change this later in their settings

> [!TIP]
> Create a temporary password and share it securely with the user. Ask them to change it on first login.

##### **Role** (Default: Member)
- Choose from three roles:
  - **Member**: Standard user
  - **Manager**: Mid-level permissions
  - **Admin**: Full permissions (same as role, but different context)

> [!NOTE]
> The "Role" field is mainly for organizational purposes. The actual admin permissions are controlled by the "Grant admin access" checkbox.

##### **Grant Admin Access** (Checkbox)
- ☐ Unchecked (default): User is a regular member
- ☑ Checked: User has admin privileges

**Admin users can:**
- Access the Admin Dashboard
- Create and manage other users
- View all organization tasks
- Assign tasks to team members
- View activity logs
- Reset passwords for other users

#### 3. Submit the Form

1. Review all entered information
2. Click **"Create User"** button at the bottom
3. Wait for confirmation message
4. User is immediately added to your organization

### After Creating a User

**The new user can now:**
1. Log in to Operon using their email and password
2. Access their dashboard
3. Connect their email account
4. Start using Operon features

**You should:**
1. ✉️ **Notify the user** - Send them their login credentials securely
2. 📋 **Provide instructions** - Share the login URL and initial setup steps
3. 🔐 **Recommend password change** - Ask them to update their password on first login

---

## Managing Existing Users

Once users are created, admins can manage them through the Team Members section.

### Viewing User Information

Each user card displays:
- **Avatar**: First letter of their email
- **Name/Email**: Display name or email address
- **Admin Badge**: Yellow "Admin" badge if they have admin access
- **Inactive Badge**: Red "Inactive" badge if account is deactivated
- **Activity Stats**: Drafts, tasks, and actions in last 7 days

### User Management Actions

Click the **⋮ (three dots)** menu on any user card to access management options:

#### 1. Reset Password

**When to use**: User forgot their password or you want to set a new one

**Steps**:
1. Click **⋮** next to the user
2. Select **"Reset Password"**
3. Enter a new password (minimum 8 characters)
4. Click **"Reset Password"**
5. Securely share the new password with the user

> [!IMPORTANT]
> The user will be logged out immediately after password reset. They must log in again with the new password.

#### 2. Activate / Deactivate User

**Deactivating a user**:
- Prevents them from logging in
- Keeps their data intact
- Doesn't delete their account
- Can be reversed anytime

**Steps to Deactivate**:
1. Click **⋮** next to the user
2. Select **"Deactivate"**
3. User account is immediately deactivated
4. User shows "Inactive" badge

**Steps to Reactivate**:
1. Click **⋮** next to the inactive user
2. Select **"Activate"**
3. User can log in again

**When to deactivate**:
- ❌ Employee leaves the company (temporarily)
- ❌ User violates policies
- ❌ Seasonal workers during off-season
- ❌ Contractors between projects

#### 3. Remove User

**What happens when you remove a user**:
- User is completely removed from the organization
- They can no longer log in
- Their tasks may remain (assigned to them but visible)
- Their activity history remains

**Steps**:
1. Click **⋮** next to the user
2. Select **"Remove User"**
3. Confirm the action in the dialog box
4. User is immediately removed

> [!WARNING]
> This action cannot be easily undone! If you want to temporarily block access, use "Deactivate" instead.

**When to remove**:
- ❌ User should never have been created (mistake)
- ❌ Employee permanently left the company
- ❌ Duplicate account needs deletion

---

## Understanding Roles & Permissions

### User Roles

Operon has the following role structure:

| Role | Description | Typical Use Case |
|------|-------------|------------------|
| **Member** | Standard user with basic features | Regular employees, team members |
| **Manager** | Mid-level organizational designation | Team leads, project managers |
| **Admin** | Organizational designation (not actual permissions) | Depends on admin checkbox |

> [!NOTE]
> The role dropdown (Member/Manager/Admin) is mainly for organizational labeling. True admin **permissions** come from the "Grant admin access" checkbox.

### Admin Permissions

**Admin Access** is controlled by the checkbox, not the role dropdown.

#### What Admins Can Do

| Feature | Regular User | Admin |
|---------|--------------|-------|
| View own dashboard | ✅ | ✅ |
| Manage own tasks | ✅ | ✅ |
| Connect email | ✅ | ✅ |
| Create automations | ✅ | ✅ |
| **Access Admin Dashboard** | ❌ | ✅ |
| **Create new users** | ❌ | ✅ |
| **Manage all users** | ❌ | ✅ |
| **Reset user passwords** | ❌ | ✅ |
| **Activate/deactivate users** | ❌ | ✅ |
| **Remove users** | ❌ | ✅ |
| **View all org tasks** | ✅* | ✅ |
| **Assign tasks to others** | ❌ | ✅ |
| **View activity feed** | ❌ | ✅ |
| **Create tasks for others** | ❌ | ✅ |

*Regular users can see org tasks but cannot manage assignments

### Granting Admin Access

**To an Existing User**:
Currently, admin access can only be set during user creation. To grant admin access to an existing user:
1. Note their information
2. Remove the user
3. Recreate them with "Grant admin access" checked

> [!TIP]
> **Feature Request**: Ask your development team about adding the ability to toggle admin access for existing users without recreating them.

**To a New User**:
1. When creating the user, check ☑ **"Grant admin access"**
2. Complete the rest of the form
3. Click "Create User"

---

## Organization Statistics

The Admin Dashboard provides key metrics about your organization's activity.

### Active Users

**Display**: `X / Y` (e.g., "5 / 10")
- **X** = Number of active users
- **Y** = Maximum users allowed in your plan

**What it means**:
- Shows how many user slots you're using
- Helps track against your subscription limit
- Green icon indicates user management

**Warning signs**:
- 🚨 At or near max users → Consider upgrading plan
- 🚨 Many inactive users → Clean up unused accounts

### Drafts (7d)

**Display**: Total number

**What it means**:
- Total AI-generated email drafts created in last 7 days
- Across all users in the organization
- Indicates AI usage and productivity

**Interpretation**:
- **High number**: Team actively using AI features
- **Low number**: Users may need training or encouragement

### Open Tasks

**Display**: Total number

**What it means**:
- Tasks not yet completed across entire organization
- All users combined
- Helps track overall workload

**Use this to**:
- Identify if team is overloaded
- See if tasks are piling up
- Determine if you need to redistribute work

### Emails (7d)

**Display**: Total number

**What it means**:
- Email activity over last 7 days
- Currently may show 0 (feature in development)

---

## Activity Monitoring

The **Activity Feed** shows real-time organization events.

### What's Tracked

| Activity Type | Description | Icon |
|---------------|-------------|------|
| **User Created** | New user added | 👤 |
| **Email Connected** | User connected email account | 📧 |
| **Email Synced** | Emails synced from provider | 🔄 |
| **Email Classified** | AI classified an email | 🏷️ |
| **Draft Generated** | AI created email draft | ✍️ |
| **Bulk Drafts Generated** | Multiple drafts created | 📝 |
| **Voice Profile Trained** | User trained voice model | 🎤 |
| **User Sign In** | User logged into system | 🔑 |
| **Task Created** | New task created | 📋 |
| **Password Reset** | Admin reset a password | 🔐 |

### How to Read Activity Feed

Each activity entry shows:
1. **Icon**: Visual indicator of activity type
2. **User**: Who performed the action (name or email)
3. **Description**: What happened
4. **Timestamp**: When it occurred (date and time)

### Using Activity Feed for

**Security Monitoring**:
- Watch for unexpected password resets
- Monitor unusual login times
- Track user sign-in patterns

**Productivity Insights**:
- See which users are most active
- Track feature adoption (email connections, AI usage)
- Identify training opportunities

**Troubleshooting**:
- Verify actions actually occurred
- Check timestamps of events
- Diagnose user issues

---

## Creating Tasks for Users (Admin)

Admins can create tasks and assign them directly to team members.

### Steps to Create a Task

1. **Open Create Task Modal**
   - Navigate to Admin Dashboard
   - Click **"Create Task"** button (near Outstanding Tasks section)

2. **Fill in Task Details**:
   - **Task Title*** (Required): Clear, actionable title
   - **Description**: Additional context and details
   - **Priority**: Low, Medium, High, or Urgent
   - **Due Date**: Optional deadline
   - **Assign To**: Select a user from dropdown

3. **Submit**:
   - Click "Create Task"
   - Task appears in user's task list immediately
   - User can see it on their dashboard

> [!TIP]
> Assigned tasks immediately appear in the user's Tasks page and Dashboard, so they'll see it on next page load!

---

## Troubleshooting

### Can't Access Admin Dashboard

**Problem**: "Admin Access Required" error

**Solutions**:
- ✅ Verify you have admin privileges
  - Check with your organization owner
  - You may need to be recreated with admin access
- ✅ Log out and log back in
- ✅ Clear browser cache and cookies

---

### User Creation Fails

**Problem**: Error when trying to create user

**Common causes & solutions**:

**"Email already exists"**:
- This email is already registered in the organization
- Use a different email address
- Or remove the old account first (if it's a duplicate)

**"Password too short"**:
- Password must be at least 8 characters
- Use a longer, stronger password

**"Invalid email format"**:
- Check email address formatting
- Must be valid format: `name@domain.com`

**"Organization user limit reached"**:
- You've hit your plan's max users
- Deactivate or remove unused users
- Or upgrade your subscription plan

---

### Password Reset Not Working

**Problem**: User still can't log in after password reset

**Solutions**:
- ✅ Verify you entered the correct new password
- ✅ Check that user account is **Active** (not deactivated)
- ✅ Ensure user is trying to log in with their **email** (not name)
- ✅ Wait a few seconds and try again (cache may need to clear)
- ✅ Have user try a different browser

---

### User Can't See Tasks I Assigned

**Problem**: Created task for user but they don't see it

**Solutions**:
- ✅ Verify you selected the correct user in "Assign To" dropdown
- ✅ Ask user to refresh their Tasks page (F5)
- ✅ Verify task was actually created (check Admin Dashboard → Outstanding Tasks)
- ✅ Check that user account is active

---

### Activity Feed Not Updating

**Problem**: Recent activities aren't showing

**Solutions**:
- ✅ Refresh the Admin Dashboard page
- ✅ Check browser console for errors (F12 → Console)
- ✅ Verify the actions actually occurred
- ✅ Wait 10-30 seconds - there may be a slight delay

---

## Best Practices

### For User Creation

1. **Use Real Email Addresses**
   - Avoid placeholder emails like test@test.com
   - Users need valid emails for notifications

2. **Follow Naming Conventions**
   - Use consistent format: firstname.lastname@company.com
   - Makes users easier to identify and manage

3. **Set Temporary Passwords**
   - Create initial password securely
   - Ask users to change on first login
   - Example: `TempPass123!` → User changes to personal password

4. **Document Admin Users**
   - Keep track of who has admin access
   - Review admin list quarterly
   - Remove admin access when roles change

5. **Don't Over-Assign Admin Rights**
   - Only give admin access to those who truly need it
   - Consider security implications
   - Fewer admins = better security

### For User Management

1. **Deactivate, Don't Delete**
   - When someone leaves temporarily, deactivate
   - Only delete if permanent or mistake

2. **Regular Audits**
   - Review user list monthly
   - Remove or deactivate inactive accounts
   - Update roles as needed

3. **Communicate Changes**
   - Tell users before deactivating them
   - Explain password resets
   - Give notice when removing access

4. **Monitor Activity Feed**
   - Check weekly for unusual patterns
   - Look for failed login attempts
   - Track feature adoption

5. **Balance Workload**
   - Use task statistics to distribute work evenly
   - Don't overload single users
   - Monitor tasks per user

---

## Security Considerations

### Password Management

- ✅ **Use strong initial passwords** (8+ characters, mix of types)
- ✅ **Share passwords securely** (encrypted message, password manager)
- ✅ **Force password change** on first login (communicate this to users)
- ✅ **Don't reuse passwords** across multiple users

### Admin Access

- ✅ **Limit admin count** - Only essential personnel
- ✅ **Review admin list** - Quarterly audits
- ✅ **Revoke access promptly** - When employees change roles or leave
- ✅ **Use separate accounts** - Admin account vs. personal account (if possible)

### Account Lifecycle

- ✅ **Onboarding**: Create account with minimal permissions, upgrade as needed
- ✅ **Active Use**: Monitor activity, respond to issues
- ✅ **Role Changes**: Update permissions promptly
- ✅ **Offboarding**: Deactivate immediately when employee leaves

---

## Quick Reference

### User Creation Checklist

- [ ] Have user's email address
- [ ] Determined appropriate role
- [ ] Decided if admin access needed
- [ ] Created strong temporary password
- [ ] Clicked "Create User"
- [ ] Notified user of their credentials
- [ ] Asked user to change password on first login

### User Management Quick Actions

| Action | Steps |
|--------|-------|
| **Reset Password** | ⋮ → Reset Password → Enter new password → Confirm |
| **Deactivate User** | ⋮ → Deactivate → Confirm |
| **Reactivate User** | ⋮ → Activate |
| **Remove User** | ⋮ → Remove User → Confirm (careful!) |

### Admin Access Quick Guide

**To create an admin**:
1. Create User → Fill form → ✅ Grant admin access → Create

**Admin can**:
- Access Admin Dashboard
- Create/manage all users
- Assign tasks to anyone
- View organization stats and activity

**Regular user cannot**:
- Access Admin Dashboard
- Create users
- Manage other users
- Assign tasks to others

---

## Need Help?

**Can't access Admin Dashboard?**
→ Contact your organization owner to grant admin access

**Organization limit reached?**
→ Remove inactive users or upgrade your plan

**User creation failing?**
→ Check email format, password length, and uniqueness

**Activity not showing?**
→ Refresh page, wait 30 seconds, check console for errors

---

**Last Updated**: January 2026  
**Version**: 1.0
