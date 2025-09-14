# Personalised Task Scheduler & Alerter

A full-featured task scheduling and notification system built with **Next.js**, **Supabase**, and **Edge Functions**. Users can create one-time or custom recurring tasks, receive timely alerts, and manage notifications in real-time.

---

## Features

- **User Authentication**: Signup and login using Supabase Auth.
- **Task Management**:
  - Create **one-time** or **custom recurring** tasks.
  - Set **task name**, **date & time**, and custom notification preferences.
- **Notification System**:
  - Receive **real-time notifications** for upcoming tasks.
  - Supports **custom notification times**, 1-hour and 24-hour reminders.
  - Notifications are displayed in a **bell dropdown** in the UI.
- **Edge Functions & Cron Jobs**:
  - Notifications are generated server-side via Supabase Edge Functions.
  - Cron job periodically triggers the notification generator.
- **Realtime Updates**: Frontend receives notifications instantly using Supabase Realtime.
- **Mark as Read**: Users can mark notifications as read directly from the UI.

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend & DB**: Supabase (Postgres, Auth, Realtime)  
- **Serverless Functions**: Supabase Edge Functions (Deno)  
- **Deployment**: Vercel / Supabase Hosting  

---

## Project Structure
```
├── app/ # Next.js app pages
├── components/ # React components (NotificationBell, TaskForm, etc.)
├── utils/ # Helper modules (supabase client, fetchers)
│ ├── fetch_live_tasks.ts
│ ├── notifications.ts
│ └── ...
├── functions/ # Supabase Edge Functions
│ └── generate-notifications/
├── models/ # ML/impact ranking models (optional)
├── data/ # Sample datasets or seeds
├── notebooks/ # Experimentation & testing notebooks
├── public/ # Static assets
├── .env # Environment variables
└── package.json

```

---

## Setup & Installation

1. **Clone the repository**

```
git clone <repo-url>
cd personalised-task-scheduler
```

2. **Install dependencies**

```
npm install
# or
yarn install
```

3. **Configure environment variables** (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

4. **Run development server**

```
npm run dev
# or
yarn dev
```

5. **Supabase Edge Function**

```
supabase functions deploy generate-notifications
supabase functions invoke generate-notifications --no-verify-jwt
```

---
## Usage

1. Sign up / log in.

2. Create a new task:

3. Choose One-time or Custom recurrence.

 - Set task name, date/time, and notification preferences.

 - Check the Notification Bell in the header for alerts.

4. Click a notification to mark as read.

---

## Testing Notifications Immediately

- Use the edge function invoke command to trigger notifications instantly:
```
supabase functions invoke generate-notifications --no-verify-jwt
```
- Ensure your tasks table has upcoming tasks and settings exist for your user.

## Contributing

1. Fork the repo

2. Create a new branch (git checkout -b feature/my-feature)

3. Commit your changes (git commit -am 'Add new feature')

4. Push to the branch (git push origin feature/my-feature)

5. Open a pull request

## License

MIT License © [UzzyDizzy]