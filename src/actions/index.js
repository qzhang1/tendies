import {
  ADD_PROVIDER,
  DELETE_PROVIDER,
  UPDATE_PROVIDER,
  ADD_DASHBOARD,
  DELETE_DASHBOARD,
} from "./actionTypes";
import axios from "axios";

export const AddProvider = (formInputs) => {
  return {
    action: ADD_PROVIDER,
    payload: formInputs,
  };
};

export const addDashboard = (dashboardInfo) => {
  return {
    action: ADD_DASHBOARD,
    payload: dashboardInfo,
  };
};

export const deleteDashboard = (dashboardInfo) => {
  return {
    action: DELETE_DASHBOARD,
    payload: dashboardInfo.id,
  };
};
