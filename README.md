# YantraVis - Smart India Hackathon 2025

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Google_Genkit-AI-orange?style=for-the-badge&logo=google" alt="Google Genkit" />
  <img src="https://img.shields.io/badge/AutoCAD_DXF-Export-red?style=for-the-badge" alt="DXF Export" />
  <img src="https://img.shields.io/badge/SIH-2025-green?style=for-the-badge" alt="SIH 2025" />
</p>

### **SMART INDIA HACKATHON 2025**
- **Problem Statement ID**: 25156
- **Problem Statement Title**: Instruments in observational Astronomy
- **Theme**: Heritage & Culture
- **PS Category**: Software
- **Team ID**: 77386
- **Team Name**: Bitfusion-I

---

## 👨‍💻 Team & Contributors
- **Ayush Bhati** - Team Leader & Major Contributor

---

## 🎯 The Problem
Historically, there has been a lack of unified digital repositories for ancient astronomical instruments (*Yantras*), leading to the loss of ancient observational knowledge, low awareness, and educational gaps. Without modern computational tools, recalculating the complex geographic alignment, scale, and accuracy for specific locations across India remains difficult—leaving ancient yantras preserved only as static monuments rather than reproducible astronomical instruments.

## 💡 Our Solution: YantraVis
**YantraVis** is a full-stack astronomical modeling and heritage preservation platform. For any latitude and longitude across India (and worldwide), it calculates parametric construction dimensions for 13 ancient instruments (*Samrat, Rama, Jai-Prakash, Rasivalaya, Digamsa, Bhitti, etc.*), generates real-time 3D models with solar shadow simulation, provides precision CAD/STL exports for digital fabrication, and integrates generative AI for structural and accuracy analysis.

- **Parametric Construction Dimensions**: Mathematically tailored dimensions derived from true geographic coordinates.
- **Interactive 3D Simulation**: Real-time WebGL rendering with solar position algorithms and dynamic shadow raycasting.
- **CAD & 3D Fabrication Export**: Native AutoCAD ASCII DXF layered export and STL 3D printing mesh generation.
- **Orientation & Calibration Guide**: Precise true north alignment, magnetic declination offset, and IST solar noon correction.
- **AI-Powered Analysis**: Bill of Materials (BOM), cost estimation, material recommendations, and angular readout precision.

---

## 🏛️ System Architecture

The following diagram illustrates the multi-tier architecture of YantraVis, detailing client interactions, mathematical engines, 3D WebGL rendering, CAD generation, and Genkit-powered AI microservices.

```mermaid
graph TB
    subgraph Client ["Client Application (Next.js 14 App Router)"]
        UI["UI Layer<br/>(TailwindCSS + Celestial Dark Theme)"]
        Form["Parameter Input<br/>(Latitude, Longitude, Presets, Sliders)"]
        Canvas["Interactive 3D Canvas<br/>(Three.js & OrbitControls)"]
        ARView["Augmented Reality View<br/>(WebXR / Camera Overlay)"]
    end

    subgraph CoreEngine ["Core Computation & Geometry Engine (Client-side)"]
        Calc["Parametric Calculator<br/>(yantra-calculator.ts)"]
        Astro["Solar Ephemeris Engine<br/>(Solar Noon, Declination, Local Hour Angle)"]
        Declination["Magnetic Declination<br/>(Empirical Indian Subcontinent Model)"]
        ShadowEngine["Dynamic Shadow Engine<br/>(Sun Vector & Real-time Raycasting)"]
    end

    subgraph CADExport ["CAD & Digital Fabrication Pipeline"]
        DXF["DXF Exporter<br/>(AutoCAD AC1009 Layers: Gnomon, Base, Markings)"]
        STL["STL 3D Exporter<br/>(Three.js Polyhedral Mesh Export)"]
    end

    subgraph AIService ["AI Microservice (Node.js & Genkit)"]
        Server["Express API Server<br/>(Port 3001)"]
        Genkit["Google Genkit Framework"]
        Gemini["Google Gemini 2.0 / 1.5 Flash"]
        Flows["AI Analysis Flows<br/>(BOM, Accuracy, Structural Materials)"]
    end

    Form -->|Coordinates & Yantra Selection| Calc
    Calc -->|Parametric Dimensions| Canvas
    Calc -->|Astronomical Alignment| Astro
    Calc -->|Geographic Offsets| Declination
    Astro -->|Sun Vector Coordinates| ShadowEngine
    ShadowEngine -->|Directional Light Position| Canvas
    Canvas -->|3D Scene Graph| STL
    Calc -->|Geometric Polyline Data| DXF
    UI -->|Request Analysis & Feasibility| Server
    Server --> Genkit
    Genkit --> Gemini
    Gemini --> Flows
    Flows -->|Structural Insights & BOM| UI
```

---

## 🔄 End-to-End Application Flow & User Journey

This sequence diagram depicts the end-to-end data lifecycle: from user parameter inputs to real-time 3D simulation, AI analysis generation, and fabrication file export.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Astronomer / Student
    participant UI as Next.js Web Interface
    participant Calc as Parametric Math Engine
    participant Three as Three.js 3D Viewer
    participant AI as Genkit AI Backend
    participant CAD as DXF / STL Exporter

    User->>UI: Selects Yantra (e.g., Samrat Yantra) & Enters (Lat, Lon)
    UI->>Calc: calculateParametricDimensions(yantraId, lat, lon)
    Calc-->>UI: Return Dimensions, Gnomon Angle, Scaling Factors
    UI->>Calc: calculateMagneticDeclination(lat, lon) & calculateSolarNoonOffset(lon)
    Calc-->>UI: Return True North Offset & Solar Noon Delta
    UI->>Three: Construct Parametric Meshes & Calibrated Scales
    UI->>Three: Compute Sun Vector for Selected Date / Time
    Three-->>UI: Render Scene with Dynamic Solar Shadow Tracing
    
    opt Generative AI Analysis
        User->>UI: Click "Generate AI Analysis"
        UI->>AI: POST /api/yantra-analysis (yantraId, dimensions, location)
        AI-->>UI: Stream BOM, Construction Materials & Accuracy Report
    end

    opt CAD & 3D Fabrication Export
        User->>UI: Click "Export CAD (.DXF)"
        UI->>CAD: generateDxfContent(yantraData)
        CAD-->>User: Trigger download of layered .DXF file
        User->>UI: Click "Export 3D Model (.STL)"
        UI->>CAD: STLExporter.parse(scene)
        CAD-->>User: Trigger download of 3D printable .STL file
    end
```

---

## ☀️ Solar Ephemeris & Shadow Simulation Engine

The shadow simulation in YantraVis dynamically tracks the position of the sun based on precise spherical astronomy and real-time celestial mechanics:

```mermaid
flowchart TD
    A["Geolocation Input<br/>(Latitude φ, Longitude λ)"] --> B["Astronomical Time Input<br/>(Local Date, Time, Timezone IST)"]
    B --> C["Julian Day Calculation & Equation of Time (EoT)"]
    C --> D["Solar Declination Angle (δ)<br/>δ = 23.45° × sin(360°/365 × (N + 284))"]
    B --> E["Solar Hour Angle (H)<br/>H = 15° × (Local Solar Time - 12h)"]
    D & E & A --> F["Horizontal Spherical Coordinates"]
    F --> G["Solar Altitude Angle (α)<br/>sin α = sin φ sin δ + cos φ cos δ cos H"]
    F --> H["Solar Azimuth Angle (γ)<br/>cos γ = (sin δ - sin α sin φ) / (cos α cos φ)"]
    G & H --> I["Three.js Directional Light Vector<br/>[x = cos α sin γ, y = sin α, z = cos α cos γ]"]
    I --> J["Dynamic Shadow Map Projection<br/>Shadow cast by Gnomon onto Quadrant Scales"]
    J --> K["Astronomical Readout<br/>Local Solar Time & Celestial Coordinate Mapping"]
```

---

## 📐 Yantra Instrument Classification & Typology

YantraVis supports **13 ancient observational instruments**, classified across their primary astronomical measurement functions:

```mermaid
graph TD
    classDef default fill:#1e293b,stroke:#3b82f6,stroke-width:1.5px,color:#f8fafc;
    classDef category fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#a78bfa;
    classDef instrument fill:#1e1b4b,stroke:#06b6d4,stroke-width:1.5px,color:#e2e8f0;

    Root["YantraVis Instrument Suite<br/>(13 Historical Instruments)"]:::category

    Cat1["Equinoctial Sundials<br/>(Time & Hour Angle)"]:::category
    Cat2["Altitude & Azimuth Systems<br/>(Horizon Coordinates)"]:::category
    Cat3["Hemispherical Celestial Maps<br/>(Inverted Sky Coordinates)"]:::category
    Cat4["Ecliptic & Zodiac Systems<br/>(Celestial Longitude)"]:::category
    Cat5["Meridian Transit Walls<br/>(Zenith Distance & Declination)"]:::category

    Root --> Cat1
    Root --> Cat2
    Root --> Cat3
    Root --> Cat4
    Root --> Cat5

    Cat1 --> Y1["Samrat Yantra<br/>(Supreme Equinoctial Dial)"]:::instrument
    Cat1 --> Y2["Nadi Valaya Yantra<br/>(Dual Equinoctial Hemispheres)"]:::instrument
    Cat1 --> Y3["Yantra Samrat Combo<br/>(Sundial + Meridian Ring)"]:::instrument

    Cat2 --> Y4["Rama Yantra<br/>(Slotted Cylindrical Alt-Azimuth)"]:::instrument
    Cat2 --> Y5["Digamsa Yantra<br/>(Concentric Azimuth Rings)"]:::instrument

    Cat3 --> Y6["Jai Prakash Yantra<br/>(Complementary Hemispherical Bowls)"]:::instrument
    Cat3 --> Y7["Golayantra Chakra<br/>(Armillary Celestial Sphere)"]:::instrument

    Cat4 --> Y8["Rasivalaya Yantra<br/>(12 Zodiac Ecliptic Instruments)"]:::instrument

    Cat5 --> Y9["Bhitti Yantra<br/>(Meridian Transit Wall)"]:::instrument
    Cat5 --> Y10["Dakshinottara Bhitti<br/>(Noon Meridian Wall)"]:::instrument
    Cat5 --> Y11["Chaapa Yantra<br/>(Declination Meridian Arc)"]:::instrument
    Cat5 --> Y12["Dhruva-Protha-Chakra<br/>(Pole Star Transit Ring)"]:::instrument
    Cat5 --> Y13["Palaka Yantra<br/>(Astronomical Plane Board)"]:::instrument
```

---

## 🖨️ CAD & Digital Fabrication Pipeline

To transition from digital visualization to physical heritage reproduction or classroom scale models, YantraVis generates standard engineering files:

```mermaid
flowchart LR
    A["Parametric Dimensions<br/>(Computed from Lat/Lon)"] --> B["Vector & Layer Engine<br/>(dxf-exporter.ts)"]
    A --> C["Three.js 3D Mesh Engine<br/>(yantra-viewer.tsx)"]
    
    subgraph Layers ["DXF Layer Separation"]
        L1["Layer GNOMON (Color: Red)<br/>Central Triangular Hypotenuse"]
        L2["Layer FOUNDATION (Color: Blue)<br/>Base Footprint & Support Walls"]
        L3["Layer DIMENSIONS (Color: Green)<br/>Radial Markings & Quadrant Arcs"]
        L4["Layer ANNOTATION (Color: Yellow)<br/>True North Heading & Scale Labels"]
    end
    
    B --> Layers
    C --> D["STLExporter<br/>(Binary / ASCII STL Parser)"]
    
    Layers --> E["AutoCAD R11/R12 DXF File<br/>(Universal CAD Compatibility)"]
    D --> F["3D Printable STL File<br/>(Slicing & 3D Printing)"]
    
    E --> G["CNC Routing / Laser Cutting"]
    F --> H["FDM / SLA 3D Printers"]
    G & H --> I["Physical Heritage Reconstruction & Scale Models"]
```

---

## 🧭 Geographic Alignment & Orientation Guide

Astronomical accuracy requires precise physical installation relative to the Earth's true geographic rotation axis:

```mermaid
flowchart LR
    subgraph Coordinates ["Location Input"]
        Lat["Latitude (φ)"]
        Lon["Longitude (λ)"]
    end

    subgraph Calculations ["Alignment Mathematics"]
        GnomonAngle["Gnomon Angle = φ<br/>(Parallel to Earth's Rotational Axis)"]
        TrueNorth["True Geographic North<br/>(Azimuth 0° True North Axis)"]
        MagDecl["Magnetic Declination Correction<br/>Δ = 0.5 + (λ - 75)×0.04 - (φ - 20)×0.02"]
        SolarOffset["Solar Noon Offset relative to IST<br/>Δt = (λ - 82.5°) × 4 minutes/degree"]
    end

    subgraph SiteInstallation ["Field Construction & Calibration"]
        CompassOffset["True Meridian Alignment<br/>(Compass reading adjusted by Magnetic Declination)"]
        TimeDialReading["Time Correction Factor<br/>(Solar Time = IST + Δt + Equation of Time)"]
    end

    Lat --> GnomonAngle
    Lat & Lon --> MagDecl
    Lon --> SolarOffset
    Lon --> TrueNorth

    MagDecl --> CompassOffset
    TrueNorth --> CompassOffset
    SolarOffset --> TimeDialReading
```

---

## 🧮 Mathematical Foundations

| Instrument | Key Formulae & Geometry | Astronomical Utility |
| :--- | :--- | :--- |
| **Samrat Yantra** | $\text{Gnomon Slope Angle } \theta = \phi$ (Latitude)<br/>$\text{Height } H = W \times \tan\phi$<br/>$\text{Quadrant Radius } R = H / \sin\phi$ | Local Solar Time (accuracy up to 2 seconds), Hour Angle, Sun Declination |
| **Rama Yantra** | $\text{Cylinder Radius } R = 12 + \phi / 10$<br/>$\text{Pillar Height } = \text{Wall Height } H = 20 + \lambda / 15$<br/>Radial floor & wall slits = $1.5^\circ$ spacing | Direct readout of celestial Altitude ($\alpha$) and Azimuth ($\gamma$) |
| **Jai Prakash Yantra** | $\text{Bowl Diameter } D = 12 + \phi / 10$<br/>$\text{Depth } d = D / 2$<br/>Inverted celestial sphere with cross-wire shadow gnomon | Celestial coordinates, mapping sun in constellations, zodiac signs |
| **Rasivalaya Yantra** | 12 distinct dials; gnomon inclination aligned to ecliptic pole at moment each zodiac sign transits meridian | Direct reading of celestial latitude & celestial longitude |
| **Digamsa Yantra** | Concentric cylindrical walls with central pillar<br/>$\text{Outer Diameter } D_o = 14 + \phi / 10$<br/>$\text{Inner Diameter } D_i = 0.66 \times D_o$ | High-precision Azimuth measurement of rising/setting stars and planets |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Lucide Icons, Shadcn UI
- **3D & Visualization**: Three.js, OrbitControls, WebGL, STLExporter, Dynamic Directional Lighting & Shadows
- **Backend**: Node.js, Express, TypeScript
- **AI Framework**: Google Genkit, Google Gemini 2.0 / 1.5 Flash
- **CAD & Export**: AutoCAD ASCII DXF (AC1009 universal spec), STL 3D Mesh exporter
- **Astronomical Math**: Solar Position Algorithm (SPA), Declination, Equation of Time, Magnetic Declination approximations

---

## 📁 Repository Structure

```
YantraVis/
├── backend/                        # Node.js + Express + Genkit AI backend
│   ├── src/
│   │   ├── ai/
│   │   │   ├── flows/
│   │   │   │   ├── generate-yantra-analysis.ts    # AI BOM, accuracy & material flow
│   │   │   │   └── generate-yantra-description.ts # Historical context & descriptions
│   │   │   ├── genkit.ts                          # Google Genkit initialization
│   │   │   └── dev.ts
│   │   ├── lib/
│   │   └── server.ts                              # Express API entry point (:3001)
│   ├── package.json
│   └── tsconfig.json
├── src/                            # Next.js frontend application
│   ├── app/
│   │   ├── layout.tsx              # Root layout & font configurations
│   │   ├── page.tsx                # Main YantraVis interactive dashboard
│   │   └── globals.css             # Theme definitions & celestial styling
│   ├── components/
│   │   ├── app-header.tsx          # Navigation header with preset locations
│   │   ├── ar-modal.tsx            # WebXR / Camera AR preview modal
│   │   ├── full-screen-modal.tsx   # Expanded 3D viewport modal
│   │   ├── icons.tsx               # Custom SVG icons for all 13 Yantras
│   │   ├── yantra-details.tsx      # Parametric readout, AI analysis, CAD export
│   │   ├── yantra-form.tsx         # Coordinate picker & slider controls
│   │   └── yantra-viewer.tsx       # Three.js 3D canvas with shadow simulation
│   └── lib/
│       ├── dxf-exporter.ts         # AutoCAD DXF vector layer generator
│       ├── yantra-calculator.ts    # Core mathematical formulas & geometry engine
│       ├── yantras.ts              # Instrument metadata & registry
│       └── utils.ts
├── docs/                           # Architecture docs & screenshots
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn** / **pnpm**
- **Google Gemini API Key** (for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/monkeysoul-cmd/YantraVis.git
cd YantraVis
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

### 3. Backend Setup
In a separate terminal:
```bash
cd backend
npm install
# Set your Gemini API key in backend/.env:
# GEMINI_API_KEY="your-gemini-api-key"
npm run dev
```
The backend API server will start at `http://localhost:3001`.

---

## 🌟 Benefits & Impacts

### 🎓 Educational
- Bridges ancient Vedic astronomical science with contemporary computational geometry.
- Interactive STEM learning reinforcement for schools, colleges, and planetariums.
- Visualizes solar movement, equinoxes, and solstices through real-time shadow simulation.

### 💰 Economic
- High ROI heritage tourism and interactive museum installations.
- Open-access CAD models enable low-cost local fabrication for educational institutions.
- Rapid prototyping removes the need for expensive physical trial-and-error construction.

### 🌍 Environmental & Heritage Preservation
- Preserves irreplaceable astronomical knowledge in open-standard digital formats.
- Protects fragile heritage structures (e.g. Jantar Mantar sites in Jaipur, Delhi, Ujjain, Varanasi) through virtual access.
- Eliminates material waste via parametric simulation before on-site civil works.

---

## 📊 Feasibility
1. **Technological Feasibility**: Built with modern, battle-tested open-source libraries (Next.js, Three.js, Genkit) ensuring cross-platform browser support without proprietary plugins.
2. **Financial Feasibility**: Free and open-source architecture with negligible hosting costs, enabling rapid public sector and educational adoption.
3. **Environmental Feasibility**: 100% digital calculation and virtual prototyping with zero material waste.
4. **Social & Cultural Feasibility**: Promotes national heritage awareness, STEM inclusivity, and cultural pride across diverse learning communities.

---

## 📜 License
This project was developed for the **Smart India Hackathon 2025** under Team **Bitfusion-I**. Distributed under the MIT License.
