import request from "../utils/request";

export const ADD_LOG_SUCCESS = "ADD_LOG_SUCCESS";
export const ADD_LOG_ERROR = "ADD_LOG_ERROR";
export const GET_LOG_LIST_SUCCESS = "GET_LOG_LIST_SUCCESS";
export const GET_LOG_LIST_ERROR = "GET_LOG_LIST_ERROR";

export const addLog =
  ({
    timestamp,
    username,
    event,
  }: {
    timestamp: string;
    username: string;
    event: string;
  }) =>
  async (dispatch: Function) => {
    const requestURL = "/LogService/addLog";
    const logData = { timestamp, username, event };
    try {
      const { data: responseData } = await request.post(requestURL, logData);

      dispatch({ type: ADD_LOG_SUCCESS, data: responseData });
      //    alert("日志添加成功");
    } catch (error: any) {
      console.error(error);
      dispatch({ type: ADD_LOG_ERROR, error: error.message });
      console.log(error.message);
    }
  };

export const getLogList = () => async (dispatch: Function) => {
  const requestURL = "LogService/getLogList";
  try {
    const { data: responseData } = await request.get(requestURL);
    dispatch({ type: GET_LOG_LIST_SUCCESS, data: responseData.logs });
  } catch (error: any) {
    console.error(error);
    dispatch({ type: GET_LOG_LIST_ERROR, error: error.message });
    console.log(error.message);
  }
};

export const generateLog = (
  timestamp: string,
  username: string,
  logEvent: string
) => {
  return { timestamp, username, event: logEvent };
};
