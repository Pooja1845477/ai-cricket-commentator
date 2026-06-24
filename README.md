# 🏏 AI Cricket Commentator

A fully-featured, AI-powered cricket match simulator web application with realistic ball-by-ball commentary, live scoring, and intelligent match analysis.

**Live Demo**: [aicricket-jpjnebuj.manus.space](https://aicricket-jpjnebuj.manus.space)

---

## ✨ Features

### Core Simulation
- **Ball-by-Ball Simulation**: Realistic cricket outcomes including dots, singles, boundaries, wickets, wides, and no-balls
- **Multiple Match Formats**: T20 (20 overs), ODI (50 overs), and Test (90 overs)
- **Realistic Probabilities**: Authentic cricket outcome distributions based on player roles

### AI Commentary
- **LLM-Powered Commentary**: Dynamic, varied commentary for every ball using advanced language models
- **Real Player Names**: Commentary uses actual player names for immersive experience
- **Event-Specific Commentary**: Unique commentary for boundaries, wickets, milestones, and match situations

### Live Scoreboard
- **Real-Time Updates**: Live score, wickets, overs, and run rates
- **Current Run Rate (CRR)**: Calculated in real-time
- **Required Run Rate (RRR)**: Displayed for chasing team
- **Detailed Statistics**: Runs, balls faced, strike rate, and more

### Match Management
- **Team Configuration**: Create teams with custom players and roles
- **Player Roles**: Batsman, Bowler, All-rounder, Wicket-keeper
- **Match Controls**: Play ball-by-ball manually or use auto-play mode
- **Speed Control**: Adjust auto-play speed (0.5x to 2x)
- **Pause & Resume**: Full control over match simulation

### Scorecards & Analytics
- **Batting Scorecard**: Per-player statistics (runs, balls, strike rate, fours, sixes)
- **Bowling Scorecard**: Per-player statistics (wickets, runs, overs, economy rate)
- **Match History**: Browse and replay past matches
- **Commentary Logs**: Full ball-by-ball commentary history with color-coded events

### UI/UX
- **Dark Theme**: Premium, sophisticated dark interface with cricket-inspired design
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant animations for boundaries, wickets, and key events
- **Color-Coded Events**: Green for boundaries, red for wickets, visual hierarchy for all events
- **Glassmorphism Effects**: Modern UI with backdrop blur and gradient effects

---

## 🚀 Tech Stack

### Frontend
- **React 19**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **tRPC**: End-to-end type-safe API
- **Wouter**: Lightweight routing
- **Framer Motion**: Smooth animations
- **Shadcn/ui**: High-quality UI components

### Backend
- **Express.js**: Fast, minimal web framework
- **Node.js**: JavaScript runtime
- **tRPC**: Type-safe RPC framework
- **Drizzle ORM**: Type-safe database access

### Database
- **MySQL/TiDB**: Relational database for match data
- **Drizzle Kit**: Schema migrations and management

### AI/LLM
- **Manus Built-in LLM API**: Advanced language models for commentary generation
- **Structured Prompts**: Consistent, varied commentary generation

---

## 📋 Project Structure

```
ai-cricket-commentator/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── MatchSetup.tsx      # Match configuration
│   │   │   ├── MatchPlay.tsx       # Live match simulation
│   │   │   ├── MatchHistory.tsx    # Past matches
│   │   │   └── MatchDetails.tsx    # Match replay & scorecards
│   │   ├── components/             # Reusable components
│   │   │   ├── LiveScoreboard.tsx  # Real-time score display
│   │   │   ├── CommentaryFeed.tsx  # Ball-by-ball commentary
│   │   │   ├── BattingScorecard.tsx
│   │   │   └── BowlingScorecard.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts             # tRPC client setup
│   │   ├── index.css               # Global styles
│   │   └── App.tsx                 # Main app component
│   └── public/                     # Static assets
│
├── server/                          # Express backend
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database queries
│   ├── cricket.ts                  # Cricket simulation engine
│   └── _core/                      # Framework core
│       ├── llm.ts                  # LLM integration
│       ├── context.ts              # Request context
│       └── index.ts                # Server entry point
│
├── drizzle/                         # Database schema
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # SQL migrations
│
├── shared/                          # Shared types
│   ├── const.ts                    # Constants
│   └── types.ts                    # TypeScript types
│
└── package.json                    # Dependencies
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- MySQL/TiDB database
- Manus API credentials (for LLM integration)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pooja1845477/ai-cricket-commentator.git
   cd ai-cricket-commentator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local with your credentials
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   VITE_APP_ID=your_app_id
   OAUTH_SERVER_URL=your_oauth_url
   BUILT_IN_FORGE_API_URL=your_api_url
   BUILT_IN_FORGE_API_KEY=your_api_key
   ```

4. **Run database migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

6. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📖 How to Use

### Creating a Match

1. Click **"Start Simulating"** on the home page
2. Configure both teams:
   - Enter team names
   - Add 11+ players with roles (Batsman, Bowler, All-rounder, Wicket-keeper)
3. Select match format (T20, ODI, or Test)
4. Click **"Start Match"**

### During Match Play

- **Manual Mode**: Click "Play Ball" to simulate one ball at a time
- **Auto-Play**: Click "Auto-Play" to simulate continuously
- **Speed Control**: Adjust playback speed (0.5x to 2x)
- **Pause/Resume**: Pause at any time and resume later
- **Live Commentary**: Read real-time AI-generated commentary for each ball

### Viewing Scorecards

- **Batting Stats**: See runs, balls faced, strike rate, fours, and sixes
- **Bowling Stats**: View wickets, runs conceded, overs bowled, and economy rate
- **Match Summary**: Overall match statistics and key moments

### Replaying Matches

1. Go to **"Match History"**
2. Select a past match
3. View full scorecards and commentary logs
4. Re-simulate the match with auto-play

---

## 🎮 Match Simulation Engine

### Cricket Outcome Probabilities

The simulation uses realistic probability distributions:
- **Dot Balls**: 35%
- **Singles**: 25%
- **Doubles**: 15%
- **Fours**: 15%
- **Sixes**: 5%
- **Wickets**: 3%
- **Wides**: 1%
- **No-balls**: 1%

### Wicket Types

- Bowled
- LBW (Leg Before Wicket)
- Caught
- Stumped
- Run Out

### Statistics Calculation

- **Strike Rate**: (Runs / Balls Faced) × 100
- **Economy Rate**: (Runs Conceded / Overs Bowled)
- **Current Run Rate**: (Runs / Overs Completed)
- **Required Run Rate**: (Runs Needed / Overs Remaining)

---

## 🤖 AI Commentary Generation

The application uses advanced LLM models to generate dynamic, varied commentary for each ball. The commentary system:

- **Uses Real Player Names**: Commentary references actual players in the match
- **Contextual Awareness**: Generates commentary based on match situation, score, and events
- **Varied Output**: Produces different commentary for the same event type
- **Event-Specific**: Unique commentary for boundaries, wickets, milestones, and more

Example commentary:
> "Brilliant batting from Sharma! A crisp drive through the covers for a boundary. The fielding team needs to tighten up their lines here."

---

## 📊 Database Schema

### Key Tables

- **matches**: Match metadata (teams, format, status)
- **innings**: Innings data (batting team, runs, wickets)
- **balls**: Ball-by-ball events (runs, wicket type, commentary)
- **players**: Player information (name, role, team)
- **teams**: Team data (name, code)
- **player_statistics**: Aggregated player stats per match
- **commentary_logs**: Full commentary history

---

## 🔐 Authentication

The application uses Manus OAuth for user authentication:
- Secure login with Manus accounts
- Session management via JWT cookies
- Protected API routes with `protectedProcedure`

---

## 🚢 Deployment

The application is deployed on Manus Cloud with:
- **Autoscale Hosting**: Serverless deployment with auto-scaling
- **Custom Domain**: Available at `aicricket-jpjnebuj.manus.space`
- **Database**: TiDB cloud database
- **CI/CD**: Automatic deployment on code push

### Deploying Your Own Version

1. Push code to GitHub
2. Connect to Manus
3. Click **Publish** in Management UI
4. Configure custom domain (optional)

---

## 🎨 Customization

### Changing Colors

Edit `client/src/index.css` to modify the color scheme:
```css
:root {
  --accent: 74 222 128;        /* Green */
  --secondary: 139 92 246;     /* Purple */
  --background: 10 14 23;      /* Dark background */
}
```

### Adding New Match Formats

1. Update `server/cricket.ts` with new format probabilities
2. Add format to `MatchFormat` type in `shared/types.ts`
3. Update UI in `client/src/pages/MatchSetup.tsx`

### Customizing Commentary

Edit the LLM prompt in `server/routers.ts` to change commentary style:
```typescript
const prompt = `Generate cricket commentary for: ${ballDescription}`;
```

---

## 🐛 Troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear Tailwind cache: `pnpm build`

### Database Connection Issues
- Verify `DATABASE_URL` in environment variables
- Check database credentials and network access
- Ensure SSL is enabled for cloud databases

### LLM Commentary Not Generating
- Verify `BUILT_IN_FORGE_API_KEY` is valid
- Check API rate limits
- Review server logs for error messages

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

## 🎯 Future Enhancements

- [ ] Text-to-speech commentary
- [ ] Player performance analytics dashboard
- [ ] Toss and innings management UI
- [ ] Match statistics export (PDF/CSV)
- [ ] Multiplayer live matches
- [ ] Mobile app (React Native)
- [ ] Advanced player AI with learning
- [ ] Tournament management system
- [ ] Live streaming integration
- [ ] Social sharing features

---

## 🙏 Acknowledgments

- Built with React, Express, and TypeScript
- Powered by Manus LLM API
- UI components from Shadcn/ui
- Styling with Tailwind CSS

---

**Enjoy simulating cricket matches with AI-powered commentary! 🏏⚡**
