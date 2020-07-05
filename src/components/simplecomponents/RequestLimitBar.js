import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, LinearProgress } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  requestPercentage: {
    marginTop: "20px",
  },
});

function LinearProgressWithLabel(props) {
  const { provider, providerName } = props;
  const classes = useStyles();

  const label = `${providerName} (${provider})`;
  return (
    <Box display="flex" alignItems="center">
      <Box width="95%" mr={1}>
        <Typography variant="body2">{label}</Typography>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography
          className={classes.requestPercentage}
          variant="body2"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function RequestLimitBar({
  requestLimit,
  currentRequests,
  providerName,
  provider,
}) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(
    (1 - currentRequests / requestLimit) * 100
  );

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel
        value={progress}
        providerName={providerName}
        provider={provider}
      />
    </div>
  );
}
