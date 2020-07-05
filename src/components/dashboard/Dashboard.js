import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { orange, blue, deepPurple, deepOrange } from "@material-ui/core/colors";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import NightIcon from "@material-ui/icons/NightsStay";
import SunIcon from "@material-ui/icons/Brightness5";
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Switch,
} from "@material-ui/core";

// CUSTOM COMPONENTS
import { mainListItems } from "../simplecomponents/listItems";
import AddDashboard from "./AddDashboard";
import ProviderRequestLimits from "./ProviderRequestLimits";
import Portfolio from "./Portfolio";
import NewsFeed from "../simplecomponents/NewsFeed";
import { CHANGE_CURRENT_THEME } from "../../actions/actionTypes";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  fabButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  addIcon: {
    alignSelf: "right",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  minHeight: {
    minHeight: 250,
  },
  tabPanel: {
    marginTop: theme.spacing(3),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const darkMode = useSelector((state) => state.isDarkMode);
  const [tabValue, setTabValue] = useState(0);
  const minHeightPaper = clsx(classes.paper, classes.minHeight);

  const darkModeHandler = useCallback(
    () =>
      dispatch({
        type: CHANGE_CURRENT_THEME,
        payload: !darkMode,
      }),
    [dispatch]
  );
  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? orange[500] : blue[800],
      },
      secondary: {
        main: darkMode ? deepOrange[900] : deepPurple[500],
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Tendies
            </Typography>
            {!darkMode ? (
              <IconButton onClick={darkModeHandler}>
                <NightIcon />
              </IconButton>
            ) : (
              <IconButton onClick={darkModeHandler}>
                <SunIcon />
              </IconButton>
            )}
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
        </Drawer>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                {/* <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Paper className={minHeightPaper}>
                    <ProviderRequestLimits />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Paper className={minHeightPaper}>
                    <AddProvider />
                  </Paper>
                </Grid>
              </Grid> */}
                <Paper className={minHeightPaper} style={{ height: "100%" }}>
                  <AppBar position="static">
                    <Tabs
                      centered
                      value={tabValue}
                      onChange={(event, newValue) => setTabValue(newValue)}
                      aria-label="simple tabs"
                    >
                      <Tab label="Indices" {...a11yProps(0)} />
                      <Tab label="Notification(s)" {...a11yProps(1)} />
                      <Tab label="Provider(s)" {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel
                    className={classes.tabPanel}
                    value={tabValue}
                    index={0}
                  >
                    <h2>Major Indices Placeholder</h2>
                  </TabPanel>
                  <TabPanel
                    className={classes.tabPanel}
                    value={tabValue}
                    index={1}
                  >
                    <h2>Notifications Placeholder</h2>
                  </TabPanel>
                  <TabPanel
                    className={classes.tabPanel}
                    value={tabValue}
                    index={2}
                    style={{ height: "100%" }}
                  >
                    <ProviderRequestLimits />
                  </TabPanel>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6} style={{ height: 570 }}>
                <Paper className={minHeightPaper} style={{ height: "100%" }}>
                  {/* <NewsFeed /> */}
                </Paper>
              </Grid>

              {/* Chart */}
              <Grid item xs={12} md={12} lg={12}>
                <Portfolio />
              </Grid>
            </Grid>

            <AddDashboard />
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}
