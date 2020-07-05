import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import StockChart from "./StockChart";

const Portfolio = () => {
  const providers = useSelector((state) => state.dataProviders);
  const dashboards = useSelector((state) => state.dashboards);
  const dashAggregates = dashboards.map((d) => {
    const matchingProvider = providers.filter(
      (p) => p.providerName === d.provider
    )[0];
    return {
      ...d,
      providerInfo: matchingProvider,
    };
  });

  return (
    <React.Fragment>
      {dashboards && dashboards.length > 0 ? (
        <GridList cellHeight={580} cols={2}>
          {dashAggregates.map((da, idx) => (
            <GridListTile key={idx} cols={1}>
              <StockChart DashInfo={da} />
            </GridListTile>
          ))}
        </GridList>
      ) : (
        <div>No Dashboards to display...</div>
      )}
    </React.Fragment>
  );
};

export default Portfolio;
