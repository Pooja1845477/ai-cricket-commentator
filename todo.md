# AI Cricket Commentator - Project TODO

## Phase 1: Database Schema & Core Logic
- [x] Design and implement database schema for matches, innings, balls, players, teams
- [x] Create cricket simulation logic (outcome generation, score tracking, wicket management)
- [x] Implement tRPC procedures for match creation, ball simulation, commentary generation
- [x] Set up LLM integration for AI commentary generation
- [x] Create database helpers for querying match data

## Phase 2: UI - Match Setup & Live Scoreboard
- [x] Build match setup screen with team/player configuration
- [x] Implement match format selector (T20, ODI, Test)
- [x] Create live scoreboard component with score, wickets, overs, run rate
- [x] Build commentary feed panel with color-coded events
- [x] Design dark-themed, cricket-inspired UI layout

## Phase 3: Match Simulation Engine & Controls
- [ ] Implement ball-by-ball manual simulation
- [ ] Build auto-play mode with adjustable speed controls
- [ ] Create pause/resume functionality
- [ ] Integrate LLM commentary generation for each ball
- [ ] Add animations for key events (boundaries, wickets)

## Phase 4: Scorecards & Match History
- [x] Build batting scorecard with player statistics
- [x] Build bowling scorecard with player statistics
- [ ] Create match history page with past matches list (TODO: wire real API)
- [ ] Implement match replay functionality with commentary logs (TODO: wire real API)
- [ ] Add database persistence for match history (TODO: verify end-to-end)

## Phase 5: Polish & Refinement
- [ ] Implement responsive design for mobile/tablet/desktop
- [ ] Add smooth animations and transitions
- [ ] Refine dark theme with cricket-inspired design elements
- [ ] Test all features end-to-end
- [ ] Performance optimization and final touches
