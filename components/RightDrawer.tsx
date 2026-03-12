import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GraphContainer from "./graphs/GraphContainer";
import ZoomSlider from "./ZoomSlider";
import { More, DoneAll, Check } from "@mui/icons-material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import AppTopBar from "./layout/AppTopBar";
import MainContainer from "./layout/MainContainer";
import DrawerHeader, { DRAWER_WIDTH } from "./layout/DrawerHeader";
import Logo from "./Logo";
import ChatAssistant from "./ChatAssistant";
import { Modal } from "@mui/material";
import { PaperNodeType } from "@/model/GraphDataModel";
import { useEffect, useState, Suspense } from "react";
import { useSelection } from "@/lib/state/SelectionProvider";
import { useSelectStore } from "@/model/store/useSelection";
import DraggablePanels from "./DraggablePanels";

export default function RightDrawer() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [chatAssistantOpen, setChatAssistantOpen] = useState(false);
  // const [zoomLevel, setZoomLevel] = useState(GRAPH_CONFIG.defaultZoom);
  const { state: nodesSelection } = useSelection();
  const { lastSelectedNodeData, clonesSelection } = nodesSelection;
  const multiSelect = useSelectStore((state) => state.multiSelect);

  // console.log('RightDrawer >  nodeSelection:',{lastSelectedNodeData, itemsSelectionIds});

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleSettingsPanelOpen = () => {
    setSettingsPanelOpen(true);
  };

  const handleSettingsPanelClose = () => {
    setSettingsPanelOpen(false);
  };

  const handleChatAssistantClose = () => {
    setChatAssistantOpen(false);
  };

  /**
   *
   * Selection change from either the graph or the filter panel
   */
  useEffect(() => {
    // console.log('RightDrawer >> useEffect > nodesSelection',nodesSelection);

    if (!drawerOpen && lastSelectedNodeData !== undefined) {
      setDrawerOpen(true);
    }
  }, [nodesSelection.lastSelectedNodeData]);

  // c

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppTopBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <Logo />
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            
          </Typography>

          {/* <IconButton
            color="inherit"
            aria-label="open chat assistant"
            onClick={handleChatAssistantOpen}
          >
            <SmartToy />
          </IconButton> */}
          <IconButton
            color="inherit"
            aria-label="select mode"

            // sx={{ ...(drawerOpen && { display: 'none' }) }}
          >
            {multiSelect ? <DoneAll /> : <Check />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(drawerOpen && { display: "none" }) }}
          >
            <More />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open settings Panel"
            edge="end"
            onClick={handleSettingsPanelOpen}
            // sx={{ ...(drawerOpen && { display: 'none' }) }}
          >
            <SettingsApplicationsIcon />
          </IconButton>
        </Toolbar>
      </AppTopBar>
      <MainContainer open={drawerOpen} sx={{ p: 0, minHeight: "100vh" }}>
        <DrawerHeader />
        {/* <AppBar /> has fixed position so it overlaps the <Main />. So it utilises <DrawerHeader /> height to move down the <GraphContainer /> */}
        <Suspense fallback={<Typography>Loading graph...</Typography>}>
          <GraphContainer />
        </Suspense>
        <Box
          sx={{
            position: "absolute",
            top: "100px",
            right: drawerOpen ? DRAWER_WIDTH + 20 + "px" : "20px",
          }}
        >
          <ZoomSlider />
        </Box>
      </MainContainer>
      <Drawer
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            overflow: "unset",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
         <DraggablePanels
          paperDetailsProps={
            lastSelectedNodeData &&
            lastSelectedNodeData.data?.id > 0 &&
            !lastSelectedNodeData.data?.grouping
              ? { d: lastSelectedNodeData.data as PaperNodeType }
              : undefined
          }
          clonesSelection={clonesSelection}
        />
        {
          //show details panel here dep. on node type
          // <Box sx={{ overflow: "auto" }}>
          //   {
          //     // console.log("RightDrawer => lastSelectedNodeData",lastSelectedNodeData)
          //   }
          //   {lastSelectedNodeData &&
          //   lastSelectedNodeData.data?.id > 0 &&
          //   lastSelectedNodeData.data?.grouping ? (
          //     <GroupingNodeDetailsPanel
          //       d={lastSelectedNodeData.data as TopicNodeType}
          //     />
          //   ) : null}
          //   {lastSelectedNodeData &&
          //   lastSelectedNodeData.data?.id > 0 &&
          //   !lastSelectedNodeData.data?.grouping ? (
          //     <PaperDetailsPanel
          //       d={lastSelectedNodeData.data as PaperNodeType}
          //     />
          //   ) : null}

          //   <CloneChipsToggle clonesSelection={clonesSelection} />
          // </Box>
        }
      </Drawer>
      <Modal
        open={settingsPanelOpen}
        onClose={handleSettingsPanelClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Settings
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This is a settings Panel.
          </Typography>
        </Box>
      </Modal>
      <ChatAssistant
        open={chatAssistantOpen}
        onClose={handleChatAssistantClose}
      />
    </Box>
  );
}
