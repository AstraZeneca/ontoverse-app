import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { GRAPH_CONFIG } from "./graphs/GraphConfig";
import { useZoomStore } from "@/model/store/zoomStore";
import { zoomTheMap } from "./graphs/hierarchy/utils/zoomUtils";
import { useEffect, useState } from "react";


export default function ZoomSlider() {
  const { zoomLevel } = useZoomStore();
  const [sliderValue, setSliderValue] = useState<number>(zoomLevel);
  const step = 0.1;

  const clampZoom = (value: number) => {
    return Math.min(GRAPH_CONFIG.maxZoom, Math.max(GRAPH_CONFIG.minZoom, value));
  };

  const applyZoom = (value: number) => {
    const val = Number(clampZoom(value).toFixed(4));
    setSliderValue(val);
    zoomTheMap(val);
  };

  const handleZoomIn = () => {
    applyZoom(sliderValue + step);
  };

  const handleZoomOut = () => {
    applyZoom(sliderValue - step);
  };

  useEffect(() => {
    setSliderValue(Number(zoomLevel.toFixed(4)));
  }, [zoomLevel]);

  return (
    <Stack sx={{ height: 96 }} spacing={1} direction="column">
      <IconButton
        aria-label="zoom in"
        onClick={handleZoomIn}
        sx={{
          bgcolor: "#121212",
          color: "#fff",
          border: "1px solid #2a2a2a",
          "&:hover": { bgcolor: "#1e1e1e" },
        }}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        aria-label="zoom out"
        onClick={handleZoomOut}
        sx={{
          bgcolor: "#121212",
          color: "#fff",
          border: "1px solid #2a2a2a",
          "&:hover": { bgcolor: "#1e1e1e" },
        }}
      >
        <RemoveIcon />
      </IconButton>
    </Stack>
  );
}