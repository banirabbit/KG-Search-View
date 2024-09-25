import request from "../utils/request";

//接口请求方法
export const GET_GRAPH_NODE_SUCCESS = "GET_GRAPH_NODE_SUCCESS";
export const GET_GRAPH_NODE_ERROR = "GET_GRAPH_NODE_ERROR";
export const GET_GRAPH_COUNT_SUCCESS = "GET_GRAPH_COUNT_SUCCESS";
export const GET_GRAPH_COUNT_ERROR = "GET_GRAPH_COUNT_ERROR";
export const GET_GRAPH_URL_SUCCESS = "GET_GRAPH_URL_SUCCESS";
export const GET_GRAPH_URL_ERROR = "GET_GRAPH_URL_ERROR";
export const GET_GRAPHDATA = "GET_GRAPHDATA";
export const GET_NODE_LABELS = "GET_NODE_LABELS";
export const GET_EDGE_LABELS = "GET_EDGE_LABELS";
export const GET_ORIGIN_SEARCH = "GET_ORIGIN_SEARCH";
export const GET_SEARCH = "GET_SEARCH";
export const GET_APPENDNODE = "GET_APPENDNODE";
export const GET_CITYS = "GET_CITYS";
export const GET_EDGE_SEARCH = "GET_EDGE_SEARCH";
export const GET_PATH_SEARCH = "GET_PATH_SEARCH";
export const GET_FUZZY_SEARCH = "GET_FUZZY_SEARCH";
export const GET_RELATION_NUMBER = "GET_RELATION_NUMBER";
export const GET_SCHEMA_COVER = "GET_SCHEMA_COVER";
export const GET_SEARCH_TIME = "GET_SEARCH_TIME";
//非接口请求方法
export const SET_MAPMODEL = "SET_MAPMODEL";
export const GET_LENGTH = "GET_LENGTH";
export const SET_RELA = "SET_RELA";
export const SET_SELECTNODE = "SET_SELECTNODE";
export const SET_SELECTINFO = "SET_SELECTINFO";
export const SET_SELECTEDGE = "SET_SELECTEDGE";
export const SET_LOADING = "SET_LOADING";
export const GET_TOTALNUM = "GET_TOTALNUM";
export const SET_LAYOUT = "SET_LAYOUT";
export const SET_LAYOUTINFO = "SET_LAYOUTINFO";
export const SET_BIGMODEL = "SET_BIGMODEL";
export const SET_FOCUS = "SET_FOCUS";
export const SET_LABEL = "SET_LABEL";
export const SET_RANGE = "SET_RANGE";
export const SET_RES_CHECK = "SET_RES_CHECK";
export const SET_RADIAL_FOCUS_NODE = "SET_RADIAL_FOCUS_NODE";
export const GET_NODE_TYPES_STYLE = "GET_NODE_TYPES_STYLE";
export const GET_EDGE_TYPES_STYLE = "GET_EDGE_TYPES_STYLE";
//操作成功失败消息
export const SET_SUCCESS = "SET_SUCCESS";
export const SET_SUCCESS_OPEN = "SET_SUCCESS_OPEN";
export const SET_FAILURE = "SET_FAILURE";
//使用getGraphNode接口获取知识图谱数据
export const getGraphNode = (nodeName: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getGraphNode?node_name=" + nodeName;
  try {
    dispatch(setLoading(false));
    const response = await request.get(requestURL);
    dispatch({
      type: GET_GRAPH_NODE_SUCCESS,
      data: { nodes: response.data, edges: [] },
    });
    dispatch(setLoading(true));
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
export const getGraphDataByRelations =
  (number: number) => async (dispatch: Function) => {
    const requestURL =
      "/GraphManage/getRelationWithLimit?relation_num=" + number;
    try {
      dispatch(setLoading(false));
      const response = await request.get(requestURL);
      console.log(response.data);
      dispatch({
        type: GET_GRAPH_NODE_SUCCESS,
        data: { nodes: response.data[0], edges: response.data[1] },
      });
      dispatch(setLoading(true));
    } catch (err) {
      dispatch({
        type: SET_FAILURE,
        data: err,
      });
    }
  };
export const searchNodeByName =
  (data: string) => async (dispatch: Function) => {
    const requestURL = "/GraphManage/searchGraphNode?node_name=" + data;
    try {
      const response = await request.get(requestURL);
      console.log("searchGraphNode", response.data);
      dispatch({
        type: GET_FUZZY_SEARCH,
        data: response.data.result,
      });
      dispatch({
        type: GET_SEARCH_TIME,
        data: response.data.using_time,
      })
    } catch (err) {
      dispatch({
        type: SET_FAILURE,
        data: err,
      });
    }
  };
//添加节点
export const updateNodeData = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/createNodeWithObject";
  const jsonData = { props: data };
  try {
    const response = await request.post(requestURL, jsonData);
    if (response.status !== 200) {
      dispatch({
        type: SET_FAILURE,
        data: response.data.message,
      });
    } else {
      dispatch(getGraphDataByRelations(100));
      dispatch({
        type: SET_SUCCESS,
        data: "节点添加成功",
      });
      dispatch({
        type: SET_SUCCESS_OPEN,
        data: true,
      });
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//删除节点
export const deleteNodeById = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/nodeDeleteById?node_id=" + data;
  try {
    const response = await request.get(requestURL);
    if (response.status !== 200) {
      dispatch({
        type: SET_FAILURE,
        data: response.data.message,
      });
    } else {
      dispatch(getGraphDataByRelations(100));
      dispatch({
        type: SET_SUCCESS,
        data: "节点删除成功",
      });
      dispatch({
        type: SET_SUCCESS_OPEN,
        data: true,
      });
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//加入边
export const updateEdgeData = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/addRelationById";
  const jsonData = data;
  try {
    const response = await request.post(requestURL, jsonData);
    if (response.status !== 200) {
      dispatch({
        type: SET_FAILURE,
        data: response.data.message,
      });
    } else {
      dispatch(getGraphDataByRelations(100));
      dispatch({
        type: SET_SUCCESS,
        data: "关系添加成功",
      });
      dispatch({
        type: SET_SUCCESS_OPEN,
        data: true,
      });
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//移除边
export const deleteEdgeData = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/deleteRelationById";
  const jsonData = data;
  try {
    const response = await request.post(requestURL, jsonData);
    console.log(response);
    if (response.status !== 200) {
      dispatch({
        type: SET_FAILURE,
        data: response.data.message,
      });
    } else {
      dispatch(getGraphDataByRelations(100));
      dispatch({
        type: SET_SUCCESS,
        data: "关系删除成功",
      });
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//修改节点信息
export const editNodeInfo = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/setNodePropsById";
  const jsonData = data;
  try {
    const response = await request.post(requestURL, jsonData);
    if (response.status !== 200) {
      dispatch({
        type: SET_FAILURE,
        data: response.data.message,
      });
    } else {
      dispatch(getGraphDataByRelations(100));
      dispatch({
        type: SET_SUCCESS,
        data: "节点编辑成功",
      });
      dispatch({
        type: SET_SUCCESS_OPEN,
        data: true,
      });
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//获得节点\关系数量
export const getGraphCount = () => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getGraphCount";
  try {
    const response = await request.get(requestURL);
    dispatch({
      type: GET_TOTALNUM,
      data: response.data.nodeCount,
    });
    dispatch({
      type: GET_RELATION_NUMBER,
      data: response.data.relationCount,
    });
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//获得所有节点类别
export const getNodeLabels = () => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getGraphNodeLabels";
  try {
    const response = await request.get(requestURL);
    console.log(response.data);
    dispatch({
      type: GET_NODE_LABELS,
      data: response.data,
    });
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//获得所有边类别
export const getEdgeLabels = () => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getGraphEdgeLabels";
  try {
    const response = await request.get(requestURL);
    console.log(response.data);
    dispatch({
      type: GET_EDGE_LABELS,
      data: response.data,
    });
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};

//边分类搜索
export const edgeSearchClassLimit =
  (data: any) => async (dispatch: Function) => {
    const requestURL = "/GraphManage/searchEdgeWithClassLimit";
    try {
      const response = await request.post(requestURL, data);
      dispatch({
        type: GET_EDGE_SEARCH,
        data: { nodes: response.data[0], edges: response.data[1] },
      });
    } catch (err) {
      dispatch({
        type: SET_FAILURE,
        data: err,
      });
    }
  };
// 节点分类搜索
export const nodeSearchClassLimit =
  (data: any) => async (dispatch: Function) => {
    const requestURL = "/GraphManage/searchNodeWithClassLimit";
    try {
      const response = await request.post(requestURL, data);
      console.log(response.data);
      dispatch({
        type: GET_ORIGIN_SEARCH,
        data: response.data.result,
      });
      dispatch({
        type:GET_SEARCH_TIME,
        data:response.data.using_time,
      })
    } catch (err) {
      dispatch({
        type: SET_FAILURE,
        data: err,
      });
    }
  };
//路径搜索
export const searchNodesPath = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/searchNodesPath";
  try {
    const startTime = new Date().getTime();
    const response = await request.post(requestURL, data);
    const endTime = new Date().getTime();
    const time = (endTime - startTime) * 0.001;
    dispatch({
      type: GET_PATH_SEARCH,
      data: {
        nodes: response.data[1],
        edges: response.data[0],
        time: time,
        path: response.data[2],
      },
    });
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//展开节点
export const appendNodes = (data: any) => async (dispatch: Function) => {
  const requestURL = "/GraphManage/appendNode?node_id=" + data;
  try {
    const response = await request.get(requestURL);
    const append = {
      edges: response.data[0],
      nodes: response.data[1],
    };
    dispatch({
      type: GET_APPENDNODE,
      data: append,
    });
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
//获取带地址的节点
export const getNodeWithLocations = () => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getNodesWithLocations";
  try {
    const response = await request.get(requestURL);
    if (response.status === 200) {
      const cityData: any[] = response.data;
      let randomCount = cityData.length;
      if (randomCount > 0) {
        let addrData: any[] = [];
        while (randomCount--) {
          let cityName = cityData[randomCount];
          if (cityName !== undefined) {
            const address =
              cityName.地址 === undefined ? cityName.注册地址 : cityName.地址;
            console.log(address);
            //创建地址解析器实例
            const myGeo = new BMapGL.Geocoder();
            let cityCenter: any = {};
            myGeo.getPoint(
              address,
              function (point: { lng: any; lat: any }) {
                if (point) {
                  cityCenter.geometry = {
                    type: "Point",
                    coordinates: [point.lng, point.lat],
                  };
                  cityCenter.properties = cityName;
                  addrData.push(cityCenter);
                } else {
                  console.log("您选择的地址没有解析到结果！", address);
                }
              },
              ""
            );
          }
        }
        console.log(addrData);
        dispatch({
          type: GET_CITYS,
          data: addrData,
        });
      }
    }
  } catch (err) {
    dispatch({
      type: SET_FAILURE,
      data: err,
    });
  }
};
export const getGraphUrl = () => async (dispatch: Function) => {
  const requestURL = "/GraphManage/getGraphUrl";
  try {
    const response = await request.get(requestURL);
    dispatch({
      type: GET_GRAPH_URL_SUCCESS,
      data: response.data,
    });
  } catch (err) {}
};

export const updateGraphData = (data: any) => {
  return {
    type: GET_GRAPHDATA,
    data: data,
  };
};
export const setMapModel = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_MAPMODEL,
    data: data,
  });
};
export const getLength = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_LENGTH,
    data: data,
  });
};
export const setRelationships = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_RELA,
    data: data,
  });
};
export const setSelectedNode = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_SELECTNODE,
    data: data,
  });
};
export const setSelectInfo = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_SELECTINFO,
    data: data,
  });
};
export const clearSearchNodes = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_SEARCH,
    data: data,
  });
};
export const setLoading = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_LOADING,
    data: data,
  });
};
export const setLayoutType = (data: string) => async (dispatch: Function) => {
  dispatch({
    type: SET_LAYOUT,
    data: data,
  });
};

export const setLayoutInfo = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_LAYOUTINFO,
    data: data,
  });
};
export const setBigModel = (data: boolean) => async (dispatch: Function) => {
  dispatch({
    type: SET_BIGMODEL,
    data: data,
  });
};
export const setfocusNode = (data: boolean) => async (dispatch: Function) => {
  dispatch({
    type: SET_FOCUS,
    data: data,
  });
};
export const setLabelShow = (data: boolean) => async (dispatch: Function) => {
  dispatch({
    type: SET_LABEL,
    data: data,
  });
};
export const setRangeNode = (data: any[]) => async (dispatch: Function) => {
  dispatch({
    type: SET_RANGE,
    data: data,
  });
};

export const setSelectedEdge = (data: any[]) => async (dispatch: Function) => {
  dispatch({
    type: SET_SELECTEDGE,
    data: data,
  });
};
export const setSearchResult = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_SEARCH,
    data: data,
  });
  
};
export const setSearchResCheck =
  (data: boolean) => async (dispatch: Function) => {
    dispatch({
      type: SET_RES_CHECK,
      data: data,
    });
  };
export const setRadialFocusNode =
  (data: string) => async (dispatch: Function) => {
    dispatch({
      type: SET_RADIAL_FOCUS_NODE,
      data: data,
    });
  };
export const getNodeTypesStyle = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_NODE_TYPES_STYLE,
    data: data,
  });
};
export const getEdgeTypesStyle = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: GET_EDGE_TYPES_STYLE,
    data: data,
  });
};
export const setMessageClose = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_SUCCESS_OPEN,
    data: data,
  });
};
