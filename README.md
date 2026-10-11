# ♟️ Chess Analytics Platform (PGN Parser & Dashboard)

A high-performance, client-side web application for parsing, inspecting, and analyzing chess matches in **PGN (Portable Game Notation)** format using **React (Vite)**, **TypeScript**, **Tailwind CSS**, **chess.js**, and **Recharts**.

---

## 🚀 Key Capabilities

- 📥 **Drag-and-Drop PGN Upload**: Fast processing of both single and multi-game PGN/TXT files directly in the browser (zero server upload, 100% private).
- 🧠 **chess.js Parsing Engine**: Robust parsing of game headers (`Event`, `White`, `Black`, `Result`, `WhiteElo`, `BlackElo`, `ECO`, `Opening`), SAN move histories, and termination reasons.
- 📖 **Opening Repertoire Detection**: Automatic ECO (Encyclopedia of Chess Openings) move-sequence recognition for openings such as the Italian Game, Sicilian Defense, Ruy Lopez, Petrov Defense, Queen's Gambit, etc.
- 📊 **Performance Summaries**: Real-time calculation of win, loss, and draw rates, broken down by white and black pieces.
- 🍩 **Repertoire Donut Chart**: Visual distribution of the most frequently played chess openings.
- 📈 **Elo Progression Timeline**: Interactive chronologically ordered rating trajectory chart showing peak and average ratings against opponents.
- 📋 **Interactive Game Inspector**: Searchable game catalog with expandable move sequence viewers and ECO tags.
- 🔄 **Perspective Switching**: Seamlessly toggle the focused player perspective between any player present in the PGN tournament dataset.

---

## 🏛 Component & Architectural Structure

The project strictly separates **domain business logic** (parsing and statistical aggregations) from **UI presentation components**:

```text
src/
├── components/
│   ├── FileUpload.tsx     # Drag-and-drop & file picker component
│   ├── SummaryCards.tsx   # Win / loss / draw KPIs and match stats
│   ├── OpeningsChart.tsx  # Recharts donut chart for opening frequencies
│   ├── RatingChart.tsx    # Chronological Elo progression line graph
│   └── GameTable.tsx      # Filterable match table with move viewer
├── types/
│   └── chess.ts           # Pure TypeScript models for games, stats, and ratings
├── utils/
│   ├── openings.ts        # ECO opening lookup table and prefix detection
│   ├── pgnParser.ts       # Multi-game PGN splitter, chess.js parser & analytics aggregator
│   └── samplePgn.ts       # Grandmaster blitz & championship demo dataset
├── App.tsx                # Main dashboard coordinator
├── main.tsx               # React entry point
└── index.css              # Tailwind CSS configuration & styling
```

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite (TypeScript)
- **Styling**: Tailwind CSS v4 (Glassmorphic dark design)
- **Chess Engine**: [chess.js](https://github.com/jhlywa/chess.js) (v1.4+)
- **Charting**: [Recharts](https://recharts.org/) (Responsive SVG Pie & Line charts)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Yaromir-Anokhin/chess-analytics-platform.git
cd chess-analytics-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License

MIT License. Open for educational and personal use.
