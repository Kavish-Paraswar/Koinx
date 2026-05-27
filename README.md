# KoinX Tax Loss Harvesting Dashboard

A production-grade, highly responsive, and interactive Tax Loss Harvesting dashboard built as a frontend assignment for KoinX. This application allows users to view their crypto holdings, select positions for harvesting, and dynamically visualize simulated post-harvest capital gains and tax savings.

## 🚀 Features

- **Capital Gains Overview**: View Pre-Harvesting and dynamically calculated After-Harvesting gains (STCG & LTCG).
- **Holdings Management**: Interactive data grid displaying assets, average buy prices, current prices, and harvestable gains/losses.
- **Dynamic Simulation Engine**: Automatically recalculates net gains, losses, and estimated tax savings as users select holdings and adjust sell quantities.
- **Batch Operations**: Select or deselect all harvestable positions with a single click.
- **Interactive UI/UX**: Premium aesthetic with glassmorphism, responsive data tables, mobile-friendly cards, and Framer Motion animations.
- **Resilience**: Simulates API latency and robustly handles API failures with a dedicated error state and retry mechanism.

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS (v3) + Tailwind Merge + clsx
- **State Management**: Zustand v5 (with optimized `useShallow` subscriptions for rendering performance)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest

## 📊 Data Source

The application currently utilizes an in-memory mock service (`src/services/api.ts`) that mimics the structure of real-world cryptocurrency transaction datasets (similar to free financial datasets available on Kaggle). This ensures deterministic calculation results for frontend evaluation without requiring a complex backend database setup.

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kavish-Paraswar/Koinx.git
   cd Koinx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run unit tests:
   ```bash
   npm run test
   ```

## 🏗️ Architecture Highlights

- **Domain-Driven Design**: Strict typings for financial models (`CapitalGains`, `Holding`, `HarvestResult`).
- **Optimized Rendering**: Zustand subscriptions are bound to raw state primitives and derived state is computed locally via `useMemo` to prevent React infinite render loops (`useSyncExternalStore` getSnapshot caching).
- **Accessibility**: Includes ARIA labels, semantic HTML, and keyboard navigability.
- **Responsive Layout**: Uses CSS Grid and Flexbox to seamlessly transition between an advanced desktop table view and a mobile-friendly card layout.

## 📄 License

This project is created for the KoinX frontend engineering assignment.
