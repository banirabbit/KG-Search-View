import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers";
import logManageReducer from "../reducers/logManage";

type initState = ReturnType<typeof rootReducer>;
type LogManageState = ReturnType<typeof logManageReducer>;

// 在 AppState 中替换 logManage 的类型为 LogManageState
export type AppState = Omit<initState, "logManage"> & {
  logManage: LogManageState;
};

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
