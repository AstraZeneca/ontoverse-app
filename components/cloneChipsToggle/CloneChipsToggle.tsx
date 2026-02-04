import { BranchNodeByD3 } from "@/model/GraphDataModel";
import { Box, Chip, Tooltip } from "@mui/material";
import { getCloneTopicTreePath } from "@/lib/utils/treeUtils";
import { useSelectStore } from "@/model/store/useSelection";

interface CloneChipsToggleProps {
  clonesSelection: BranchNodeByD3[];
}

export const CloneChipsToggle = ({
  clonesSelection,
}: CloneChipsToggleProps) => {
  const selectedChip = useSelectStore((state) => state.selectedChipClone);
  const toggleChipCloneSelection = useSelectStore(
    (state) => state.toggleChipCloneSelection
  );

  if (clonesSelection?.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {clonesSelection?.map((nodeD3: BranchNodeByD3) => {
        const { id } = nodeD3.data;
        const selected = selectedChip?.data.id === id;
        return (
          <li key={id} style={{ margin: "2px" }}>
            <Tooltip title={getCloneTopicTreePath(nodeD3)}>
              <Chip
                variant={selected ? "filled" : "outlined"}
                style={{ height: "100%" }}
                size="small"
                label={nodeD3.parent.data.title}
                color="secondary"
                onClick={() => {
                  toggleChipCloneSelection(nodeD3);
                }}
              />
            </Tooltip>
          </li>
        );
      })}
    </Box>
  );
};
