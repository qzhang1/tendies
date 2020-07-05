import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  makeStyles,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { ADD_DASHBOARD } from "../../actions/actionTypes";
import GenerateUUIDv4 from "../../globals/guid";

const useStyles = makeStyles((theme) => ({
  fabButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  providerSelector: {
    marginTop: theme.spacing(2),
  },
}));

const dashboardSchema = Yup.object().shape({
  ticker: Yup.string().required("Select a Ticker"),
});

const AddDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tickers, setTickers] = useState([]);
  const [open, setOpen] = useState(false);
  const providers = useSelector((state) => state.dataProviders);
  const guidId = GenerateUUIDv4();
  const initialValues = {
    ticker: "",
    provider: "",
  };

  useEffect(() => {
    const getTickers = async () => {
      const response = await axios.get(
        "http://localhost:8000/ticker/alltickers/"
      );
      const tickers = response.data.map((t) => ({
        company: t.company,
        ticker: t.symbol,
      }));
      setTickers(tickers);
    };

    getTickers();
  }, []);

  const openHandler = () => {
    setOpen(true);
  };

  const dispatchHandler = useCallback(
    (ticker, provider) =>
      dispatch({
        type: ADD_DASHBOARD,
        payload: {
          ticker,
          provider,
          id: guidId,
        },
      }),
    [dispatch]
  );

  const submitHandler = (fields, { resetForm }) => {
    const { ticker, provider } = fields;
    dispatchHandler(ticker, provider);
    resetForm({});
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Fab color="primary" className={classes.fabButton} onClick={openHandler}>
        <AddIcon className={classes.addIcon} />
      </Fab>

      <Formik
        initialValues={initialValues}
        validationSchema={dashboardSchema}
        onSubmit={submitHandler}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            isValid,
            setFieldValue,
          } = props;

          const providerOptionItems = providers.map((p) => (
            <MenuItem key={p.providerName} value={p.providerName}>
              <Typography variant="body1">{p.providerName}</Typography>
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
                <DialogTitle id="add-dashboard-title">
                  Add Dashboard
                </DialogTitle>
                <DialogContent>
                  <Autocomplete
                    options={tickers}
                    getOptionLabel={(option) => option.company}
                    onChange={(e, value) => {
                      setFieldValue("ticker", value.ticker);
                    }}
                    renderOption={(option) => (
                      <React.Fragment>
                        <span>{option.company}</span>
                        {" - "}({option.ticker})
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="ticker"
                        name="ticker"
                        label="Add Ticker"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    style={{ width: 500 }}
                  />
                  <Select
                    variant="outlined"
                    className={classes.providerSelector}
                    id="provider"
                    name="provider"
                    value={values.provider}
                    fullWidth
                    displayEmpty
                    onChange={handleChange}
                  >
                    {providerOptionItems}
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
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
};

export default AddDashboard;
