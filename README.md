# Solo Sparks

Solo Sparks is a self-discovery feature that helps users build emotional intelligence
and self-awareness through personalized activities. The system analyzes user
profiles, moods, and past behaviors to suggest meaningful solo activities like "watch
a sunset and reflect" or "treat yourself to dessert alone." Users complete these quests,
submit reflections (text/photo/audio), earn Spark Points, and redeem rewards like
profile boosts or exclusive content. It's designed to help people fall in love with
themselves before finding someone else.

## Getting Started

### Prerequisites

- Node.js 18.x
- PostgreSQL 17.x

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JagTheFriend/Solo-Sparks.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory and add the following variables:

```bash
# Database
DATABASE_URL="postgresql:/..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

4. Push schema to database:

```bash
pnpm db:push
```

5. Start the application:

```bash
pnpm dev
```
