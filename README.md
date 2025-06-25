# AI Gym Coach Web App

AI Gym Coach is a modern, full-stack web application that helps users track their fitness journey, log workouts and meals, and receive personalized, research-based workout recommendations. The app features a clean, responsive, and visually appealing UI, with a focus on usability and a premium user experience.

## Features
- Secure authentication (sign up/login) with Firebase
- Modern dashboard with profile, calories, last workout, and AI recommendations
- Log workouts with exercise autocomplete, dynamic sets/reps, and workout history
- Log meals with food search (USDA API), curated gym foods, meal type, and easy removal
- AI-powered chat coach for fitness and nutrition questions
- Research-based workout recommendations (progressive overload, splits, etc.)
- Dark mode toggle and responsive design
- Smooth page transitions and interactive effects (Framer Motion)

## Tech Stack
- **Frontend:** React, Material-UI (MUI), Framer Motion, React Router
- **Backend/Data:** Firebase Authentication, Firebase Firestore
- **APIs:** USDA FoodData Central API (for food search and nutrition)
- **Styling:** Open Sans font, custom CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Setup
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-gym-coach-web
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Firebase setup:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Authentication (Email/Password) and Firestore Database
   - Copy your Firebase config and update `src/firebase.js`
   - (Optional) Set up Firestore rules for security
4. **USDA API Key (optional):**
   - For production, get your own API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)
   - Replace `DEMO_KEY` in `src/pages/FoodLogPage.js` with your key

### Running the App
```bash
npm start
```
- The app will run at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Usage
- Sign up or log in with your email and password
- Complete your profile and start logging workouts and meals
- Use the dashboard to view your stats and get AI-powered recommendations
- Enjoy a beautiful, responsive, and interactive fitness experience!

---

**Made with React, Material-UI, Firebase, and Framer Motion.** 