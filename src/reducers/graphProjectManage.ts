import * as actions from "../actions/graphProjectAction";

const initState = {
  graphNode: {},
  graphCount: [],
  graphURL: "",
  //新属性
  layoutInfo: {},
  isBigModel: false,
  focusNode: "",
  graphData: {},
  //搜索用
  searchOriginNodes: [],
  searchOriginEdge: {},
  searchOriginPath: {},
  searchOriginFuzzy: [],
  searchNodes: {},
  //
  appendData: {},
  citys: [],
  isMapModel: false,
  length: 0,
  relationships: 100,
  selectedNodes: 0,
  selectedInfo: {},
  selectedEdge: {},
  loading: false,
  total: 0,
  labelShow: true,
  rangeSelectNodes: [],
  nodeLabels: [""],
  edgeLabels: [],
  successMessage: "",
  successOpen:false,
  failMessage: "",
  resCheck: true,
  radialFocusNode: "",
  nodeStyle: {},
  edgeStyle: {},
  relationNumber: 0,
  schemaCover:0,
  searchTime:0,
};

export default function graphProjectReducer(state = initState, action: any) {
  const { type, data } = action;
  switch (type) {
    case actions.GET_GRAPH_NODE_SUCCESS:
      console.log(data);
      return {
        ...state,
        graphNode: data,
        graphData: data,
      };
    case actions.GET_GRAPH_COUNT_SUCCESS:
      return {
        ...state,
        graphCount: data,
      };
    case actions.GET_GRAPH_URL_SUCCESS:
      return {
        ...state,
        graphURL: data,
      };
    case actions.GET_APPENDNODE:
      return {
        ...state,
        appendData: data,
      };
    case actions.GET_ORIGIN_SEARCH:
      return {
        ...state,
        searchOriginNodes: data,
      };
    case actions.GET_EDGE_SEARCH:
      return {
        ...state,
        searchOriginEdge: data,
      };
    case actions.GET_PATH_SEARCH:
      return {
        ...state,
        searchOriginPath: data,
      };
    case actions.GET_FUZZY_SEARCH:
      return {
        ...state,
        searchOriginFuzzy: data,
      };
    case actions.GET_SEARCH:
      return {
        ...state,
        searchNodes: data,
      };
    case actions.GET_CITYS:
      return {
        ...state,
        citys: data,
      };
    case actions.SET_MAPMODEL:
      return {
        ...state,
        isMapModel: data,
      };
    case actions.GET_LENGTH:
      return {
        ...state,
        length: data,
      };
    case actions.SET_RELA:
      return {
        ...state,
        relationships: data,
      };
    case actions.SET_SELECTNODE:
      return {
        ...state,
        selectedNodes: data,
      };
    case actions.SET_SELECTINFO:
      return {
        ...state,
        selectedInfo: data,
      };
    case actions.SET_LOADING:
      return {
        ...state,
        loading: data,
      };
    case actions.GET_TOTALNUM:
      return {
        ...state,
        total: data,
      };
    case actions.SET_LAYOUTINFO:
      return {
        ...state,
        layoutInfo: action.data,
      };
    case actions.SET_BIGMODEL:
      return {
        ...state,
        isBigModel: action.data,
      };
    case actions.SET_FOCUS:
      return {
        ...state,
        focusNode: action.data,
      };
    case actions.SET_LABEL:
      return {
        ...state,
        labelShow: action.data,
      };
    case actions.SET_RANGE:
      return {
        ...state,
        rangeSelectNodes: action.data,
      };
    case actions.GET_NODE_LABELS:
      return {
        ...state,
        nodeLabels: action.data,
      };
    case actions.GET_EDGE_LABELS:
      return {
        ...state,
        edgeLabels: action.data,
      };
    case actions.SET_SUCCESS:
      return {
        ...state,
        successMessage: action.data,
      };
    case actions.SET_FAILURE:
      return {
        ...state,
        failMessage: action.data,
      };
    case actions.SET_SELECTEDGE:
      return {
        ...state,
        selectedEdge: action.data,
      };
    case actions.SET_RES_CHECK:
      return {
        ...state,
        resCheck: action.data,
      };
    case actions.SET_RADIAL_FOCUS_NODE:
      return {
        ...state,
        radialFocusNode: action.data,
      };
    case actions.GET_NODE_TYPES_STYLE:
      return {
        ...state,
        nodeStyle: action.data,
      };
    case actions.GET_EDGE_TYPES_STYLE:
      return {
        ...state,
        edgeStyle: action.data,
      };
    case actions.SET_SUCCESS_OPEN:
      return {
        ...state,
        successOpen: action.data,
      };
    case actions.GET_RELATION_NUMBER:
      return {
        ...state,
        relationNumber: action.data,
      }
    case actions.GET_SCHEMA_COVER:
      return {
        ...state,
        schemaCover: action.data,
      }
    case actions.GET_SEARCH_TIME:
      return {
        ...state,
        searchTime:data,
      }
    default:
      return state;
  }
}
