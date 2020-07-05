import { combineReducers } from "redux";
import {
  ADD_PROVIDER,
  DELETE_PROVIDER,
  UPDATE_PROVIDER,
  CHANGE_CURRENT_THEME,
  ADD_DASHBOARD,
} from "../actions/actionTypes";
import Providers from "../globals/providers";

// try to keep data and ui state separate

const dataProviders = (state = [], action) => {
  switch (action.type) {
    case ADD_PROVIDER:
      return [...state, action.payload];
    case DELETE_PROVIDER:
      let dataSourceToDelete = state.findIndex((v) => v.url === action.payload);
      let remainingState = [...state];
      if (dataSourceToDelete >= 0) {
        remainingState = remainingState.splice(dataSourceToDelete, 1);
      }
      return remainingState;
    case UPDATE_PROVIDER:
      let dataSourceToUpdate = state.findIndex((v) => v.url === action.payload);
      let updatedState = [...state];
      if (dataSourceToUpdate >= 0) {
        updatedState[dataSourceToUpdate] = action.payload;
      }
      return updatedState;
    default:
      return state;
  }
};

const dashboards = (state = [], action) => {
  switch (action.type) {
    case ADD_DASHBOARD:
      return [...state, action.payload];
    default:
      return state;
  }
};

/**
 * Reducer for CurrentTheme UI State
 * @param {string} state Options are "light" or "dark"
 * @param {object} action type contains the action type and payload contains the desired theme
 */
const currentTheme = (state = "dark", action) => {
  if (action.type === CHANGE_CURRENT_THEME && state !== action.payload) {
    return action.payload;
  } else {
    return state;
  }
};

export default combineReducers({
  dataProviders,
  dashboards,
});
