# SkySense 🌤️ — Smart Weather Intelligence

> Weather forecasts that help you **make decisions.**

A full MERN stack weather app with AI summaries, travel score, smart alerts, favorites, and search history.

---

## 🚀 Quick Setup (Day 1)

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`)
- OpenWeatherMap free API key → https://openweathermap.org/api

### 2. Clone & Install
```bash
git clone <your-repo>
cd skysense

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 3. Configure Environment
```bash
# In /server directory:
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skysense
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run in Development
Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Or from root (install concurrently first: `npm install`):
```bash
npm run dev
```

App runs at: **http://localhost:5173**
API runs at: **http://localhost:5000**

---

## 📁 Project Structure

```
skysense/
├── server/
│   ├── index.js              # Express entry point
│   ├── .env.example
│   ├── models/
│   │   ├── Favorite.js       # Saved cities schema
│   │   └── History.js        # Search history schema
│   ├── routes/
│   │   ├── weather.js        # GET /api/weather
│   │   ├── favorites.js      # CRUD /api/favorites
│   │   └── history.js        # CRUD /api/history
│   └── controllers/
│       └── weatherController.js  # Weather logic, alerts, travel score
│
└── client/
    ├── src/
    │   ├── App.jsx           # Router setup
    │   ├── context/
    │   │   └── WeatherContext.jsx  # Global weather state
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Favorites.jsx
    │   │   ├── Alerts.jsx
    │   │   └── History.jsx
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   └── Layout.jsx       # Sidebar + search bar
    │   │   └── Dashboard/
    │   │       ├── CurrentWeather.jsx
    │   │       ├── ForecastRow.jsx
    │   │       ├── TravelScore.jsx
    │   │       ├── AlertsSummary.jsx
    │   │       ├── AISummary.jsx
    │   │       └── ClothingActivities.jsx
    │   └── utils/
    │       ├── api.js         # Axios wrappers
    │       └── helpers.js     # Date, emoji, greeting
    └── index.css              # All styles (Teal Peach palette)
```

---

## 🌟 Features

| Feature | What it does |
|---|---|
| **Dashboard** | Current weather, 5-day forecast, AI summary, travel score, clothing & activity suggestions |
| **Favorites** | Save cities, live weather preview for each, one-click open |
| **Alerts** | Auto-generated Heat, Rain, Wind, UV, Humidity alerts |
| **History** | Last 10 unique searches with weather snapshot & time ago |

---

## 🔌 API Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/weather?city=Vijayawada` | Full weather data + analysis |
| GET | `/api/favorites` | Get all saved cities |
| POST | `/api/favorites` | Add a city |
| DELETE | `/api/favorites/:city` | Remove a city |
| GET | `/api/history` | Get search history |
| POST | `/api/history` | Log a search |
| DELETE | `/api/history` | Clear all history |

---

## 🎨 Design System

**Palette:** Teal Peach  
- `#007979` – Teal Dark  
- `#24B1B1` – Teal Mid  
- `#FFE0C5` – Peach  
- `#F5F6F8` – Surface  

**Font:** Poppins (Google Fonts)

---

## 📦 Version 2 Roadmap
- [ ] User auth (JWT)
- [ ] Push notifications for alerts
- [ ] Settings page (units, theme, default city)
- [ ] Weather maps overlay
- [ ] Share weather card

---

## 💡 How Travel Score Works

Starts at 100, deducted based on:
- Temperature extremes (> 40°C or < 10°C)
- High humidity (> 85%)
- Strong winds (> 30 km/h)
- Rain probability (> 50%)

Score 75+ = Great | 50–74 = Caution | < 50 = Not ideal
