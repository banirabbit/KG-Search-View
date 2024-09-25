import React, { useEffect } from "react";
import "./Loading.css"; // 导入样式文件

const Loading = () => {
  useEffect(() => {
    // 这里可以添加一些额外的逻辑
    return () => {
      // 在组件卸载时执行清理逻辑
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="square-container">
        <div className="square square1"></div>
        <div className="square square2"></div>
        <div className="square square3"></div>
      </div>
      <div
        style={{
          color: "#FFECF5",
          fontWeight: 600,
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        获取数据中...
      </div>
    </div>
  );
};

export default Loading;
