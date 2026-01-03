# OpenShelf

OpenShelf is a web application for university students to share used books. It facilitates the donation and request of textbooks, promoting sustainability and accessibility in education.

## Features

- **User Authentication**: Secure login and registration using NextAuth.js (Credentials & Google).
- **Book Listings**: Students can list books they want to donate with details like title, author, condition, and images.
- **Search & Browse**: Powerful search and filtering options to find specific books by category, condition, or location.
- **Request System**: Students can request available books and initiate a conversation with the donor.
- **Messaging**: Built-in messaging system for donors and requesters to coordinate pickup.
- **Dashboard**: personalized dashboard for students to manage their listings, requests, and messages.
- **Admin Panel**: Administrative tools to manage users, listings, and monitor platform activity.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (via shadcn/ui pattern)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/openshelf.git
    cd openshelf
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Copy `.env.example` to `.env` and fill in the required values.

    ```bash
    cp .env.example .env
    ```

    Required variables:
    - `DATABASE_URL`: Connection string for your PostgreSQL database.
    - `AUTH_SECRET`: A random string for NextAuth security.
    - `AUTH_URL`: The base URL of your app (e.g., `http://localhost:3000`).
    - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: (Optional) For Google Sign-In.

4.  **Initialize the database:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, Prisma client, and server actions.
- `prisma`: Database schema and seed script.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)
