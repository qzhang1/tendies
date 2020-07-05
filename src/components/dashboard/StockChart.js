import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  Paper,
  makeStyles,
  Grid,
  IconButton,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import HighlightOff from "@material-ui/icons/HighlightOff";
import axios from "axios";
import plotly from "plotly.js";
import createPlotComponent from "react-plotly.js/factory";
import { toast } from "react-toastify";
import ToasterConfig from "../../globals/toasterConfig";
import { DELETE_DASHBOARD } from "../../actions/actionTypes";

const Plot = createPlotComponent(plotly);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    minHeight: 500,
  },
  alerts: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const StockChart = ({ DashInfo }) => {
  const classes = useStyles();
  const baseUrl = "http://localhost:8000/marketdata/";
  const intervals = {
    live: null,
    Daily: "lookback=5",
    Weekly: "lookback=30",
    Monthly: "lookback=90",
    Yearly: "lookback=365",
    MultiYear: "lookback=1825",
  };
  // providers are only used when getting live data
  const { ticker, provider, id, providerInfo } = DashInfo;
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("Weekly");
  const [currentData, setCurrentData] = useState();

  const dispatch = useDispatch();
  const deleteHandler = useCallback(() =>
    dispatch({
      type: DELETE_DASHBOARD,
      payload: id,
    })
  );
  useEffect(() => {
    const getMarketData = async () => {
      setHasError(false);
      setErrMsg("");
      const pathname = refreshInterval === "today" ? "live" : "daily";
      const defaultQueryParams = new URLSearchParams([
        ["order", "ascending"],
        ["limit", 1000000],
      ]);
      const dataSourceUrl = new URL(
        pathname.concat(
          "/",
          ticker,
          "?",
          intervals[refreshInterval],
          "&",
          defaultQueryParams.toString()
        ),
        baseUrl
      );
      try {
        const response = await axios.get(dataSourceUrl);

        const traces = [];
        const candlestick = {
          x: response.data.map((md) => md.quote_dt),
          close: response.data.map((md) => md.close),
          decreasing: { line: { color: "#7F7F7F" } },
          high: response.data.map((md) => md.high),
          increasing: { line: { color: "#17BECF" } },
          low: response.data.map((md) => md.low),
          open: response.data.map((md) => md.open),
          type: "candlestick",
          xaxis: "x",
          yaxis: "y",
          name: "candlestick",
        };
        const closingLine = {
          x: response.data.map((md) => md.quote_dt),
          y: response.data.map((md) => md.close),
          name: "closing price",
          type: "scatter",
        };
        traces.push(candlestick);
        traces.push(closingLine);
        setCurrentData(traces);
      } catch (err) {
        let details =
          "Unexpected error while retrieving market data. Details: " + err;
        setHasError(true);
        setErrMsg(details);
      }
    };

    getMarketData();
  }, [refreshInterval]);

  var layout = {
    title: `<b>${ticker}</b>`,
    margin: {
      r: 10,
      t: 25,
      b: 40,
      l: 60,
    },
    showlegend: false,
    xaxis: {
      autorange: true,
      domain: [0, 1],
      type: "date",
      rangeslider: {
        visible: false,
      },
    },
    yaxis: {
      autorange: true,
      domain: [0, 1],
      type: "linear",
    },
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      xanchor: "right",
    },
  };

  const alertError = () => {
    if (errMsg.length > 0) {
      toast.error(errMsg, ToasterConfig);
    }
  };
  return (
    <React.Fragment>
      {hasError && alertError()}
      <Paper className={classes.paper} elevation={2} border={1}>
        {currentData ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              alignItems="flex-start"
              justify="flex-end"
              direction="row"
            >
              <IconButton onClick={deleteHandler} aria-label="delete dashboard">
                <HighlightOff />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Plot data={currentData} layout={layout} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <ToggleButtonGroup
                value={refreshInterval}
                exclusive
                onChange={(event, newRefresh) => setRefreshInterval(newRefresh)}
                aria-label="refresh interval"
              >
                <ToggleButton value="live" disabled>
                  Live
                </ToggleButton>
                <ToggleButton value="Daily">Daily</ToggleButton>
                <ToggleButton value="Weekly">Weekly</ToggleButton>
                <ToggleButton value="Monthly">Monthly</ToggleButton>
                <ToggleButton value="Yearly">Yearly</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        ) : (
          <Backdrop>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default StockChart;
