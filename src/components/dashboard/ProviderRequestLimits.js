import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import Title from "../simplecomponents/Title";
import RequestLimitBar from "../simplecomponents/RequestLimitBar";
import AddProvider from "./AddProvider";

export default function ProviderRequestLimits() {
  // const [isOpen, setIsOpen] = useState(false);
  const providers = useSelector((state) => state.dataProviders);
  return (
    <React.Fragment>
      <Title>Requests Remaining</Title>
      {providers.length <= 0 ? (
        <h3>Nothing to see here...</h3>
      ) : (
        <Grid container spacing={1}>
          {providers.map((p) => (
            <Grid item xs={12}>
              <RequestLimitBar
                key={p.providerName}
                requestLimit={p.rateLimit}
                currentRequests={p.currentRequests}
                providerName={p.providerName}
                provider={p.provider}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Grid
        container
        justify="flex-end"
        alignItems="flex-end"
        style={{ marginTop: 20 }}
      >
        <AddProvider />
      </Grid>
    </React.Fragment>
  );
}
