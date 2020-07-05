import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Button,
  makeStyles,
  MenuItem,
  Select,
  DialogActions,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ADD_PROVIDER } from "../../actions/actionTypes";
import Providers from "../../globals/providers";
import ToasterConfig from "../../globals/toasterConfig";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {},
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const providerSchema = Yup.object().shape({
  providerName: Yup.string().required("Required"),
  provider: Yup.string().required("Required"),
  apiKey: Yup.string().required("Required"),
});

export default function AddProvider() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const existingProviders = useSelector((state) => state.dataProviders);
  const initialValues = {
    providerName: "",
    provider: "",
    apiKey: "",
  };
  const providers = Object.keys(Providers);

  const onSubmitHandler = useCallback(
    ({ providerName, provider, apiKey }) => {
      setOpen(false);
      dispatch({
        type: ADD_PROVIDER,
        payload: {
          providerName,
          provider,
          apiKey,
          ...Providers[provider],
          currentRequests: 0,
        },
      });
    },
    [dispatch]
  );
  const customSubmitHandler = (fields, { resetForm }) => {
    const isSupportedProvider = providers.some((p) => p === fields.provider);

    const isUniqueProviderName = existingProviders.every(
      (p) => p.providerName !== fields.providerName
    );

    if (isSupportedProvider && isUniqueProviderName) {
      onSubmitHandler(fields);
      resetForm({ provider: "", apiKey: "" });
    } else if (!isUniqueProviderName) {
      toast.error(
        `provider name, ${fields.providerName}, is not unique`,
        ToasterConfig
      );
    } else {
      toast.error(
        `${
          fields.provider
        } is not one of the supported providers (${providers.join(",")})`,
        ToasterConfig
      );
    }
  };

  return (
    <React.Fragment>
      <Fab color="primary" onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>
      <Formik
        initialValues={initialValues}
        onSubmit={customSubmitHandler}
        validationSchema={providerSchema}
      >
        {(props) => {
          const {
            values: { providerName, provider, apiKey },
            touched,
            errors,
            handleChange,
            handleSubmit,
            isValid,
          } = props;

          const providerOptionItems = providers.map((p) => (
            <MenuItem key={p} value={p}>
              <Typography variant="body1">{p}</Typography>
            </MenuItem>
          ));
          providerOptionItems.unshift(
            <MenuItem value="" disabled key="default">
              Select a provider
            </MenuItem>
          );

          return (
            <form>
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle id="add-provider-title">Add Provider</DialogTitle>
                <DialogContent>
                  <TextField
                    id="providerName"
                    name="providerName"
                    label="Provider name (unique name for instance of provider)"
                    error={touched.providerName && Boolean(errors.providerName)}
                    margin="normal"
                    fullWidth
                    onChange={handleChange}
                    value={providerName}
                  />
                  <Select
                    id="provider"
                    name="provider"
                    value={provider}
                    error={touched.provider && Boolean(errors.provider)}
                    fullWidth
                    displayEmpty
                    className={classes.selectEmpty}
                    onChange={handleChange}
                  >
                    {providerOptionItems}
                  </Select>
                  <TextField
                    id="apiKey"
                    name="apiKey"
                    label="Key"
                    error={touched.apiKey && Boolean(errors.apiKey)}
                    margin="normal"
                    fullWidth
                    onChange={handleChange}
                    value={apiKey}
                    style={{ marginTop: 0 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!isValid}
                    onClick={handleSubmit}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          );
        }}
      </Formik>
    </React.Fragment>
  );
}
