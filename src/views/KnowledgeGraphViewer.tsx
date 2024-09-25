/**
 * 知识图谱可视化
 */
import React, { useEffect, useState, useRef } from "react";
import "./KnowledgeGraphViewer.css";
import G6 from "@antv/g6";
import { Grid, IconButton } from "@mui/material";
import LeftDrawer from "../components/KGViewer/LeftDrawer/LeftDrawer";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store";
import Loading from "../components/KGViewer/Loading/Loading";
import RegisterEdgeStyle from "../components/KGViewer/Style/RegisterStyle";
import {
  bindListener,
  processNodesEdges,
  clearFocusEdgeState,
  clearFocusItemState,
} from "./graphfunc";
import MapContainer from "../components/KGViewer/MapContainer/MapContainer";
import RightTopStatistic from "../components/KGViewer/RightTopStatistic";
import InfoAlert from "../components/KGViewer/Alert/InfoAlert";
//import { setBigModel } from "./actions/layoutAction";
import WarnAlert from "../components/KGViewer/Alert/WarnAlert";
import {
  CosmographProvider,
  Cosmograph,
  CosmographRef,
  CosmographSearch,
  CosmographSearchRef,
  CosmographHistogram,
  CosmographHistogramRef,
} from "@cosmograph/react";
//import { convertData } from "./converData";
import {
  clearSearchNodes,
  getGraphCount,
  getGraphDataByRelations,
  //getGraphDataByRelations,
  getGraphNode,
  getGraphUrl,
  getLength,
  getNodeWithLocations,
  setBigModel,
  setfocusNode,
  setLoading,
  setRadialFocusNode,
  setSelectedNode,
  setSelectInfo,
} from "../actions/graphProjectAction";
import SliderInfoDialog from "../components/KGViewer/SliderInfoDialog";
import SuccessAlert from "../components/KGViewer/Alert/SuccessAlert";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { deepCopy } from "../components/KGViewer/LeftDrawer/Info/SearchSettings";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { positions } from "@mui/system";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

export default function KnowledgeGraphViewer() {
  const [dbdata, setDBData] = useState<{
    nodes: any[] | undefined;
    edges: any[] | undefined;
  }>();
  // 创建 G6 图实例
  const myRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  let CANVAS_WIDTH: number;
  let CANVAS_HEIGHT: number;
  let shiftKeydown = false;
  const [layout, setLayout] = useState<any>({});
  const [graphConfig, setGraphConfig] = useState<any>({});
  const {
    graphData,
    appendData,
    searchNodes,
    isMapModel,
    relationships,
    layoutInfo,
    isBigModel,
    focusNode,
    loading,
    //切换边标签显示
    labelShow,
    resCheck,
  } = useSelector((state: AppState) => state.graphProject);

  const [alertOpen, setAlertOpen] = useState(false);
  const [warnalert, setWarnAlertOpen] = useState(false);
  const dispatch = useDispatch();
  const [cosmdata, setCosmData] = useState<{
    nodes: any[] | undefined;
    edges: any[] | undefined;
  }>();
  const cosmographRef = useRef<CosmographRef>(null);

  RegisterEdgeStyle();
  //   useEffect(() => {
  //     // 调用查询函数
  //     executeNeo4jQueryNode(driver, session, dispatch, relationships)
  //       .then((data) => {
  //         let isBig = data.nodes.length > 400 ? true : false;
  //         dispatch(setBigModel(isBig));
  //         const { edges, nodes } = processNodesEdges(
  //           data.nodes,
  //           data.edges,
  //           CANVAS_WIDTH,
  //           CANVAS_HEIGHT,
  //           false,
  //           true,
  //           isBig
  //         );
  //         setDBData({ nodes, edges });
  //         console.log(convertData(nodes, edges));
  //         setCosmData(convertData(nodes, edges));
  //         dispatch(setLoading(true));
  //         // dispatch(getCitys());
  //       })
  //       .catch((error) => console.error("Error executing Neo4j query:", error))
  //       .finally(() => {
  //         // 确保在所有操作结束后关闭 driver
  //         driver.close();
  //       });
  //   }, [relationships]);
  useEffect(() => {
    //dispatch(getGraphNode("深圳"));
    dispatch(getGraphCount());
    dispatch(getGraphDataByRelations(relationships));
    setViewClick(false);
  }, [dispatch, relationships]);
  useEffect(() => {
    dispatch(getNodeWithLocations());
  }, []);
  useEffect(() => {
    if (Object.keys(graphData).length > 0) {
      let isBig = graphData.nodes?.length > 300 ? true : false;
      dispatch(setBigModel(isBig));
      dispatch(getLength(graphData.nodes.length));
      const { edges, nodes } = processNodesEdges(
        graphData.nodes,
        graphData.edges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true,
        false,
        dispatch
      );
      let tempCosmData = JSON.parse(
        JSON.stringify({ nodes: nodes, edges: edges })
      );
      setCosmData(tempCosmData);
      setDBData({ nodes: nodes, edges: edges });
      setOriDBdata(tempCosmData);
      if (nodes !== undefined) {
        dispatch(setRadialFocusNode(nodes[0]?.id));
      }
    }
  }, [dispatch, graphData]);

  //展开节点
  useEffect(() => {
    if (appendData !== undefined && Object.keys(appendData).length > 0) {
      if (dbdata?.nodes !== undefined && dbdata.edges !== undefined) {
        console.log(appendData);
        let temp = {
          nodes: [...dbdata.nodes, ...appendData.nodes],
          edges: [...dbdata.edges, ...appendData.edges],
        };
        //检查节点和边是否都在图中，都在的话就不展开了
        let isNodeContain, isEdgeContain, isContain;

        const nodeIdSet = new Set(dbdata.nodes.map((item: any) => item.id));
        isNodeContain = temp.nodes.every((item) => nodeIdSet.has(item.id));
        const edgeIdSet = new Set(dbdata.edges.map((item: any) => item.id));
        isEdgeContain = temp.edges.every((item) => edgeIdSet.has(item.id));
        isContain = isNodeContain && isEdgeContain;
        console.log(isContain);
        if (!isContain) {
          const { edges: processEdges, nodes: processNodes } =
            processNodesEdges(
              temp.nodes,
              temp.edges,
              CANVAS_WIDTH,
              CANVAS_HEIGHT,
              false,
              true,
              false,
              dispatch
            );
          setDBData({ nodes: processNodes, edges: processEdges });
          if (processNodes !== undefined) {
            dispatch(setRadialFocusNode(processNodes[0]?.id));
          }
        } else {
          setWarnAlertOpen(true);
        }
      }
    }
  }, [appendData]);

  //搜索
  useEffect(() => {
    if (searchNodes !== undefined && Object.keys(searchNodes).length > 0) {
      let temp;
      if (
        oriDBdata?.nodes !== undefined &&
        oriDBdata?.nodes.length !== 0 &&
        oriDBdata?.edges !== undefined &&
        oriDBdata?.edges.length !== 0
      ) {
        //搜索结果是否已经有部分在图中
        if (resCheck) {
          temp = {
            nodes: [...oriDBdata.nodes, ...searchNodes.nodes],
            edges: [...oriDBdata.edges, ...searchNodes.edges],
          };
          console.log(1, oriDBdata.edges, temp.edges);
        } else {
          //如果都不在图中，就只显示搜索结果
          temp = {
            nodes: searchNodes.nodes,
            edges: searchNodes.edges,
          };
        }
      } else {
        temp = {
          nodes: searchNodes.nodes,
          edges: searchNodes.edges,
        };
      }
      //检查搜索后是否是大规模视图
      let isBig = temp.nodes.length > 300 ? true : false;

      dispatch(setBigModel(isBig));
      //为新节点设置样式并去重
      const { edges: processEdges, nodes: processNodes } = processNodesEdges(
        temp.nodes,
        temp.edges,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        false,
        true,
        false,
        dispatch
      );
      setDBData({ nodes: processNodes, edges: processEdges });
      if (processNodes !== undefined) {
        dispatch(setRadialFocusNode(processNodes[0]?.id));
      }
      let tempCosmData = JSON.parse(
        JSON.stringify({ nodes: processNodes, edges: processEdges })
      );
      setOriDBdata({ nodes: tempCosmData?.nodes, edges: tempCosmData?.edges });
      dispatch(getLength(processNodes?.length));
      console.log("search result:", loading, processNodes, processEdges);
      if (isBig) {
        setCosmData({ nodes: tempCosmData?.nodes, edges: tempCosmData?.edges });
      }

      dispatch(setLoading(true));
    }
  }, [searchNodes]);
  useEffect(() => {
    if (Object.keys(searchNodes).length > 0 && isBigModel === true) {
      let selected = cosmdata?.nodes?.filter((item) =>
        searchNodes?.nodes?.some((i: any) => i.id === item.id)
      );
      if (selected !== undefined) {
        cosmographRef.current?.selectNodes(selected);
      }
    }
  }, [cosmdata]);
  //图渲染
  useEffect(() => {
    if (loading) {
      const container = myRef.current;
      if (container === null || container === undefined) {
        throw new Error(
          "Container not found. Make sure to set the containerRef."
        );
      }
      const toolbarContainer = toolbarRef.current;
      if (toolbarContainer === null || toolbarContainer === undefined) {
        throw new Error(
          "ToolBARContainer not found. Make sure to set the containerRef."
        );
      }
      const miniMapContainer = miniMapRef.current;
      if (miniMapContainer === null || miniMapContainer === undefined) {
        throw new Error(
          "miniMapContainer not found. Make sure to set the containerRef."
        );
      }
      const viewMapContainer = viewRef.current;
      if (viewMapContainer === null || viewMapContainer === undefined) {
        throw new Error(
          "viewMapContainer not found. Make sure to set the containerRef."
        );
      }
      if ((!isMapModel && !isBigModel) || viewClick) {
        const miniMap = new G6.Minimap({ container: miniMapContainer });
        const grid = new G6.Grid();
        const toolbar = new G6.ToolBar({
          container: toolbarContainer,
        });

        CANVAS_WIDTH = container.scrollWidth;
        CANVAS_HEIGHT = (container.scrollHeight || 500) - 30;
        const graph = new G6.Graph({
          container: viewClick ? viewMapContainer : container,
          linkCenter: true,
          minZoom: 0.1,
          modes: {
            default: ["drag-canvas", "zoom-canvas", "drag-node"],
            lassoSelect: [
              {
                type: "zoom-canvas",
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
              {
                type: "lasso-select",
                selectedState: "focus",
                trigger: "drag",
              },
            ],
          },
          animate: true,
          plugins: [toolbar],
        });
        graph.data(dbdata);

        const layoutConfig: any = {
          type: "gForce",
          minMovement: 0.5,
          maxIteration: 5000,
          preventOverlap: true,
          damping: 0.6,
          linkdistance: 400,
          fitView: true,
          tick: () => {
            graph.refreshPositions();
          },
        };
        //bindListener需要当前layout的参数，暂时保存值
        const tempLayout: any = {};
        console.log(layoutInfo);
        //更换布局的情况
        if (layoutInfo !== undefined && Object.keys(layoutInfo).length > 0) {
          //如果更换了力导向布局
          if (layoutInfo.type === "gForce") {
            layoutInfo.tick = () => {
              graph.refreshPositions();
            };
            //大规模下改成force2布局
            if (isBigModel) {
              setAlertOpen(true);
              graph.updateLayout({
                type: "force2",
                workerEnabled: true,
                onLayoutEnd: () => {
                  setAlertOpen(false);
                },
              });
            } else {
              const instance = new G6.Layout[layoutInfo.type](layoutInfo);
              setLayout({
                instance: instance,
              });
              instance.init({
                nodes: dbdata?.nodes,
                edges: dbdata?.edges,
              });
              instance.execute();
            }
          } else {
            //不是力导向布局，要先停止布局不然会出bug
            if (layout !== undefined && layout.instance !== undefined) {
              layout.instance.stop();
              if (isBigModel) {
                setAlertOpen(true);
                layoutInfo.onLayoutEnd = () => {
                  setAlertOpen(false);
                };
              }
              graph.updateLayout(layoutInfo);
            } else {
              graph.updateLayout(layoutInfo);
            }
          }
        } else {
          //初始情况
          if (!isBigModel) {
            layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];

            tempLayout.instance = new G6.Layout["gForce"](layoutConfig);
            setLayout(tempLayout);
            tempLayout.instance.init({
              nodes: dbdata?.nodes,
              edges: dbdata?.edges,
            });
            tempLayout.instance.execute();
          } else {
            //大规模数据初始情况
            setAlertOpen(true);
            graph.updateLayout({
              type: "force2",
              workerEnabled: true,
              onLayoutEnd: () => {
                setAlertOpen(false);
              },
            });
          }
        }

        graph.render();

        bindListener(
          graph,
          shiftKeydown,
          tempLayout,
          clearFocusEdgeState,
          clearFocusItemState,
          dispatch
        );
        if (searchNodes.nodes !== undefined && searchNodes.nodes.length > 0) {
          //找到搜索结果（图的节点信息和处理过后数据的信息不一样，所以要重新找）
          const searchItem: any[] = graph.findAll("node", (node: any) => {
            return searchNodes.nodes.some(
              (itemB: any) => node.get("id") === itemB.id
            );
          });
          if (searchItem !== undefined && searchItem.length > 0) {
            searchItem.forEach((item) =>
              graph.setItemState(item, "focus", true)
            );
            graph.focusItem(searchItem[0], true, {
              easing: "easeCubic",
              duration: 400,
            });
          }
          //清除所有搜索状态
          dispatch(clearSearchNodes({}));
        } else if (dbdata?.nodes?.length === 1) {
          graph.focusItem(graph.getNodes()[0], true, {
            easing: "easeCubic",
            duration: 400,
          });
        } else if (
          focusNode !== undefined &&
          Object.keys(focusNode).length > 0
        ) {
          //需要获取刷新后该节点的信息
          const item = graph.findById(focusNode);
          if (item !== undefined) {
            graph.setItemState(item, "focus", true);
            graph.focusItem(item, true, {
              easing: "easeCubic",
              duration: 400,
            });
          }
        }
        setGraphConfig(graph);
        // if (typeof window !== "undefined" && !isMapModel && !isBigModel) {
        //   window.onresize = () => {
        //     if (!graph || graph.get("destroyed")) return;
        //     if (!container || !container.scrollWidth || !container.scrollHeight)
        //       return;
        //     graph.changeSize(container.scrollWidth, container.scrollHeight);
        //   };
        // }
        return () => {
          // 销毁G6图形实例
          graph.destroy();
        };
      } else if (isBigModel) {
      }
    }
  }, [layoutInfo, loading, dbdata, isMapModel]);
  //判断当前屏幕中的节点数，查看细节
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [viewDetail, setViewDetail] = useState(false);
  const [viewClick, setViewClick] = useState(false);
  const [oriDBdata, setOriDBdata] = useState<{
    nodes: any[] | undefined;
    edges: any[] | undefined;
  }>(); //切换视图之前保存原始数据
  if (typeof window !== "undefined") {
    window.onwheel = () => {
      // 清除旧的定时器
      if (timer !== null) {
        clearTimeout(timer);
      }

      // 设置一个新的定时器，在用户停止滑动后1秒执行
      setTimer(
        setTimeout(function () {
          let screenNodeMap =
            cosmographRef.current?.getSampledNodePositionsMap();
          if (screenNodeMap !== undefined && screenNodeMap?.size <= 200) {
            setViewDetail(true);
          } else if (screenNodeMap !== undefined && screenNodeMap?.size > 200) {
            setViewDetail(false);
          }
        }, 300)
      );
    };
  }
  const searchRef = useRef<CosmographSearchRef>();
  const histogramRef = useRef<CosmographHistogramRef<0, 0>>();
  const [sliderOpen, setSliderOpen] = useState(false);

  //动态调整窗口大小
  const [startX, setStartX] = useState(0); // 初始拖拽起始位置X坐标
  const [startY, setStartY] = useState(0); // 初始拖拽起始位置Y坐标
  const [startWidth, setStartWidth] = useState(500); // 初始div宽度
  const [startHeight, setStartHeight] = useState(500); // 初始div高度

  // 处理鼠标按下事件
  const startResize = (event: any) => {
    setStartX(event.clientX);
    setStartY(event.clientY);
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  // 处理鼠标移动事件
  const resize = (event: any) => {
    const width = startWidth - (event.clientX - startX) / 2;
    const height = startHeight - (event.clientY - startY) / 2;
    setStartWidth(width);
    setStartHeight(height);
  };

  // 处理鼠标释放事件
  const stopResize = () => {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };
 
  return (
    <Grid container className="kgBackground">
      {loading ? <></> : <Loading></Loading>}
      {isMapModel ? <MapContainer></MapContainer> : <></>}
      {isBigModel&&!isMapModel ? (
        <CosmographProvider
          nodes={cosmdata !== undefined ? cosmdata.nodes : []}
          links={cosmdata !== undefined ? cosmdata.edges : []}
        >
          <Cosmograph
            ref={cosmographRef}
            nodeSize={(d: any) => d.size}
            nodeLabelAccessor={(d: any) => d.oriLabel}
            nodeColor={(d: any) => d.color}
            simulationFriction={1}
            simulationLinkSpring={0.1}
            simulationLinkDistance={20}
            simulationRepulsion={1}
            simulationDecay={4000}
            simulationGravity={0.05}
            nodeLabelColor={"#D4D4D4"}
            hoveredNodeLabelColor={"#FFDA4A"}
            disableSimulation={false}
            nodeSamplingDistance={1}
            fitViewOnInit={true}
            backgroundColor={"#363B46"}
            nodeSizeScale={0.2}
            showDynamicLabels={labelShow}
            onClick={(n) => {
              searchRef?.current?.clearInput();
              histogramRef?.current?.setSelection([0, 0]);
              if (n) {
                dispatch(setSelectInfo(n));
                dispatch(setSelectedNode(1));
                cosmographRef.current?.selectNode(n);
              } else {
                dispatch(setSelectedNode(0));
                cosmographRef.current?.unselectNodes();
              }
            }}
          />
          <CosmographSearch
            ref={searchRef}
            className="searchStyle"
            //   onSelectResult={onSearchSelectResult}
            maxVisibleItems={12}
          />
          <CosmographHistogram
            className="histogramStyle"
            accessor={(d: any) => d.size}
            filterFunction={(selection, data, crossfilteredData) => {
              return crossfilteredData.filter((node: any) => {
                return node.size >= selection[0] && node.size <= selection[1];
              });
            }}
            ref={histogramRef}
            onSelection={(selection: [number, number] | undefined) => {
              if (selection !== undefined) {
                let selected = cosmdata?.nodes?.filter(
                  (item) =>
                    item.size >= selection[0] && item.size <= selection[1]
                );
                if (selected !== undefined) {
                  cosmographRef.current?.selectNodes(selected);
                }
              }
            }}
          />
        </CosmographProvider>
      ) : (
        <></>
      )}
      <div ref={myRef} className="kgContainer" id="container"></div>
      <LeftDrawer></LeftDrawer>
      <RightTopStatistic></RightTopStatistic>
      <div className="view-button">
        <IconButton
          size="large"
          disabled={!isBigModel}
          onClick={() => {
            if (cosmographRef.current?.getSelectedNodes() === null) {
              let screenNodeMap =
                cosmographRef.current?.getSampledNodePositionsMap();
              if (screenNodeMap !== undefined && screenNodeMap?.size <= 200) {
                setViewClick(true);
                console.log(oriDBdata);
                let tempOriData = JSON.parse(
                  JSON.stringify({
                    nodes: oriDBdata?.nodes,
                    edges: oriDBdata?.edges,
                  })
                );
                let tempNodes = tempOriData?.nodes?.filter(function (
                  item: any
                ) {
                  if (screenNodeMap?.has(item.id)) {
                    let temp: number[] | undefined = screenNodeMap.get(item.id);
                    if (temp !== undefined) {
                      item.x = temp[0];
                      item.y = temp[1];
                      return item;
                    }
                  }
                });
                let tempEdges = tempOriData?.edges?.filter(function (
                  item: any
                ) {
                  if (
                    screenNodeMap?.has(item.source) &&
                    screenNodeMap?.has(item.target)
                  ) {
                    return item;
                  }
                });
                if (tempNodes === undefined) tempNodes = [];
                if (tempEdges === undefined) tempEdges = [];
                setDBData({ nodes: tempNodes, edges: tempEdges });
                if (tempNodes !== undefined) {
                  dispatch(setRadialFocusNode(tempNodes[0]?.id));
                }
              } else if (screenNodeMap !== undefined) {
                setSliderOpen(true);
              }
            } else {
              let tempNodes = cosmographRef.current?.getSelectedNodes();
              if (
                tempNodes !== null &&
                tempNodes?.length !== undefined &&
                tempNodes?.length <= 200
              ) {
                setViewClick(true);
                if (tempNodes === null || tempNodes === undefined)
                  tempNodes = [];
                let tempOriData = JSON.parse(
                  JSON.stringify({ nodes: tempNodes, edges: oriDBdata?.edges })
                );
                let tempEdges = tempOriData?.edges?.filter(function (
                  item: any
                ) {
                  if (
                    tempNodes?.some((node) => node.id === item.source) &&
                    tempNodes?.some((node) => node.id === item.target)
                  ) {
                    return item;
                  }
                });
                if (tempEdges === null || tempEdges === undefined)
                  tempEdges = [];
                setDBData({ nodes: tempOriData?.nodes, edges: tempEdges });
                if (tempNodes !== undefined) {
                  dispatch(setRadialFocusNode(tempNodes[0]?.id));
                }
              } else if (tempNodes !== null) {
                setSliderOpen(true);
              }
            }
          }}
        >
          <VisibilityOutlinedIcon
            style={{ color: "#ffffffde", fontSize: "inherit" }}
          ></VisibilityOutlinedIcon>
        </IconButton>
      </div>
      <div ref={toolbarRef} className="ToolbarContainer"></div>
      <div ref={miniMapRef} className="MiniMapContainer"></div>
      {/* 大数据模式使用g6查看详细情况的容器 */}
      <div
        className="viewContainer"
        ref={viewRef}
        style={{
          zIndex: viewClick ? 99 : -1,
          width: startWidth + "px",
          height: startHeight + "px",
        }}
      >
        <div style={{ position: "absolute", top: "5px", right: "5px" }}>
          <IconButton
            onClick={() => {
              setViewClick(false);
            }}
            sx={{ color: "#fff" }}
          >
            <HighlightOffIcon></HighlightOffIcon>
          </IconButton>
        </div>
        <div style={{ position: "absolute", top: "5px", left: "5px" }}>
          <IconButton sx={{ color: "#fff" }} onMouseDown={startResize}>
            <AspectRatioIcon></AspectRatioIcon>
          </IconButton>
        </div>
      </div>
      : <></>
      <InfoAlert
        text={"布局中，请稍侯..."}
        open={alertOpen}
        setOpen={setAlertOpen}
      ></InfoAlert>
      <WarnAlert
        text={"无新节点"}
        open={warnalert}
        setOpen={setWarnAlertOpen}
      ></WarnAlert>
      <SuccessAlert></SuccessAlert>
      <SliderInfoDialog
        open={sliderOpen}
        setOpen={setSliderOpen}
      ></SliderInfoDialog>
    </Grid>
  );
}
