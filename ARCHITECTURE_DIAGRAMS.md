# Ontoverse Architecture Documentation

This document provides comprehensive diagrams to help understand the Ontoverse application architecture, data flow, and component relationships.

## Table of Contents
1. [High-Level Architecture](#1-high-level-architecture)
2. [Application Layer Architecture](#2-application-layer-architecture)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Data Flow Diagram](#4-data-flow-diagram)
5. [State Management Architecture](#5-state-management-architecture)
6. [Neo4j Database Integration](#6-neo4j-database-integration)
7. [Graph Visualization Pipeline](#7-graph-visualization-pipeline)
8. [User Interaction Flow](#8-user-interaction-flow)
9. [File Structure Organization](#9-file-structure-organization)

---

## 1. High-Level Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        A[Next.js Frontend<br/>React + TypeScript]
        B[D3.js Graph Visualization]
        C[Material-UI Components]
        D[Zustand State Management]
    end
    
    subgraph "Next.js Server"
        E[API Routes<br/>/api/papers]
        F[Server-Side Rendering]
    end
    
    subgraph "Database"
        G[Neo4j Graph Database]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    E --> G
    F --> A
    
    style A fill:#4CAF50
    style E fill:#2196F3
    style G fill:#FF9800
```

**Description**: Ontoverse is a full-stack Next.js application that combines frontend and backend functionality. The client uses React with TypeScript for UI, D3.js for graph visualization, Material-UI for design components, and Zustand for state management. The backend API routes communicate with a Neo4j graph database to fetch and process paper relationships.

---

## 2. Application Layer Architecture

```mermaid
graph LR
    subgraph "Presentation Layer"
        A1[App Layout<br/>layout.tsx]
        A2[Home Page<br/>page.tsx]
        A3[Components<br/>UI Elements]
    end
    
    subgraph "Business Logic Layer"
        B1[Graph Data Model]
        B2[Data Adapters]
        B3[Positioning Algorithms<br/>Hierarchy/Force-Directed]
        B4[Selection & Filter Logic]
    end
    
    subgraph "Data Access Layer"
        C1[API Routes<br/>/api/papers]
        C2[Neo4j Driver]
        C3[Cypher Queries]
    end
    
    subgraph "State Management"
        D1[Context Providers<br/>GraphData, Selection]
        D2[Zustand Stores<br/>Zoom, SidePanel, SVG]
    end
    
    A1 --> A2
    A2 --> A3
    A3 --> D1
    A3 --> D2
    A3 --> B4
    B1 --> B2
    B2 --> B3
    A3 --> B1
    C1 --> B2
    C1 --> C2
    C2 --> C3
    
    style A1 fill:#E8F5E9
    style B1 fill:#E3F2FD
    style C1 fill:#FFF3E0
    style D1 fill:#F3E5F5
```

**Description**: The application follows a layered architecture:
- **Presentation**: Next.js pages and React components for UI
- **Business Logic**: Data models, transformation, and positioning algorithms
- **Data Access**: API routes and Neo4j database communication
- **State Management**: Distributed between Context API and Zustand stores

---

## 3. Component Hierarchy

```mermaid
graph TD
    A[RootLayout<br/>ThemeProvider] --> B[Home Page]
    B --> C[GraphDataProvider]
    C --> D[SelectionProvider]
    D --> E[RightDrawer<br/>Main Container]
    
    E --> F[AppTopBar<br/>Logo, Buttons]
    E --> G[MainContainer]
    E --> H[ChatAssistant]
    
    F --> F1[Logo]
    F --> F2[Chat Button]
    F --> F3[Select Mode Toggle]
    F --> F4[Settings Button]
    
    G --> I[DraggablePanels]
    I --> J[GraphContainer<br/>Left Panel]
    I --> K[FilterPanel<br/>Right Panel]
    
    J --> J1[HierarchyGraph<br/>D3 Visualization]
    J --> J2[ZoomSlider]
    J --> J3[Contour Lines]
    
    K --> K1[SearchField]
    K --> K2[SortDropdown]
    K --> K3[FilterIndicator]
    K --> K4[PaperItem List<br/>Virtuoso]
    
    E --> L[Drawer<br/>Node Details]
    L --> M1[PaperDetailsPanel]
    L --> M2[GroupingNodeDetailsPanel]
    
    style A fill:#FF6B6B
    style E fill:#4ECDC4
    style J fill:#95E1D3
    style K fill:#F38181
    style L fill:#AA96DA
```

**Description**: The component tree starts with the root layout applying global theme, then flows through context providers (GraphData, Selection) before reaching the main RightDrawer container. This container manages the top bar, draggable panels (graph + filter), and detail drawers.

---

## 4. Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as React Components
    participant Context as Context Providers
    participant API as Next.js API Route
    participant Neo4j as Neo4j Database
    participant D3 as D3.js Visualization
    
    User->>UI: Open Application
    UI->>Context: Request Initial Data
    Context->>API: GET /api/papers
    API->>Neo4j: Execute Cypher Query
    Neo4j-->>API: Raw Graph Records
    API->>API: Transform Data<br/>(dataAdapter)
    API->>API: Calculate Hierarchy<br/>(HierarchyPositioning)
    API-->>Context: GraphData + TreeNode
    Context->>UI: Provide Graph Data
    UI->>D3: Render Visualization
    D3-->>User: Display Interactive Graph
    
    User->>UI: Click Node
    UI->>Context: Update Selection
    Context->>UI: Trigger Re-render
    UI->>D3: Highlight Selected Node
    UI->>UI: Show Node Details Panel
    D3-->>User: Updated Visualization
    
    User->>UI: Filter/Search Papers
    UI->>UI: Apply Client-Side Filters
    UI->>D3: Update Visible Nodes
    D3-->>User: Filtered Graph View
```

**Description**: The data flows from the Neo4j database through API routes where it's transformed and enriched, then stored in React Context and consumed by components. User interactions update local state and trigger re-renders without server roundtrips.

---

## 5. State Management Architecture

```mermaid
graph TB
    subgraph "React Context API"
        A1[GraphDataContext<br/>Global Graph Data]
        A2[SelectionContext<br/>Node Selection State]
    end
    
    subgraph "Zustand Stores"
        B1[useSelectStore<br/>Multi-select Mode]
        B2[zoomStore<br/>Graph Zoom Level]
        B3[sidePanelStore<br/>Panel Open/Close]
        B4[svgElemsStore<br/>SVG Elements Cache]
        B5[richDataStore<br/>Enhanced Node Data]
    end
    
    subgraph "Components"
        C1[GraphContainer]
        C2[FilterPanel]
        C3[HierarchyGraph]
        C4[RightDrawer]
        C5[NodeDetailsPanel]
    end
    
    A1 -.-> C1
    A1 -.-> C2
    A1 -.-> C3
    
    A2 -.-> C1
    A2 -.-> C2
    A2 -.-> C5
    
    B1 -.-> C1
    B1 -.-> C4
    B2 -.-> C3
    B3 -.-> C4
    B4 -.-> C3
    B5 -.-> C5
    
    C1 --> A2
    C2 --> A2
    C3 --> B2
    C3 --> B4
    C4 --> B3
    
    style A1 fill:#FFD54F
    style A2 fill:#FF8A65
    style B1 fill:#81C784
    style B2 fill:#81C784
    style B3 fill:#81C784
    style B4 fill:#81C784
    style B5 fill:#81C784
```

**Description**: State management is divided between:
- **Context API**: For global, infrequently-changing data (graph data, selection state)
- **Zustand Stores**: For frequently-updated, localized state (zoom, panel visibility, cached SVG elements)

---

## 6. Neo4j Database Integration

```mermaid
graph TB
    subgraph "Neo4j Database"
        A[Papers<br/>Node]
        B[Topics<br/>Node]
        C[Keywords<br/>Node]
        D[CITES<br/>Relationship]
        E[BELONGS_TO<br/>Relationship]
        F[HAS_KEYWORD<br/>Relationship]
    end
    
    A -->|CITES| A
    A -->|BELONGS_TO| B
    A -->|HAS_KEYWORD| C
    B -->|PARENT_OF| B
    
    subgraph "API Layer"
        G[neo4j-driver.ts<br/>Connection Manager]
        H[cypherQuery.ts<br/>Query Definitions]
        I[dataAdapter.ts<br/>Transform Records]
    end
    
    G --> A
    G --> B
    H --> G
    I --> H
    
    subgraph "Data Models"
        J[PaperNodeType]
        K[EdgeType]
        L[TreeNode]
        M[GraphData]
    end
    
    I --> J
    I --> K
    I --> L
    J --> M
    K --> M
    L --> M
    
    style A fill:#4DB6AC
    style B fill:#4DB6AC
    style C fill:#4DB6AC
    style G fill:#7986CB
    style M fill:#9575CD
```

**Description**: The application connects to Neo4j using the official driver. Cypher queries fetch papers, topics, and relationships. Data is transformed from Neo4j's format into TypeScript models (PaperNodeType, EdgeType, TreeNode) and aggregated into a GraphData structure.

---

## 7. Graph Visualization Pipeline

```mermaid
flowchart LR
    A[Raw Neo4j Data] --> B[dataAdapter<br/>Parse & Transform]
    B --> C[GraphData Model]
    C --> D{Positioning Strategy}
    
    D -->|Hierarchy Mode| E[HierarchyPositioning<br/>Tree Layout]
    D -->|Force Mode| F[ForceDirectedPositioning<br/>Physics Simulation]
    
    E --> G[Calculate Node<br/>Positions X,Y]
    F --> G
    
    G --> H[TreeNode with<br/>Coordinates]
    H --> I[D3.js Rendering]
    
    I --> J[SVG Elements]
    J --> K[Node Circles]
    J --> L[Connection Lines]
    J --> M[Labels & Text]
    J --> N[Contour Lines]
    
    O[User Interaction] --> P{Event Type}
    P -->|Click| Q[Select Node]
    P -->|Drag| R[Pan/Move]
    P -->|Scroll| S[Zoom]
    
    Q --> I
    R --> I
    S --> I
    
    style A fill:#FFCCBC
    style C fill:#C5E1A5
    style E fill:#90CAF9
    style F fill:#90CAF9
    style I fill:#CE93D8
    style J fill:#F48FB1
```

**Description**: Graph data flows through positioning algorithms (hierarchy or force-directed) to calculate coordinates, then D3.js renders SVG elements. User interactions (click, drag, zoom) are captured and feed back into the rendering pipeline for dynamic updates.

---

## 8. User Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> LoadingData: App Opens
    LoadingData --> ViewingGraph: Data Loaded
    
    ViewingGraph --> Selecting: Click Node
    ViewingGraph --> Filtering: Use Search/Filter
    ViewingGraph --> Zooming: Scroll/Pinch
    ViewingGraph --> Panning: Drag Background
    
    Selecting --> ViewingDetails: Node Selected
    ViewingDetails --> ViewingGraph: Close Details
    ViewingDetails --> Selecting: Select Another Node
    
    Filtering --> ViewingFilteredGraph: Filters Applied
    ViewingFilteredGraph --> ViewingGraph: Clear Filters
    ViewingFilteredGraph --> Selecting: Select Filtered Node
    
    Zooming --> ViewingGraph: Zoom Complete
    Panning --> ViewingGraph: Pan Complete
    
    ViewingGraph --> MultiSelectMode: Press Ctrl/Shift
    MultiSelectMode --> ViewingGraph: Release Ctrl/Shift
    MultiSelectMode --> SelectingMultiple: Click Nodes
    SelectingMultiple --> MultiSelectMode: Continue Selecting
    SelectingMultiple --> ViewingGraph: Release Keys
    
    ViewingGraph --> ChatAssistant: Click Chat Button
    ChatAssistant --> ViewingGraph: Close Chat
```

**Description**: Users can navigate between different interaction modes: viewing the graph, selecting nodes to see details, applying filters to narrow results, zooming/panning for navigation, and entering multi-select mode with keyboard modifiers. The chat assistant is accessible from any state.

---

## 9. File Structure Organization

```mermaid
graph TD
    A[odsp-ontoverse/] --> B[app/<br/>Next.js App Router]
    A --> C[components/<br/>React Components]
    A --> D[lib/<br/>Business Logic]
    A --> E[model/<br/>Data Models & Stores]
    A --> F[public/<br/>Static Assets]
    
    B --> B1[layout.tsx<br/>Root Layout]
    B --> B2[page.tsx<br/>Home Page]
    B --> B3[api/papers/<br/>API Endpoints]
    
    C --> C1[graphs/<br/>Visualization]
    C --> C2[filter/<br/>Search & Filter]
    C --> C3[layout/<br/>Layout Components]
    C --> C4[NodeDetailsPanels/<br/>Detail Views]
    C --> C5[ChatAssistant.tsx<br/>AI Chat UI]
    
    C1 --> C1A[GraphContainer.tsx]
    C1 --> C1B[hierarchy/HierarchyGraph.ts]
    C1 --> C1C[GraphConfig.ts]
    
    C2 --> C2A[FilterPanel.tsx]
    C2 --> C2B[SearchField.tsx]
    C2 --> C2C[PaperItem.tsx]
    
    D --> D1[neo4j/<br/>Database Layer]
    D --> D2[papers/model/<br/>Data Models]
    D --> D3[state/<br/>Context Providers]
    D --> D4[utils/<br/>Helper Functions]
    
    D1 --> D1A[neo4j-driver.ts]
    D1 --> D1B[neo4j-config.ts]
    
    D2 --> D2A[GraphDataModel.ts]
    D2 --> D2B[dataAdapter.ts]
    D2 --> D2C[HierarchyPositioning.ts]
    D2 --> D2D[cypherQuery.ts]
    
    E --> E1[store/<br/>Zustand Stores]
    E --> E2[GraphDataModel.ts]
    
    E1 --> E1A[useSelection.ts]
    E1 --> E1B[zoomStore.ts]
    E1 --> E1C[sidePanelStore.ts]
    
    style A fill:#E1F5FE
    style B fill:#FFF9C4
    style C fill:#F3E5F5
    style D fill:#E8F5E9
    style E fill:#FFE0B2
```

**Description**: The codebase follows Next.js 14 App Router conventions with clear separation of concerns:
- **app/**: Next.js pages and API routes
- **components/**: Reusable React UI components organized by feature
- **lib/**: Business logic, data access, and utilities
- **model/**: Data models and Zustand state stores
- **public/**: Static files and runtime configuration

---

## Key Technologies Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 | Full-stack React framework with SSR |
| | React 18 | UI component library |
| | TypeScript | Type-safe development |
| | Material-UI (MUI) | Component library & design system |
| | D3.js | Graph visualization and SVG manipulation |
| **State Management** | React Context | Global state (graph data, selection) |
| | Zustand | Local state (zoom, panels, cache) |
| **Backend** | Next.js API Routes | RESTful API endpoints |
| | Neo4j Driver | Database connectivity |
| **Database** | Neo4j | Graph database for papers & relationships |
| **Styling** | Emotion | CSS-in-JS styling solution |
| | Styled Components | Component-level styling |

---

## Data Models Overview

```mermaid
classDiagram
    class GraphData {
        +nodes: PaperNodeType[]
        +links: EdgeType[]
        +treeNode: TreeNode
        +allTopics: string[]
        +allKeywords: string[]
    }
    
    class PaperNodeType {
        +id: number
        +title: string
        +label: string
        +graphLevel: number
        +topicNode: boolean
        +grouping: boolean
        +paperNode: PaperNodeTypeProps
        +x: number
        +y: number
        +color: string
    }
    
    class TreeNode {
        +id: number
        +data: PaperNodeType
        +children: TreeNode[]
        +parent: TreeNode
        +x: number
        +y: number
        +depth: number
    }
    
    class EdgeType {
        +id: number
        +source: number | object
        +target: number | object
        +type: string
        +weight: number
    }
    
    class NodesSelection {
        +lastSelectedNodeData: PaperNodeType
        +itemsSelectionIds: number[]
        +clonesSelection: any[]
        +selectionSource: SelectionSource
    }
    
    GraphData --> PaperNodeType
    GraphData --> EdgeType
    GraphData --> TreeNode
    TreeNode --> PaperNodeType
    TreeNode --> TreeNode
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Container"
        A[Nginx<br/>Reverse Proxy]
        B[Next.js Server<br/>Node.js Runtime]
    end
    
    subgraph "External Services"
        C[Neo4j Database<br/>Separate Instance]
    end
    
    subgraph "Environment Config"
        D[env-config.js<br/>Runtime Configuration]
    end
    
    A --> B
    B --> C
    D --> B
    
    E[Client Browser] --> A
    
    style A fill:#FF6F61
    style B fill:#6B5B95
    style C fill:#88B04B
    style D fill:#F7CAC9
```

**Description**: The application can be deployed as a Docker container with Nginx serving as a reverse proxy. Next.js runs in production mode, connecting to an external Neo4j instance. Runtime configuration is injected via `env-config.js` for flexibility across environments.

---

## Contributing

When contributing to Ontoverse, refer to these diagrams to understand:
- Where new features should be implemented
- How data flows through the system
- Which state management solution to use
- How components interact with each other

For questions or clarifications, please refer to the main [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

*Generated on January 9, 2026*
