# Le Bistro — AI-Powered Restaurant Ordering App

A production-grade mobile restaurant ordering experience with a conversational AI waiter. Built for the Viridien AI Full-Stack Engineering Internship Challenge.

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Mobile     | React Native, Expo SDK 51, Expo Router v3         |
| Styling    | NativeWind v4 (Tailwind CSS for React Native)     |
| Animations | React Native Reanimated 3                         |
| State      | Zustand                                           |
| Backend    | Node.js, Express, TypeScript                      |
| AI         | Groq API — Llama 3.3 70B Versatile                |
| Validation | Zod                                               |

---

## Project Structure

```
le-bistro/
├── apps/
│   ├── mobile/                  # Expo React Native app
│   │   ├── app/                 # Expo Router screens
│   │   │   ├── _layout.tsx      # Root layout
│   │   │   └── (tabs)/          # Tab screens (Menu, Cart)
│   │   ├── components/          # Reusable UI components
│   │   ├── store/               # Zustand state (cart, chat)
│   │   ├── hooks/               # useAIChat, useCart
│   │   ├── data/                # Menu items
│   │   ├── constants/           # Theme, API config
│   │   ├── types/               # Shared TypeScript types
│   │   └── utils/               # Helpers
│   └── backend/                 # Express + TypeScript API
│       └── src/
│           ├── controllers/     # Request handlers
│           ├── routes/          # Express routes
│           ├── services/        # Groq AI integration
│           ├── schemas/         # Zod validation
│           ├── types/           # Shared types
│           └── data/            # Menu data
├── .gitignore
├── package.json                 # Root scripts (runs both services)
└── README.md
```

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Expo Go app on your phone ([SDK 51 version](https://expo.dev/go?sdkVersion=51&platform=android&device=true)) **or** an Android emulator
- A free [Groq API key](https://console.groq.com)

---

## First-Time Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd le-bistro
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Set up the backend

```bash
cd apps/backend
npm install
cp .env.example .env
```

Open `apps/backend/.env` and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Get a free key at: https://console.groq.com

### 4. Set up the mobile app

```bash
cd ../mobile
npm install
cd ../..
```

---

## Running the App

### Option A — Run both at once (recommended)

From the root directory:

```bash
npm run dev
```

This starts the backend on port 3001 and Metro bundler simultaneously.

### Option B — Run separately

**Terminal 1 — Backend:**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 — Mobile:**
```bash
cd apps/mobile
npx expo start --clear
```

---

## Connecting Your Device

### Android Emulator (easiest)
1. Open Android Studio → Device Manager → start an emulator
2. Press **`a`** in the Metro terminal — app opens automatically

### Physical Android Phone via USB
1. Enable **Developer Options** on your phone (tap Build Number 7 times)
2. Enable **USB Debugging** in Developer Options
3. Connect phone via USB and run:
```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3001 tcp:3001
```
4. Open Expo Go → enter `exp://localhost:8081`

### Physical Android Phone via WiFi
Set `REACT_NATIVE_PACKAGER_HOSTNAME` to your PC's local IP before starting Metro:
```bash
# Windows
$env:REACT_NATIVE_PACKAGER_HOSTNAME="your.local.ip"
npx expo start --clear
```
Then scan the QR code shown in Metro with Expo Go.

---

## How It Works

```
User message → useAIChat hook
→ POST /api/ai/chat  (message + conversation history + current cart)
→ groqService builds system prompt (full menu + cart context injected)
→ Llama 3.3 70B returns structured JSON: { message, actions[] }
→ Actions dispatched to Zustand cartStore
→ UI updates reactively via store subscriptions
```

### AI Response Format

The AI always returns structured JSON:

```json
{
  "message": "I've added 2 Truffle Arancini to your cart!",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "item-01", "quantity": 2 }
  ]
}
```

Supported action types: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`

---

## Key Features

- **Conversational AI Waiter** — Natural language ordering powered by Llama 3.3 70B via Groq
- **Structured JSON Actions** — AI parses intent and returns typed cart actions
- **Live Cart Updates** — AI actions dispatch directly to Zustand store, UI updates instantly
- **Full Cart Management** — Add, remove, update quantity via both UI and AI
- **Smooth Animations** — React Native Reanimated 3 throughout
- **Type-Safe End-to-End** — Strict TypeScript on both mobile and backend
- **Validated API** — Zod schemas on all backend inputs
- **Graceful Error Handling** — Network failures and malformed AI responses never crash the app

---

## API Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| POST   | /api/ai/chat   | Process natural language order input |
| GET    | /health        | Health check                         |

### POST /api/ai/chat

**Request:**
```json
{
  "message": "Add two spicy chicken sandwiches and a large water",
  "conversationHistory": [...],
  "currentCart": [...]
}
```

**Response:**
```json
{
  "message": "Added 2 Spicy Chicken Sandwiches and 1 Still Water!",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "item-05", "quantity": 2 },
    { "type": "ADD_ITEM", "itemId": "item-09", "quantity": 1 }
  ]
}
```

---

## Author

**Prachi Gupta**  
MSSE, San Jose State University  
prachigupta2610@gmail.com
