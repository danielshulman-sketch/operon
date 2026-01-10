# Operon User Guide: Tasks & Dashboard

## Table of Contents
1. [Understanding the Dashboard](#understanding-the-dashboard)
2. [Tasks Overview](#tasks-overview)
3. [Creating Tasks](#creating-tasks)
4. [Managing Tasks](#managing-tasks)
5. [Task Filters & Organization](#task-filters--organization)
6. [Admin Features: Assigning Tasks](#admin-features-assigning-tasks)
7. [Dashboard Metrics](#dashboard-metrics)
8. [Troubleshooting](#troubleshooting)

---

## Understanding the Dashboard

The **Dashboard** is your central command center in Operon. It provides a quick overview of your task status, recent activity, and key metrics.

### What You'll See on the Dashboard

1. **Welcome Header**: Personalized greeting with your name
2. **Task Statistics**: Four key metric cards showing:
   - **Pending Tasks** - Tasks waiting to be started
   - **In Progress** - Tasks currently being worked on
   - **Completed** - Tasks finished this week
   - **Urgent** - High-priority tasks requiring attention
3. **Recent Tasks**: Quick view of your active tasks (up to 5 most recent)

### Dashboard Quick Links

Each metric card is clickable and will take you to a filtered view in the Tasks page:
- Click **Pending Tasks** → See all pending tasks
- Click **In Progress** → See tasks you're actively working on
- Click **Completed** → View completed tasks
- Click **Urgent** → See all high-priority tasks

> [!TIP]
> The dashboard updates in real-time. Refresh the page to see the latest stats!

---

## Tasks Overview

**Tasks** in Operon help you track action items, to-dos, and work assignments across your team. Tasks can be created manually or extracted automatically from your emails using AI.

### Key Features

- ✅ **Status Tracking**: pending, in progress, completed
- 🎯 **Priority Levels**: high, medium, low
- 📅 **Due Dates**: Set deadlines for tasks
- 👥 **Assignments** (Admin): Assign tasks to team members
- 🔍 **Smart Filters**: Filter by status and priority
- 📝 **Descriptions**: Add detailed notes to each task

### Task Lifecycle

```
Created → Pending → In Progress → Completed
```

- **Pending**: Task created, not yet started
- **In Progress**: Actively being worked on
- **Completed**: Task finished ✓

---

## Creating Tasks

### Method 1: From the Dashboard

1. Navigate to your **Dashboard**
2. Scroll to the **Recent Tasks** section
3. Click **"+ Create your first task"** (if no tasks exist)
   - OR click the "Create Task" button in the Tasks page

### Method 2: From the Tasks Page

1. Go to **Tasks** from the sidebar
2. Click the **"+ Create Task"** button (top right)
3. Fill out the task creation form

### Task Creation Form

When you click "Create Task", a modal will appear with the following fields:

#### 1. Title* (Required)
- Enter a clear, concise task title
- **Example**: "Review Q3 Report", "Follow up with John", "Update documentation"
- **Best Practice**: Start with an action verb (Review, Create, Send, Update, etc.)

#### 2. Description (Optional)
- Add detailed information about the task
- Include context, links, or specific requirements
- **Example**: "Review the Q3 sales report and highlight key metrics for the team meeting"

#### 3. Priority (Default: Medium)
- **Low**: Can be done whenever there's time
- **Medium**: Standard priority, no immediate urgency
- **High**: Urgent, needs attention soon

> [!IMPORTANT]
> High-priority tasks appear in the "Urgent" count on your dashboard!

#### 4. Due Date (Optional)
- Select a deadline for the task
- Helps with time management and planning
- Format: Click the calendar picker and choose a date

### Completing the Creation

- Click **"Create Task"** to save
- Click **"Cancel"** to discard
- The task will immediately appear in your task list

---

## Managing Tasks

### Viewing Your Tasks

Navigate to **Dashboard** → **Tasks** to see all your tasks.

The task list shows:
- ☑️ **Checkbox**: Quick complete/uncomplete toggle
- **Status Dropdown**: Change task status (Pending/In Progress/Completed)
- **Task Title**: Main task name
- **Description**: Additional details (if provided)
- **Priority Badge**: Color-coded priority indicator
  - 🔴 High (Red)
  - 🟠 Medium (Orange)
  - 🟢 Low (Green)
- **Due Date**: When the task is due
- **Created Date**: When the task was created

### Changing Task Status

**Method 1: Using the Checkbox**
- ☐ Unchecked → Task is pending or in progress
- ☑ Checked → Task is completed

**Method 2: Using the Status Dropdown**
1. Find the task you want to update
2. Click the **status dropdown** next to the checkbox
3. Select new status:
   - **Pending**
   - **In Progress**
   - **Completed**
4. Status updates immediately (no save button needed)

### Updating Priority

1. Find the task you want to update
2. Click the **priority badge** (colored pill showing current priority)
3. This opens a dropdown menu
4. Select new priority:
   - **Low priority**
   - **Medium priority**
   - **High priority**
5. Priority updates immediately with color change

### Task Indicator Colors

| Priority | Color | Use When |
|----------|-------|----------|
| **High** | 🔴 Red | Urgent, time-sensitive tasks |
| **Medium** | 🟠 Orange | Standard tasks, moderate importance |
| **Low** | 🟢 Green | Nice-to-have, non-urgent tasks |

---

## Task Filters & Organization

The Tasks page includes powerful filtering to help you focus on what matters.

### Status Filters

Located at the top of the Tasks page:

- **All**: Show all tasks regardless of status
- **Pending**: Only show tasks not yet started
- **In Progress**: Only show tasks actively being worked on
- **Completed**: Only show finished tasks

**How to Use:**
1. Click any status filter button
2. Task list updates instantly to show only matching tasks
3. Active filter is highlighted in black/white

### Priority Filters

Second row of filters:

- **All Priorities**: Show tasks of any priority
- **High**: Show only urgent tasks
- **Medium**: Show medium-priority tasks
- **Low**: Show low-priority tasks

### Combining Filters

You can use **both** status and priority filters together!

**Example**: Show all "In Progress" tasks that are "High" priority

1. Click **"In Progress"** status filter
2. Click **"High"** priority filter
3. See only tasks matching both criteria

> [!TIP]
> Use filters to create focused work sessions. For example, filter to "Pending" + "High" to tackle urgent items first!

---

## Admin Features: Assigning Tasks

If you're an **administrator** in your organization, you have additional capabilities for managing team tasks.

### What Admins Can Do

- ✅ Create tasks for any team member
- ✅ Assign existing tasks to team members
- ✅ Reassign tasks between team members
- ✅ View all organization tasks (not just your own)
- ✅ See who each task is assigned to

### How to Assign a Task

#### Prerequisites
- You must be an admin in your organization
- Team members must already be added to your organization

#### Assignment Process

1. **Navigate to Tasks page**
2. **Find the task** you want to assign
3. **Look for the assignment dropdown** (appears next to priority badge)
   - Shows "Unassigned" if not assigned
   - Shows current assignee's name if already assigned
4. **Click the dropdown**
5. **Select a team member** from the list
   - Team members shown as: "First Last" or email address
   - Or select "Unassigned" to remove assignment
6. **Assignment saves automatically**

> [!IMPORTANT]
> When you assign a task, the team member will see it in their Tasks view and dashboard.

### Viewing Task Assignments

**On the Tasks Page:**
- Each task shows "Assigned to: [Name]" below the title (admin view only)

**On the Dashboard:**
- Recent tasks section shows assignee information
- Admin can see all organization tasks in the dashboard

###Reassigning Tasks

To change who a task is assigned to:

1. Click the **assignment dropdown** on the task
2. Select a different team member
3. Confirm the change if prompted
4. Task is instantly reassigned

### Unassigning a Task

1. Click the **assignment dropdown**
2. Select **"Unassigned"** from the top of the list
3. Task becomes unassigned (available to everyone)

---

## Dashboard Metrics

The dashboard provides real-time insights into task performance.

### Metric Cards Explained

#### 1. Pending Tasks
- **Icon**: 🔵 Clock
- **Label**: "Today"
- **Shows**: Number of tasks in "Pending" status
- **What it means**: Tasks created but not started yet
- **Action**: Click to view and start working on pending tasks

#### 2. In Progress
- **Icon**: 🟠 Trending Up
- **Label**: "Active"
- **Shows**: Tasks currently being worked on
- **What it means**: Tasks you or your team are actively completing
- **Action**: Click to see what's actively being worked on

#### 3. Completed
- **Icon**: 🟢 Check Circle
- **Label**: "This week"
- **Shows**: Tasks completed this week
- **What it means**: Your productivity measure for the week
- **Action**: Click to review completed work

#### 4. Urgent
- **Icon**: 🔴 X Circle
- **Label**: "High Priority"
- **Shows**: Number of high-priority tasks
- **What it means**: Tasks needing immediate attention
- **Action**: Click to tackle urgent items

### Understanding the Numbers

**Healthy Task Distribution:**
- **Low Pending**: Good! You're staying on top of new tasks
- **Moderate In Progress**: Indicates active work without overload
- **Growing Completed**: Shows consistent productivity
- **Low Urgent**: Means you're managing priorities well

**Warning Signs:**
- 🚨 **High Pending + Low In Progress**: Tasks piling up, not being started
- 🚨 **Many Urgent**: Too many high-priority items, consider delegating
- 🚨 **Low Completed**: May need to focus on finishing tasks

### Recent Tasks Section

The **Recent Tasks** section shows up to 5 of your most recent active tasks (excludes completed).

**What You See:**
- Task title and description
- Priority badge (colored)
- Status badge (colored)
- Assignee (admin view only)

**Empty State:**
- If no active tasks exist, you'll see:
  - "No active tasks" message
  - **"+ Create your first task"** button
  - Quick action to add a task

---

## Troubleshooting

### Tasks Not Showing Up

**Problem**: I created a task but don't see it in the list

**Solutions**:
- ✅ Check your status filters - make sure "All" is selected
- ✅ Check your priority filters - make sure "All Priorities" is selected
- ✅ Refresh the page (F5 or Ctrl+R)
- ✅ Make sure you're logged in
- ✅ Check if you're viewing the correct organization (if you belong to multiple)

---

### Can't Change Task Status

**Problem**: Clicking the status dropdown doesn't work

**Solutions**:
- ✅ Ensure you're logged in (session may have expired)
- ✅ Refresh the page and try again
- ✅ Check browser console for errors (F12 → Console)
- ✅ Try a different browser
- ✅ Clear browser cache and cookies

---

### Assignment Dropdown Not Visible

**Problem**: I don't see the option to assign tasks

**Solutions**:
- ✅ **Verify you're an admin** - Only admins can assign tasks
- ✅ Contact your organization admin to grant admin privileges
- ✅ Check with your team if you should be an admin

> [!NOTE]
> Regular users cannot assign tasks. This is an admin-only feature to maintain task management control.

---

### Team Members Not Appearing in Dropdown

**Problem**: Assignment dropdown is empty or missing team members

**Solutions**:
- ✅ Verify team members are added to your organization
  - Go to**Settings** → **Team** (or **Admin** → **Users**)
  - Add missing team members
- ✅ Refresh the page after adding new members
- ✅ Check that team members have completed registration

---

### Tasks Showing for Another User

**Problem**: I see tasks assigned to someone else

**Explanation**: This is normal! Admins see all organization tasks to manage the team effectively.

**Solutions**:
- ✅ Use filters to show only your tasks:
  - This requires custom filtering by assignee (feature request)
- ✅ Look for "Assigned to: [Name]" text to identify task ownership
- ✅ Currently, all org tasks are visible to everyone

---

### Dashboard Stats Not Updating

**Problem**: Numbers on dashboard seem incorrect or outdated

**Solutions**:
- ✅ **Refresh the page** - Dashboard loads stats on page load
- ✅ Clear browser cache
- ✅ Check if tasks are being created/updated successfully
- ✅ Wait a few seconds after creating/updating tasks, then refresh

---

### Priority Colors Not Changing

**Problem**: Changed priority but color didn't update

**Solutions**:
- ✅ Refresh the page - Sometimes requires a page reload
- ✅ Check if the update actually saved (look at dropdown value)
- ✅ Clear browser cache if color persists incorrectly

---

## Best Practices

### For All Users

1. **Use Descriptive Titles**
   - ✅ Good: "Review Q3 budget and prepare summary"
   - ❌ Bad: "Budget stuff"

2. **Set Realistic Due Dates**
   - Don't over-commit
   - Leave buffer time for unexpected issues

3. **Update Status Regularly**
   - Move tasks to "In Progress" when you start
   - Mark completed promptly

4. **Prioritize Thoughtfully**
   - Don't mark everything as "High"
   - Save high priority for truly urgent items

5. **Use Descriptions**
   - Add context others (or future you) will need
   - Include links, requirements, dependencies

### For Admins

1. **Assign Tasks Clearly**
   - Ensure assignments match team member's skills
   - Don't overload any single person

2. **Balance Workload**
   - Check dashboard to see team distribution
   - Reassign if someone has too many tasks

3. **Set Expectations**
   - Communicate due dates clearly
   - Discuss priorities with assignees

4. **Review Regularly**
   - Check dashboard metrics weekly
   - Identify bottlenecks (high pending, low completed)

5. **Use Urgent Sparingly**
   - If everything is urgent, nothing is
   - Reserve for genuinely time-sensitive items

---

## Quick Reference

### Task Status Flow

```
☐ Pending → ⏳ In Progress → ✅ Completed
```

### Priority Guide

| Priority | When to Use |
|----------|-------------|
| 🔴 **High** | Due today/tomorrow, blocks other work, executive request |
| 🟠 **Medium** | Due this week, standard importance, routine work |
| 🟢 **Low** | Nice-to-have, no deadline, low impact |

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | F5 or Ctrl+R |
| Open browser console | F12 |

### Common Task Flows

**Creating a Quick Task:**
1. Dashboard → + Create Task
2. Enter title
3. Click Create Task

**Marking a Task Complete:**
1. Find task in list
2. Click checkbox ☐ → ☑
3. Done!

**Filtering to High Priority:**
1. Go to Tasks page
2. Click "High" priority filter
3. See urgent items only

**Assigning a Task (Admin):**
1. Find task
2. Click assignment dropdown
3. Select team member
4. Auto-saves

---

## Integration with Other Features

### Email Stream Integration

- Tasks can be **automatically created from emails** using AI
- Operon analyzes incoming emails and suggests action items
- Accept suggested tasks to add them to your list

### Automations Integration

- Create automations that trigger when tasks are created
- Example: Send Slack notification when urgent task is created
- Example: Add task details to Google Sheets for tracking

---

## Permissions Overview

| Feature | Regular User | Admin |
|---------|--------------|-------|
| View own tasks | ✅ | ✅ |
| View all org tasks | ✅ | ✅ |
| Create tasks | ✅ | ✅ |
| Edit own tasks | ✅ | ✅ |
| Change status | ✅ | ✅ |
| Change priority | ✅ | ✅ |
| **Assign tasks** | ❌ | ✅ |
| **View assignments** | ❌ | ✅ |
| **Manage team** | ❌ | ✅ |

---

## Need Help?

- **Check Filters**: Most visibility issues are filter-related
- **Refresh the Page**: Solves 90% of display issues
- **Verify Permissions**: Make sure you're an admin for admin features
- **Contact Support**: Reach out to your organization admin

---

**Last Updated**: January 2026  
**Version**: 1.0
