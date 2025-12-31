# Smart Support Ticket Backend

Backend API for the Smart Support Ticket System.

Handles authentication, role-based access control, ticket management, and rule-based auto-assignment of tickets to engineers based on skills and workload.

---

## Features

- JWT authentication
- Role-based access (Admin, Engineer, User)
- Ticket lifecycle management
- Rule-based auto-assignment with explainable decisions
- Skill and workload based engineer selection
- MongoDB persistence

---

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT

---

## Assignment Logic

- Extract skills from ticket title + description
- Match against engineer skills (case-insensitive)
- Prefer best skill match
- Fallback to lowest workload
- Store assignment reason and confidence

---

## Deployment
- Hosted on Render

