# Password Generator & Secure Vault (MVP)

A minimal, privacy-first web app to generate strong passwords and store them securely in a personal vault.  

---

## Features

### Must-Have
- **Password Generator**  
  - Adjustable length  
  - Include/exclude numbers, letters, symbols  
  - Option to exclude look-alike characters  

- **Authentication**  
  - Email + password signup/login  

- **Vault Items**  
  - Fields: title, username, password, URL, notes  
  - Client-side encryption before saving to the server  
  - Copy password to clipboard with auto-clear (10–20s)  
  - Basic search/filter  

### Nice-to-Have (Optional)
- 2FA (TOTP)  
- Tags/folders  
- Dark mode  
- Export/import encrypted vault file  

---

## Tech Stack

- **Frontend:** Next.js + TypeScript  
- **Backend:** Node.js or Next.js API routes  
- **Database:** MongoDB  

---

## Setup & Installation

### Prerequisites
- Node.js >= 18  
- MongoDB (local or Atlas)  

### Backend
```bash
cd backend
npm install
cp .env.example .env
# set your MongoDB URI and any secrets
npm run dev
---

### frontend
cd frontend
npm install
npm start
