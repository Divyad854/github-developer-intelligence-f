
import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import auth from "./authSlice";
import github from "./githubSlice";
import comparison from "./comparisonSlice";
import savedProfiles from "./savedProfilesSlice";

const appReducer = combineReducers({ auth, github, comparison, savedProfiles });

/**
 * On logout (and on every new login), reset EVERY slice (reports, saved profiles, comparison...),
 * so the next account never sees the previous account's data.
 */
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === "auth/logout/fulfilled" || action.type === "auth/login/fulfilled") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];