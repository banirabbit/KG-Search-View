import { IconButton } from "@mui/material";
import SearchField from "./SearchField";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./Info.css";
import InfoFilter from "./InfoFilter";
import { useEffect, useRef, useState } from "react";
import {
  searchNodeByName,
  SET_SUCCESS,
  SET_SUCCESS_OPEN,
  setLoading,
  setSearchResult,
} from "../../../../actions/graphProjectAction";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import DetailInfo from "./DetailInfo";
import SearchSetting from "./SearchSettings";
import { debounce } from "lodash";
export default function Info() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchError, setSearchError] = useState(false);
  const dispatch = useDispatch();
  const handleSearch = () => {
    if (searchOriginFuzzy?.length > 0 && searchInput !== "") {
      dispatch(setSearchResult({ nodes: [...searchOriginFuzzy], edges: [] }));
      dispatch({
        type: SET_SUCCESS,
        data: "搜索成功，用时" + searchTime + "ms",
      });
      dispatch({ type: SET_SUCCESS_OPEN, data: true });
    } else {
      setSearchError(true);
    }
  };
  const { selectedInfo, selectedEdge, searchOriginFuzzy, searchTime } =
    useSelector((state: AppState) => state.graphProject);
  useEffect(() => {
    console.log(selectedInfo, selectedEdge);
  }, [selectedInfo, selectedEdge]);
  const [options, setOptions] = useState([""]);
  useEffect(() => {
    let tempArr = [""];
    if (searchOriginFuzzy?.length > 0) {
      searchOriginFuzzy?.forEach((item: any, index: number) => {
        tempArr[index] = item.name;
      });
      setOptions(tempArr);
      setSearchError(false);
    }
  }, [searchOriginFuzzy]);
  const [searchInput, setSearchInput] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const inputDebounceTimeout = useRef<number | null>(null);
  const handleChange = (event: any, newInputValue: string) => {
    setSearchInput(newInputValue);
    setInputValue(newInputValue);
    setButtonDisabled(true);
    if (inputDebounceTimeout.current) {
      clearTimeout(inputDebounceTimeout.current);
    }
    inputDebounceTimeout.current = window.setTimeout(async () => {
      await dispatch(searchNodeByName(newInputValue));
      setButtonDisabled(false)
    }, 500);
  }; // 设置延迟时间，单位为毫秒
  const handleOption = async (event: any, newValue: string | null) => {
    if (newValue !== null) {
      setInputValue(newValue);
      setSearchInput(newValue);
      setButtonDisabled(true);
      await dispatch(searchNodeByName(newValue));
      setButtonDisabled(false);
    }
  };
  return (
    <div className="infoContainer">
      <div className="detailInfo">
        <div className="divider"></div>
        {Object.keys(selectedInfo).length === 0 &&
        Object.keys(selectedEdge).length === 0 ? (
          <div className="notice">Select a node to show information</div>
        ) : (
          <DetailInfo></DetailInfo>
        )}
      </div>

      <div className="searchfield">
        <IconButton
          sx={{ p: "10px 10px 0 10px", color: "#E0E3E7" }}
          aria-label="menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <SearchField
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          handleChange={handleChange}
          error={searchError}
          handleOption={handleOption}
        ></SearchField>
        <IconButton
          type="button"
          sx={{ p: "10px 10px 0 10px", color: "#E0E3E7" }}
          aria-label="search"
          onClick={() => {
            handleSearch();
          }}
          disabled={buttonDisabled}
        >
          <SearchIcon />
        </IconButton>
      </div>
      <SearchSetting open={open} setOpen={setOpen}></SearchSetting>
    </div>
  );
}
