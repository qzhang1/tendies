import React from "react";
import { Typography, Link } from "@material-ui/core";

export default function Copyright({ msg }) {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © ".concat(msg, " ")}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
