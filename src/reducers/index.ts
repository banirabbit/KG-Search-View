import { combineReducers } from "redux";
import graphProjectReducer from "./graphProjectManage";


export default combineReducers({
  graphProject: graphProjectReducer,
});
