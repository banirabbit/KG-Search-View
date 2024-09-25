import { Box, Typography } from "@mui/material";

export default function HelpPage() {
  return (
    <>
      <Box sx={{padding:"20px"}}>
        <Typography sx={{ color: "#fff", marginBottom:"20px" }}>
          1.点击节点或关系后，再点击Info栏，可查看节点详细信息
        </Typography>
        <Typography sx={{ color: "#fff", marginBottom:"20px" }}>
          2.操作栏可切换显示关系的条数（获取数据时间可能较久，请耐心等待）
        </Typography>
        <Typography sx={{ color: "#fff", marginBottom:"20px" }}>3.Info栏下方可搜索</Typography>
        <Typography sx={{ color: "#fff", marginBottom:"20px" }}>
          4.屏幕中节点个数过多系统会自动切换渲染引擎，此时缩放屏幕并点击右侧View按钮可查看屏幕内节点详细信息
        </Typography>
      </Box>
    </>
  );
}
