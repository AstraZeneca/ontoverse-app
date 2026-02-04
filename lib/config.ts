import { CONFIG_ID } from "./env";

enum ConfigId {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  // LARGE = 'large',
}

interface Config {
  contourLines: {
    CONTOURS_KEY_GRADIENT_COLORS: string[];
    populateNeighborsStep: number;
    contouringBandwidth: number;
    contouringThresholds: number;
  };
  zoom: {
    MAX_ZOOM: number;
    COLLECTION_ZOOM_MIN: number;
    COLLECTION_ZOOM_MAX: number;
    ZOOM_CONFIG: {
      collectionZoom: (null | { min: number; max: number })[][];
      showPaperNodeLabelAtZoomLevel: { min: number; max: number };
      showPaperNodeSubLabelAtZoomLevel: { min: number; max: number };
      showGroupingLinkLinesAtZoomLevel: { min: number; max: number };
    };
  };
}

const MAX_ZOOM = 60;
const COLLECTION_ZOOM_MIN = 0.2;
const COLLECTION_ZOOM_MAX = (ConfigId.SMALL === CONFIG_ID) ? 7 : 20;

const configs: Record<ConfigId, Config> = {
  [ConfigId.SMALL]: {
    contourLines: {
      populateNeighborsStep: 10,
      contouringBandwidth: 30,
      contouringThresholds: 220,
      CONTOURS_KEY_GRADIENT_COLORS: [
        '#bcbf89', '#D7D49C',
        '#F4BB6D', 
        '#e0b178',
        '#867368',
        '#F9F5F2',
      ],
    },
    zoom: {
      MAX_ZOOM,
      COLLECTION_ZOOM_MIN,
      COLLECTION_ZOOM_MAX,
      ZOOM_CONFIG: {
        collectionZoom: [//by max graph level
          [],//ignore 0 index
          [null, { min: COLLECTION_ZOOM_MIN, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 7 }, { min: 2.5, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3 }, { min: 1.8, max: 4 }, { min: 2.2, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 1.8 }, { min: 1.5, max: 2.4 }, { min: 1.9, max: 4.6 }, { min: 3.2, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3.5 }, { min: 1.1, max: 40 }, { min: 2, max: 40 }, { min: 3, max: 40 }, { min: 4, max: COLLECTION_ZOOM_MAX }],
        ],
        showPaperNodeLabelAtZoomLevel: { min: 7, max: MAX_ZOOM },// paper's Authors & Year
        showPaperNodeSubLabelAtZoomLevel: { min: 10, max: MAX_ZOOM },// paper's 2 lines title
        showGroupingLinkLinesAtZoomLevel: { min: 0, max: MAX_ZOOM },//edges visibility
      },
    }
  },
  [ConfigId.MEDIUM]: {
    contourLines: {
      CONTOURS_KEY_GRADIENT_COLORS: [
        '#bcbf89', '#D7D49C',
        '#F4BB6D', 
        '#e0b178',
        '#867368',
        '#B89E8E', '#cebbaf', '#e3d8d1', 
        '#F9F5F2',
        '#F9F5F2',
      ],
      populateNeighborsStep: 5,
      contouringBandwidth: 10,
      contouringThresholds: 220,
    },
    zoom: {
      MAX_ZOOM: 60,
      COLLECTION_ZOOM_MIN: 0.2,
      COLLECTION_ZOOM_MAX: 7,
      ZOOM_CONFIG: {
        collectionZoom: [//by max graph level
          [],//ignore 0 index
          [null, { min: COLLECTION_ZOOM_MIN, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 4 }, { min: 2.5, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3 }, { min: 1.8, max: 4 }, { min: 2.2, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 1.8 }, { min: 1.5, max: 2.4 }, { min: 1.9, max: 4.6 }, { min: 3.2, max: COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3.5 }, { min: 1.1, max: 40 }, { min: 2, max: 40 }, { min: 3, max: 40 }, { min: 4, max: COLLECTION_ZOOM_MAX }],
        ],
        showPaperNodeLabelAtZoomLevel: { min: 10, max: MAX_ZOOM },// paper's Authors & Year
        showPaperNodeSubLabelAtZoomLevel: { min: MAX_ZOOM, max: MAX_ZOOM },// paper's 2 lines title
        showGroupingLinkLinesAtZoomLevel: { min: 0, max: MAX_ZOOM },//edges visibility
      },
    }
  },
};

const selectedConfigId: ConfigId = (CONFIG_ID && Object.values(ConfigId).includes(CONFIG_ID as ConfigId)) ? CONFIG_ID as ConfigId : ConfigId.MEDIUM;
const config = configs[selectedConfigId];
console.log('Using config ID:', CONFIG_ID, 'selected config ID', selectedConfigId,'current config:\n', JSON.stringify(config, null, 4));

export default config;

