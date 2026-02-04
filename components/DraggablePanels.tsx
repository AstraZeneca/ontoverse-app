import { useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import FilterPanel from "./filter/FilterPanel";
import PaperDetailsPanel from "./NodeDetailsPanels/PaperDetailsPanel";
import { BranchNodeByD3, PaperNodeType } from "@/model/GraphDataModel";
import { CloneChipsToggle } from "./cloneChipsToggle/CloneChipsToggle";
import DragHandleIcon from "@mui/icons-material/DragHandle";


const MIN_HEIGHT_PERCENT = 25;

interface DraggablePanelsProps {
  paperDetailsProps?: { d: PaperNodeType };
  clonesSelection?: BranchNodeByD3[] | undefined;
}

const DraggablePanels = ({ paperDetailsProps, clonesSelection }: DraggablePanelsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterHeightPercent, setFilterHeightPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state

  const handleDrag = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.offsetHeight;
    const y = e.clientY - containerRef.current.getBoundingClientRect().top;
    let newPercent = (y / containerHeight) * 100;
    newPercent = Math.max(MIN_HEIGHT_PERCENT, Math.min(100 - MIN_HEIGHT_PERCENT, newPercent));
    setFilterHeightPercent(newPercent);
  };

  const handleMouseDown = () => {
    setIsDragging(true); // Set dragging state to true
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener(
      "mouseup",
      () => {
        setIsDragging(false); // Reset dragging state
        window.removeEventListener("mousemove", handleDrag);
      },
      { once: true }
    );
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: `${filterHeightPercent}%`,
          minHeight: "25%",
          overflow: isDragging ? "hidden" : "auto", // Disable scrolling while dragging
        }}
      >
        <FilterPanel />
      </Box>
      <Divider
        sx={{
          cursor: "row-resize",
          height: "16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={handleMouseDown}
      >
        <DragHandleIcon sx={{ color: "#888", paddingTop: "6px", height: "32px" }} />
      </Divider>
      <Box sx={{ height: `${100 - filterHeightPercent}%`, minHeight: "25%", overflow: "auto" }}>
        {paperDetailsProps && <PaperDetailsPanel {...paperDetailsProps} />}
        <CloneChipsToggle clonesSelection={clonesSelection ?? []} />
      </Box>
    </Box>
  );
};

export default DraggablePanels;