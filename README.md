# CrowdSourceInsightFrontend

This project is yje front end for crowdSourcedInsight api. Users can register, add insights with geolocation, view details, and provide feedback or ratings for each insight.

## Features

- User registration
- A map for displaying insights as marks
- Add, edit, and delete insights
- Filter insights by map area
- View detailed information for each insight
- Submit and view feedback with ratings for insights
- Update and delete feedback

## Tech Stack

- **Angular** (standalone components)
- **PrimeNG** (UI components)
- **Bootstrap** (layout and styling)
- **Leaflet** (interactive maps)
- **TypeScript**

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Xiru1024/CrowdSourceInsightFrontend.git
    cd CrowdSourceInsightFrontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```
    or
    ```bash
    ng serve
    ```

4. Open your browser and navigate to `http://localhost:4200`, this will show registration page by default

## Project Structure

- `src/app/components/` - Angular components (map, login, insight detail, feedback, etc.)
- `src/app/services/` - HTTP services, all the requests to api write here
- `src/styles.scss` - Global styles and theme overrides
