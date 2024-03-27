import React, { useState, useEffect, useRef } from "react";
import {
  MenuItem,
  OutlinedInput,
  Chip,
  InputLabel,
  Checkbox,
  ListItemText,
  FormControl,
  Select,
  InputAdornment,
  Tooltip,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import Iconify from "src/components/Iconify";
import { Button, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { UseContextState } from "src/global/GlobalContext/GlobalContext";

import { editable_config } from "src/editable_config";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import imageImport from "src/utils/imageImport";
import LoadingSpinner from "src/components/Spinner";
import "./wallet.css";
import AppPushNotifiTemplate from "src/pages/app_templates/AppPushNotifiTemplate";

function Wallet() {
  const [openDeleteConfimModal, setOpenDeleteConfimModal] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [isInstalled, setIsInstalled] = useState(false);
  const [razorpayKeyId, setrazorpayKeyId] = useState("");
  const [razorpayKeySecret, setrazorpayKeySecret] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnUninstallLoading, setbtnUninstallLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const { authState } = UseContextState();
  const navigate = useNavigate();

  const [coinPrice, setCoinPrice] = useState(0);
  const [minAmountForWallerUser, setMinAmountForWallerUser] = useState(0);
  const [perReferAmount, setPerReferAmount] = useState(0);

  const [walletStatus, setWalletStatus] = useState(false);
  const [variationCoin, setVariationCoin] = useState([]);

  useEffect(() => {
    setPageLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/wallet/data`, {
        headers: {
          Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setCoinPrice(
          res?.data.wallet_data ? res?.data?.wallet_data?.one_coin_price : 0
        );
        setPerReferAmount(
          res?.data?.wallet_data ? res?.data?.wallet_data?.coins_per_refer : 0
        );

        setMinAmountForWallerUser(
          res?.data?.wallet_data
            ? res?.data?.wallet_data?.min_amount_wallet_use
            : 0
        );
        setWalletStatus(
          res?.data?.wallet_data ? res?.data?.wallet_data?.is_wallet_active : 0
        );
        setVariationCoin(
          res?.data?.wallet_data ? res?.data?.wallet_data?.coin_gift_range : []
        );
        setPageLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const activePluginBtn = async (e) => {
    e.preventDefault();
    const plugin_detail = {
      coinPrice: coinPrice,
      perReferAmount: perReferAmount,
      min_amount_wallet_use: minAmountForWallerUser,
      walletStatus,
      rangeArrya: variationCoin,
    };
    console.log("plugin_detail", plugin_detail);
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/update/wallet/data`,
        { ...plugin_detail },
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("Plugin Detail=>", res);

        setSnackbarOpen(true);
        setMessage((prev) => ({
          ...prev,
          type: "success",
          message: "Wallet Updated Successfully !!",
        }));
        setRender((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarOpen(true);
        setMessage((prev) => ({
          ...prev,
          type: "error",
          message: "Unknown error occurred !!",
        }));
      });
  };

  const addCoinRange = (e) => {
    e.preventDefault();
    const data = [...variationCoin];
    data.push({ min_range: "", max_range: "", gift_coin: "" });
    setVariationCoin(data);
  };
  const deleteRangeArea = (e, i) => {
    e.preventDefault();
    const data = [...variationCoin];
    data.splice(i, 1);
    setVariationCoin(data);
  };

  const changeMinValue = (e, val, i) => {
    e.preventDefault();
    const data = [...variationCoin];
    data[i].min_range = val;
    setVariationCoin(data);
  };
  const changeMaxValue = (e, val, i) => {
    e.preventDefault();
    const data = [...variationCoin];
    data[i].max_range = val;
    setVariationCoin(data);
  };
  const changeCoinValue = (e, val, i) => {
    e.preventDefault();
    const data = [...variationCoin];
    data[i].gift_coin = val;
    setVariationCoin(data);
  };

  return (
    <div className="custom-conatiner">
      <LoadingSpinner loading={pageLoading} />

      {/* #################### SANCKBAR MESSAGE ######################## */}
      <CustomizedSnackbars
        onOpen={snackbarOpen}
        type={message?.type}
        handleClose={handleCloseSnackbar}
        message={message?.message}
      />

      {/* #################### SANCKBAR MESSAGE ######################## */}
      <Paper elevation={4}>
        <div className="product-conatiner">
          <div className="inner-page-heading-box">
            <IconButton sx={{ color: "black" }} onClick={() => navigate(-1)}>
              <Iconify icon="material-symbols:arrow-back-rounded" />
            </IconButton>
            <div>
              <h2>Loyalty Program</h2>
            </div>
          </div>
          <div className="plugin_detail_main_container">
            <div className="plugin-details-box-style plugin-video-main-box">
              <div className="plugin_detail_card_main_box">
                <div className="plugin_card_box">
                  <img
                    src={imageImport.icon_sidebar26}
                    className="plugin_icon"
                  />
                  <div className="flex-columns">
                    <Typography
                      variant="h4"
                      sx={{ paddingBottom: 0.5, textTransform: "capitalize" }}
                    >
                     Customer Loyalty Program
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                     With the help of the loyalty program, you can award your customers loyalty Coins for each order they place with your business. They will be more likely to place repeat orders from your store as a result.
                    </Typography>
                  </div>
                </div>

                <div className="key_feature_box">
                  <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                    Key Features
                  </Typography>
                  <ul className="key_feature_list">
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                       Give consumers loyalty coins for each transaction they make.
                      </Typography>
                    </li>
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                       Refer & Earn Program | Customer can earn coins when they refer their friends.
                      </Typography>
                    </li>
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                     Customers can view & use their loyalty coins to get discounts on future purchases.
                      </Typography>
                    </li>
                  </ul>
                </div>

                <div className="wallet-active-on-off-box">
                <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                    Status 
                  </Typography>
                 <FormControlLabel
                    control={
                      <Switch
                        checked={walletStatus}
                        onChange={(e) => setWalletStatus(!walletStatus)}
                      />
                    }
                    label="ON/OFF "
                  />
                </div>

                <form onSubmit={activePluginBtn} className="" style={{marginTop:14}} >
                  {walletStatus ? (
                    <>
                      <Typography
                        variant="h4"
                        sx={{ paddingBottom: 0.5, textTransform: "capitalize" }}
                      >
                        {" "}
                        Configure  Program
                      </Typography>

                      <div
                      className="flex add_product_regular_price_and_sale_price"
                      style={{ width: "100%", gap: "10px" }}
                    >
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor=""> One Loyalty Coin Equal to ₹ </label>
                        <TextField
                          required
                          fullWidth
                          value={coinPrice}
                          onChange={(e) => setCoinPrice(e.target.value)}
                          className="product_form_input"
                          id="outlined-basic"
                          name="shiprocket_razorpayKeyId"
                          placeholder="One Loyalty Coin Equal to ₹ "
                          variant="outlined"
                          type="number"
                        />
                      </div>
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor=""> Coins Per Refer </label>
                        <TextField
                          required
                          fullWidth
                          value={perReferAmount}
                          onChange={(e) => setPerReferAmount(e.target.value)}
                          className="product_form_input"
                          id="outlined-basic"
                          name="shiprocket_user_password"
                          placeholder="Coins Per Refer"
                          variant="outlined"
                          type="number"
                        />
                      </div>
                      </div>
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor=""> Min. Order Amount To Use Loyalty Coins </label>
                        <TextField
                          required
                          fullWidth
                          value={minAmountForWallerUser}
                          onChange={(e) =>
                            setMinAmountForWallerUser(e.target.value)
                          }
                          className="product_form_input"
                          id="outlined-basic"
                          name="shiprocket_razorpayKeyId"
                          placeholder="Min. Order Amount To Use Loyalty Coins"
                          variant="outlined"
                          type="number"
                        />
                      </div>
                      <div className="add_product_label_input " style={{ width: "100%" }} >
                        <div className="add-range-main-box" >
                        {/* <label htmlFor=""> Add Coin Range </label> */}

                        <div>
                        <Typography variant="p">Add Coins Range</Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                            className="product_Variant_desc"
                          >
                            Coins according to each transaction they made.
                          </Typography>
                        </div>
                        <div className="button_add_range">
                            <Button
                              type="submit"
                              startIcon={<Iconify icon="quill:add" />}
                              variant="text"
                              onClick={(e) => {
                                addCoinRange(e);
                              }}
                            >
                              {" "}
                              Add More{" "}
                            </Button>
                          </div>
                        </div>
                        <div className="ranges_div">
                      
                          {variationCoin.map((ele, i) => {
                            return (
                              <>
                               {i === 0 && (
                               <div className="product_variant_heading">
                               <p>Min. Range</p>
                               <p>Max. Range</p>
                               <p>Coins</p>
                               <p style={{ visibility: "hidden" }}>
                               M Price
                               </p>
                             </div>)}
                              <div key={i} className="range_area">
                                <TextField
                                  required
                                  fullWidth
                                  value={ele.min_range}
                                  onChange={(e) =>
                                    changeMinValue(e, e.target.value, i)
                                  }
                                  className="product_form_input"
                                  id="outlined-basic"
                                  name="shiprocket_razorpayKeyId"
                                  placeholder="Min. Range"
                                  variant="outlined"
                                  type="number"
                                  size="small"
                                />
                                <TextField
                                  required
                                  fullWidth
                                  value={ele.max_range}
                                  onChange={(e) =>
                                    changeMaxValue(e, e.target.value, i)
                                  }
                                  className="product_form_input"
                                  id="outlined-basic"
                                  name="shiprocket_razorpayKeyId"
                                  placeholder="Max. Range"
                                  variant="outlined"
                                  type="number"
                                  size="small"
                                />
                                <TextField
                                  required
                                  fullWidth
                                  value={ele.gift_coin}
                                  onChange={(e) =>
                                    changeCoinValue(e, e.target.value, i)
                                  }
                                  className="product_form_input"
                                  id="outlined-basic"
                                  name="shiprocket_razorpayKeyId"
                                  placeholder="Coins"
                                  variant="outlined"
                                  type="number"
                                  size="small"
                                />
                                <IconButton
                                size="small"
                                  onClick={(e) => {
                                    deleteRangeArea(e, i);
                                  }}
                                >
                                  <Iconify icon="ep:remove" />
                                </IconButton>
                              </div>
                               </>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                    
                  <div className="plugin_config_active_btn">
                    <Button
                      variant="text"
                      style={{ marginRight: "10px" }}
                      onClick={() => navigate(-1)}
                      startIcon={
                        <Iconify icon="material-symbols:arrow-back-rounded" />
                      }
                    >
                      {" "}
                      Go Back{" "}
                    </Button>
                    <Button
                      type="submit"
                      endIcon={
                        <Iconify icon="material-symbols:check-circle-rounded" />
                      }
                      variant="contained"
                    >
                      {" "}
                      Update{" "}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="plugin-details-box-style plugin-video-main-box">
              <div className="plugin-video-box">
                <img src={imageImport?.loyalty_program_img} alt="" srcset="" />
                {/* <iframe
                  className="app_plugin_video"
                  width="100%"
                  height="517"
                  style={{ borderRadius: "20px" }}
                  src="https://www.youtube.com/embed/aTZ_XW2NaQ8"
                  allowFullScreen
                  title="YouTube video player"
                  frameborder="0"
                ></iframe> */}
              </div>
            </div>
             {/* <div className="plugin-details-box-style plugin-video-main-box">
              <AppPushNotifiTemplate
                notificationTitle={"notificationTitle"}
                notificationMessage={"notificationMessage"}
              />
          </div> */}
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default Wallet;
