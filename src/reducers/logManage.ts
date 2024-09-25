import * as actions from "../actions/logManageAction";

const initialState = {
  logs: [],
  addLogResult: null,
  error: null,
};

export default function logManageReducer(state = initialState, action: any) {
  const { type, data } = action;
  switch (type) {
    case actions.GET_LOG_LIST_SUCCESS:
      return {
        ...state,
        logs: data,
        error: null,
      };
    case actions.GET_LOG_LIST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case actions.ADD_LOG_SUCCESS:
      return {
        ...state,
        addLogResult: "Log added successfully",
        error: null,
      };
    case actions.ADD_LOG_ERROR:
      return {
        ...state,
        addLogResult: null,
        error: action.error,
      };
    default:
      return state;
  }
}
