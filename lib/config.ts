import { getConfigId } from "./env";

export enum ConfigId {
  MINI = 'MINI',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
}

export interface Config {
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
      showItemNodeLabelAtZoomLevel: { min: number; max: number };
      showItemNodeSubLabelAtZoomLevel: { min: number; max: number };
      showGroupingLinkLinesAtZoomLevel: { min: number; max: number };
      /** When set, shifts item sub-label (title) lines downward to reduce overlap. */
      nodeLabelDY?: number;
    };
  };
}

const MAX_ZOOM = 60;
const COLLECTION_ZOOM_MIN = 0.2;

/** Tiny graphs (e.g. SOP KG): labels visible from near default zoom. */
const MINI_COLLECTION_ZOOM_MAX = 4;

const configs: Record<ConfigId, Config> = {
  [ConfigId.MINI]: {
    contourLines: {
      populateNeighborsStep: 12,
      contouringBandwidth: 40,
      contouringThresholds: 180,
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
      COLLECTION_ZOOM_MAX: MINI_COLLECTION_ZOOM_MAX,
      ZOOM_CONFIG: {
        collectionZoom: [
          [],
          [null, { min: COLLECTION_ZOOM_MIN, max: MINI_COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: MINI_COLLECTION_ZOOM_MAX }, { min: 0.35, max: MINI_COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 2 }, { min: 0.35, max: 2.5 }, { min: 0.5, max: MINI_COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 1.5 }, { min: 0.35, max: 1.8 }, { min: 0.5, max: 2.5 }, { min: 0.8, max: MINI_COLLECTION_ZOOM_MAX }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3.5 }, { min: 0.35, max: 40 }, { min: 0.5, max: 40 }, { min: 0.8, max: 40 }, { min: 1, max: MINI_COLLECTION_ZOOM_MAX }],
        ],
        showItemNodeLabelAtZoomLevel: { min: 0.35, max: MAX_ZOOM },
        showItemNodeSubLabelAtZoomLevel: { min: 0.5, max: MAX_ZOOM },
        showGroupingLinkLinesAtZoomLevel: { min: 0, max: MAX_ZOOM },
        nodeLabelDY: 12,
      },
    },
  },
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
      COLLECTION_ZOOM_MAX: 7,
      ZOOM_CONFIG: {
        collectionZoom: [
          [],
          [null, { min: COLLECTION_ZOOM_MIN, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 7 }, { min: 2.5, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3 }, { min: 1.8, max: 4 }, { min: 2.2, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 1.8 }, { min: 1.5, max: 2.4 }, { min: 1.9, max: 4.6 }, { min: 3.2, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3.5 }, { min: 1.1, max: 40 }, { min: 2, max: 40 }, { min: 3, max: 40 }, { min: 4, max: 7 }],
        ],
        showItemNodeLabelAtZoomLevel: { min: 7, max: MAX_ZOOM },
        showItemNodeSubLabelAtZoomLevel: { min: 10, max: MAX_ZOOM },
        showGroupingLinkLinesAtZoomLevel: { min: 0, max: MAX_ZOOM },
      },
    },
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
        collectionZoom: [
          [],
          [null, { min: COLLECTION_ZOOM_MIN, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 4 }, { min: 2.5, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3 }, { min: 1.8, max: 4 }, { min: 2.2, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 1.8 }, { min: 1.5, max: 2.4 }, { min: 1.9, max: 4.6 }, { min: 3.2, max: 7 }],
          [null, { min: COLLECTION_ZOOM_MIN, max: 3.5 }, { min: 1.1, max: 40 }, { min: 2, max: 40 }, { min: 3, max: 40 }, { min: 4, max: 7 }],
        ],
        showItemNodeLabelAtZoomLevel: { min: 10, max: MAX_ZOOM },
        showItemNodeSubLabelAtZoomLevel: { min: MAX_ZOOM, max: MAX_ZOOM },
        showGroupingLinkLinesAtZoomLevel: { min: 0, max: MAX_ZOOM },
      },
    },
  },
};

function resolveConfigId(): ConfigId {
  const configId = getConfigId();
  return Object.values(ConfigId).includes(configId as ConfigId)
    ? (configId as ConfigId)
    : ConfigId.MEDIUM;
}

let cachedConfig: Config | undefined;

export function getAppConfig(): Config {
  if (!cachedConfig) {
    const selectedConfigId = resolveConfigId();
    cachedConfig = configs[selectedConfigId];
    console.log('Using config ID:', getConfigId(), 'selected config ID:', selectedConfigId);
  }
  return cachedConfig;
}

const configProxy = new Proxy({} as Config, {
  get(_target, prop: string) {
    return getAppConfig()[prop as keyof Config];
  },
});

export default configProxy;
