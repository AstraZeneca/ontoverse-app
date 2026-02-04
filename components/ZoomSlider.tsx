import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { GRAPH_CONFIG } from "./graphs/GraphConfig";
import { useZoomStore } from "@/model/store/zoomStore";
import { zoomTheMap } from "./graphs/hierarchy/utils/zoomUtils";
import { useEffect, useState } from "react";


export default function ZoomSlider() {

  const { zoomLevel} = useZoomStore();
  const [sliderValue, setSliderValue] = useState<number>(zoomLevel);
  // console.log('ZoomSlider > zoomLevel',zoomLevel);

  const handleSliderChange = (event: Event, newSliderValue: number | number[]) => {
    const val = Number((newSliderValue as number).toFixed(4))
    // console.log('ZoomSlider > handleSliderChange > newSliderValue',val);

    setSliderValue(val);
    zoomTheMap(val);
  };

  useEffect(() => {
    setSliderValue(Number(zoomLevel.toFixed(4)))

  }, [zoomLevel]);

  return (
    <Stack sx={{ height: 300 }} spacing={1} direction="row-reverse">
      <Slider
        sx={{ ml: 10 }}
        aria-label="Zoom Level"
        orientation="vertical"
        valueLabelDisplay='auto'//'off'//"auto"
        // marks={marks}
        min={GRAPH_CONFIG.minZoom}
        max={GRAPH_CONFIG.maxZoom}
        value={sliderValue}
        step={0.1}
        onChange={handleSliderChange}
      />
    </Stack>
  );
}