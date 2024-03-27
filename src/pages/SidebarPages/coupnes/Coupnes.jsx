import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  InputLabel,
  Select,
  FormControl,
  IconButton,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import VendorListToolbar from "../../../sections/@dashboard/vendor/VendorListToolbar";
import Iconify from "../../../components/Iconify";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../../../sections/@dashboard/user";
import LoadingSpinner from "../../../components/Spinner";
import searchNotFound from "../../../assests/searchnotfound.gif";
import {
  convertDate,
  getGapBetweenDates,
} from "../../../global/globalFunctions";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
// import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import SideDrawer from "../../../global/Drawer";
import AddCategory from "../../SidebarPages/categorypage/AddCategory";
import EditUser from "./../../SidebarPages/userpage/EditUser";
import ConfimModal from "../../../global/Modals/ConfimModal";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import CsvDownloadButton from "react-json-to-csv";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { editable_config } from "src/editable_config";
import VideoModal from "src/global/Modals/VideoModal";
import { UseContextState } from "src/global/GlobalContext/GlobalContext";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, true, 4.3),
  createData("Donut", 452, 25.0, false, 4.9),
  createData("Eclair", 262, 16.0, true, 6.0),
  createData("Frozen yoghurt", 159, 6.0, false, 4.0),
  createData("Gingerbread", 356, 16.0, true, 3.9),
  createData("Honeycomb", 408, 3.2, true, 6.5),
  createData("Ice cream sandwich", 237, 9.0, true, 4.3),
  createData("Jelly Bean", 375, 0.0, false, 0.0),
  createData("KitKat", 518, 26.0, true, 7.0),
  createData("Lollipop", 392, 0.2, false, 0.0),
  createData("Marshmallow", 318, 0, true, 2.0),
  createData("Nougat", 360, 19.0, true, 37.0),
  createData("Oreo", 437, 18.0, true, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "code",
    numeric: true,
    disablePadding: true,
    label: " Coupon Code",
  },
  {
    id: "Empty_Date",
    numeric: true,
    disablePadding: false,
    label: "",
  },
    {
    id: "Empty_Date",
    numeric: true,
    disablePadding: false,
    label: "",
  },


  {
    id: "Expiry_Date",
    numeric: true,
    disablePadding: false,
    label: "Expiry Date",
  },
  {
    id: "Minimum_amount",
    numeric: false,
    disablePadding: true,
    label: "Min. Order",
  },
  {
    id: "coupon_Type",
    numeric: false,
    disablePadding: false,
    label: "Coupon Type",
  },
  {
    id: "Discount_Value",
    numeric: false,
    disablePadding: false,
    label: "Discount",
  },


  
  {
    id: "Status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },

  {
    id: "Action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="2">#</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "center"}
            padding={headCell.disablePadding ? "normal" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ textTransform: "uppercase" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  console.log("prop  =>>>>>>>>", props);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {/* All Coupons {`(${props.usersCount})`} */}
          All Coupons {`(${props.allData.length})`}
        </Typography>
      )}

      <Tooltip title="Filter list">
        <></>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Coupnes() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [filterName, setFilterName] = useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [age, setAge] = React.useState("");
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [openDeleteConfimModal, setOpenDeleteConfimModal] = useState(false);
  const [search, setSearch] = useState("");
  const [render, setRender] = useState(false);
  const [data, setData] = useState([]);
  const [drawerAddCategory, setDrawerAddCategory] = React.useState(false);
  const [filters, setFilters] = useState({
    by_status: "all",
    recentDays: "All",
  });
  const [openDateFilter, setOpenDateFilter] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});
  const [message, setMessage] = useState({ type: "", message: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [drawerEditCategory, setDrawerEditCategory] = React.useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [userIdForEdit, setUserIdForEdit] = useState("");
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { authState, dispatch } = UseContextState();
  const open = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log("authState USSERSSSS----", authState);
  console.log("PAGE NUMBER---", currentPage);
  // GETTING ALL USERS
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        // `${process.env.REACT_APP_BACKEND_URL}/api/user/get/alluser?search=${search}&by_status=${filters?.by_status}&date_from=${stateDate[0]?.startDate}&date_to=${stateDate[0]?.endDate}&page=${currentPage}`,
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/get/all/coupons?search=${search}&date_from=${stateDate[0]?.startDate}&date_to=${stateDate[0]?.endDate}&page=${currentPage}`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);

        setData([...res?.data?.alluser]);
        // setData([...res?.data?.coupons]);
        setUsersCount(res?.data?.user_count || 0);
        setTotalPages(res?.data?.pages || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // setLoading(false)
  }, [render, currentPage, filters?.by_status, stateDate, filters?.recentDays]);

  // SEARCH IN users TABLE
  const handleSearch = async (e) => {
    e.preventDefault();
    setRender((prev) => !prev);
  };
  console.log("filters?.by_status", filters);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // handle change filter by status
  const filterByStatus = (e) => {
    if (e.target.value === "all") {
      setFilters((prev) => ({ ...prev, by_status: e.target.value }));
      setRender((prev) => !prev);
      return;
    }
    setFilters((prev) => ({ ...prev, by_status: e.target.value }));
  };

  // handle recent user fucntion
  const handleRecentUsers = (value) => {
    console.log("+++++value=========", value);
    setSearch("");
    let date = new Date().toJSON().slice(0, 10);
    // console.log(date); // "2022-06-17"
    const currentDate = new Date().toDateString();
    // console.log("current Date",currentDate.length)
    const getCompareValue = `${value?.startDate}`;
    // console.log("getCompareValue",getCompareValue?.slice(0,15)?.length)

    // FOR SETTING TODAY IN DATE FILTER
    if (getCompareValue?.slice(0, 15) == `${currentDate}`) {
      // console.log("ENTERED")
      setFilters((prev) => ({ ...prev, recentDays: "Today" }));
      return;
    }
    const startDateGap = getGapBetweenDates(value?.endDate, value?.startDate);
    console.log("getGapBetweenDates", startDateGap);
    // FOR SETTING YESTERDAY IN DATE FILTER
    if (startDateGap == 1) {
      setFilters((prev) => ({ ...prev, recentDays: "Yesterday" }));
      return;
    }
    // FOR SETTING YESTERDAY IN DATE FILTER
    if (startDateGap == 7) {
      setFilters((prev) => ({ ...prev, recentDays: "Week" }));
      return;
    }
    // FOR SETTING YESTERDAY IN DATE FILTER
    if ((startDateGap == 30, 31, 29, 28)) {
      setFilters((prev) => ({ ...prev, recentDays: "Month" }));
      // return;
    }
    if ((startDateGap != 30, 31, 29, 28, 1, 7)) {
      // console.log("ELSE")
      setFilters((prev) => ({ ...prev, recentDays: "Custom" }));
    }

    if (filters.recentDays == "All") {
      setRender((prev) => !prev);
      return;
    }

    console.log(value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // ============ TABLE PAGINATION ============
  const handleOnClickPagePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
    return;
  };
  const handleOnClickPageNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
    return;
  };
  // ============ TABLE PAGINATION ============

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  //   const handleFilterByName = (event) => {
  //   setFilterName(event.target.value);
  // };

  //############################# ADD CATEGORY SIDE BAR DRAWER FUNCTION #############################
  const handleOpenAddUserSidebar = () => {
    setDrawerAddCategory(true);
  };

  const handleCloseAddUserSideBar = () => {
    setDrawerAddCategory(false);
  };
  //############################# ADD CATEGORY SIDE BAR DRAWER FUNCTION #############################

  //############################# EDIT CATEGORY SIDE BAR DRAWER FUNCTION #############################
  const handleOpenEditCategorySidebar = () => {
    setDrawerEditCategory(true);
  };

  const handleCloseEditProductSideBar = () => {
    setDrawerEditCategory(false);
    setRender((prev) => !prev);
  };
  //############################# EDIT CATEGORY SIDE BAR DRAWER FUNCTION #############################

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  //############################# CLOSE DELETE CONFIRM MODAL FUNCTION #############################
  const handleCloseConfimModal = () => {
    setOpenDeleteConfimModal(false);
    setIsOpen2(false);
  };
  //############################# CLOSE DELETE CONFIM MODAL FUNCTION #############################

  //############################# HANDLE DELETE CATEGORIES FUNCTION #############################

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDelete_id, setConfirmDelete_id] = useState("");

  const deleteCoupon = async () => {
    await axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/coupons/${confirmDelete_id}`,

        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setOpenDeleteConfimModal(false);
        setRender((prev) => !prev);
        if (res?.data?.success) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Coupon Deleted Successfully !",
          }));
          setSnackbarOpen(true);
        }
        setConfirmDelete(false);
      })
      .catch((err) => {
        console.log(err);
        setOpenDeleteConfimModal(false);
      });
  };

  //############################# HANDLE DELETE CATEGORIES FUNCTION #############################

  // handle close video modal
  function handleCloseVideoModal() {
    setOpenVideoModal(false);
  }

  // handle open video modal
  function handleOpenVideoModal() {
    setOpenVideoModal(true);
  }

  const changeStaus = async (id) => {
    // admin/change/status/coupons/:id

    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/change/status/coupons/${id}`,
        {},
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          setRender((prev) => !prev);
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Coupon Updated Successfull !",
          }));
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <LoadingSpinner loading={loading} />

      <div className="custom-conatiner">
        <Box sx={{ width: "100%" }}>
          <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
            <div
              className="product-topbar-box vendor-topbar-box"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h3 className=""> Coupons</h3>

              <div className="buttons">
                <Button
                  onClick={() => navigate("/dashboard/create_coupons")}
                  className="product-btn"
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  style={{ width: "140px" }}
                >
                  Add Coupon
                </Button>
              </div>
            </div>
            {/* #################### SANCKBAR MESSAGE ######################## */}
            {/* CONFIRM MODAL */}
            <ConfimModal
              open={confirmDelete}
              title="Delete"
              onYes={() => deleteCoupon()}
              message="Do you want to delete?"
              handleClose={() => {
                setConfirmDelete(false);
              }}
            />
            <ConfimModal
              open={openDeleteConfimModal}
              title="Delete"
              onYes={() => deleteCoupon(selected)}
              message="Do you want to delete?"
              handleClose={handleCloseConfimModal}
            />
            {/* #################### SANCKBAR MESSAGE ######################## */}
            <CustomizedSnackbars
              onOpen={snackbarOpen}
              type={message?.type}
              handleClose={handleCloseSnackbar}
              message={message?.message}
            />
            <div className="flex order-top-bar ">
              <form
                onSubmit={handleSearch}
                className="flex"
                style={{ width: "100%" }}
              >
                <TextField
                  id="outlined-basic"
                  type="search"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  label="Search In Coupons"
                  placeholder="Search Anything..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  className="search-btn"
                  sx={{ ml: 2, mr: 1, height: 54, px: 4 }}
                  variant="contained"
                  type="submit"
                  startIcon={<Iconify icon="ic:twotone-search" />}
                >
                  Search
                </Button>
              </form>

              {/* <div className="order-toolbar-selectbox-2">
                <FormControl fullWidth>
                  <TextField
                    id="basic-button"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <ArrowDropDownIcon />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    label="Recent Customers"
                    aria-readonly={true}
                    value={filters?.recentDays}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickMenu}
                  />

                  
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    }}
                  >
                    <div className="date-filter-box">
                      <DateRangePicker
                        onChange={(item) => {
                          setStateDate([item.selection]);
                          handleRecentUsers(item.selection);
                        }}
                        showSelectionPreview={false}
                        showPreview={false}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        ranges={stateDate}
                        direction="vertical"
                      />
                      <div className="date-filter-reset-btn">
                        <Button
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              recentDays: "All",
                            }));
                            setStateDate([
                              {
                                startDate: "",
                                endDate: "",
                                key: "selection",
                              },
                            ]);
                          }}
                          variant="contained"
                        >
                          {" "}
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                  </Menu>
                </FormControl>
              </div> */}
            </div>
          </Paper>

          <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
            {/* <VendorListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
            {/* <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
            <EnhancedTableToolbar
              setOpenDeleteConfimModal={setOpenDeleteConfimModal}
              numSelected={selected.length}
              usersCount={usersCount}
              allData={data}
            />
            <TableContainer>
              <Table
                id="user-export-to-xlsx"
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />

                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="2">#</TableCell>
                          <TableCell
                            // onClick={() =>
                            //   navigate(`/dashboard/customers/view/${row._id}`)
                            // }
                            style={{ textTransform: "capitalize",letterSpacing:1,fontWeight:600 }}
                            className=""
                            align="left"
                          >
                            {row.coupon_code.toUpperCase()}
                          </TableCell>
                          <TableCell align="left"> </TableCell>
                          <TableCell align="left"> </TableCell>
                          <TableCell align="left">
                            {convertDate(row?.expiry_date)}
                          </TableCell>
                          <TableCell align="center">
                            {/* {convertDate(row?.createdAt) || " old field"} */}
                            ₹{" "}{row.min_amount}
                          </TableCell>
                          {/* <TableCell align="left">{row.email}</TableCell> */}

                         
                          <TableCell
                            align="left"
                          >
                            <p className={row.discount_type == "Amount" ? 'order_delivered' :'order_pending'} >{row.discount_type}</p>
                          </TableCell>
                          <TableCell align="center"  >
                            {row.discount_type == "Amount" ? "₹" : ""}{" "}
                            {row?.discount_value}{" "}
                            {row.discount_type == "Percentage" ? "%" : ""}
                          </TableCell>
                          <TableCell
                            // style={{ textTransform: "uppercase" }}
                            align="left"
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={row?.status}
                                  onChange={(e) => {
                                    changeStaus(row._id);
                                  }}
                                />
                              }
                              label="on/off"
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* <IconButton >
                            <AppRegistrationIcon
                              style={{ cursor: "pointer" }}
                              fontSize="small"
                              onClick={() =>
                                navigate(`/dashboard/edit_coupons/${row._id}`)
                              }
                            />
                              </IconButton>

                            <IconButton
                              onClick={(e) => {
                                setConfirmDelete_id(row._id);
                                setConfirmDelete(true);
                              }}
                              size="medium"
                              style={{ color: "red" }}
                            >
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton> */}

                            <Button variant="text" 
                            onClick={() =>
                              navigate(`/dashboard/edit_coupons/${row._id}`)
                            }
                            style={{boxShadow:'none'}} component="label"
                             startIcon={<Iconify icon="akar-icons:edit" />}>
                            Edit
                           </Button>

                            <Button  
                            onClick={(e) => {
                                              setConfirmDelete_id(row._id);
                                              setConfirmDelete(true);
                                            }}
                            variant="text" style={{color:'#de040c',marginLeft:8,boxShadow:'none'}} 
                            className='banner_delete_btn' 
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            > Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!data.length > 0 && (
                    <TableCell colSpan={9}>
                      {" "}
                      <div className="search-not-found">
                        <img
                          className="search-not-found-img"
                          src={searchNotFound}
                          alt="searchNotFound"
                        />
                        <Typography
                          variant="h6"
                          id="tableTitle"
                          component="div"
                          sx={{ color: "#ababab" }}
                        >
                          No Coupon Found!!
                        </Typography>
                      </div>{" "}
                    </TableCell>
                  )}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="pagination-table-style-box">
              <p className="pagination-table-style">
                {currentPage} of {totalPages || 1} Page
              </p>
              <IconButton onClick={handleOnClickPagePrevious}>
                <Iconify icon="material-symbols:keyboard-arrow-left" />
              </IconButton>
              <IconButton onClick={handleOnClickPageNext}>
                <Iconify icon="material-symbols:keyboard-arrow-right" />
              </IconButton>
            </div>
            {/* <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={usersCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      </div>
    </>
  );
}
