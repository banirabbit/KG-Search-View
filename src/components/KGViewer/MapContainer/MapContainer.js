import {
  Map,
  Marker,
  MapvglView,
  MapvglLayer,
  MapApiLoaderHOC,
} from "react-bmapgl";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import possvg from "../../../assets/KGViewer/pos.svg";
import { useDispatch } from "react-redux";
import { setSelectInfo } from "../../../actions/graphProjectAction";
function MapContainer() {
  /* global BMapGL */

  /* global mapv */

  /* global mapvgl */

  /* global initMap */

  /* global whiteStyle */
  const data = useSelector((state) => state.graphProject.citys);
  const dispatch = useDispatch();
  return (
    <Map
      style={{ position: "absolute", width: "100%", height: "100vh" }}
      center={{ lng: 116.402544, lat: 39.928216 }}
      zoom={6}
      enableScrollWheelZoom={true}
    >
      <MapvglView>
        <MapvglLayer
          type="IconLayer"
          data={data}
          options={{
            icon: possvg,
            enablePicked: true, // 是否可以拾取
            selectedIndex: -1, // 选中项
            selectedColor: "#ff0000", // 选中项颜色
            autoSelect: true, // 根据鼠标位置来自动设置选中项
            onClick: (e) => {
              // 点击事件
              console.log(e);
              if(e.dataItem !== undefined) 
                dispatch(setSelectInfo(e.dataItem?.properties));
            },
          }}
        />
      </MapvglView>
      :<></>
    </Map>
  );
}

export default MapApiLoaderHOC({ ak: "KmIjcNyAGYOO9Dqm9lZY35WMA51m26dP" })(
  MapContainer
);
