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
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedSnackbars from "../global/Snackbar/CustomSnackbar";
import Iconify from "src/components/Iconify";
import { Button, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { UseContextState } from "src/global/GlobalContext/GlobalContext";
import { editable_config } from "src/editable_config";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import imageImport from "src/utils/imageImport";
import UninstallPluginModal from "src/global/Modals/UninstallPluginModal";
import AppPushNotifiTemplate from "./app_templates/AppPushNotifiTemplate";
import VideoModal from "src/global/Modals/VideoModal";
import noImage from "../assests/No_image.svg";
import { uploadFileToFirebase } from "src/global/globalFunctions";

function PushNotifi() {
  const [openDeleteConfimModal, setOpenDeleteConfimModal] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationTitle, setnotificationTitle] = useState("");
  const [notificationMessage, setnotificationMessage] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [btnUninstallLoading, setbtnUninstallLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const { authState } = UseContextState();
  const navigate = useNavigate();

  // console.log("notification->>>>",notificationTitle,notificationMessage)

  const sendPushNotify = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    setTimeout(async () => {
      let notifi_detail;
      if (fileUpload) {
        const pushNotiImage = await uploadFileToFirebase(
          `/${process.env.REACT_APP_IMAGES_FOLDER_NAME}/push-notification-image/${fileUpload?.name}/`,
          fileUpload
        );
        notifi_detail = {
          notification_title: notificationTitle,
          notification_message: notificationMessage,
          notification_image: pushNotiImage?.image_url,
        };
        console.log("pushNotiImage IMAGES AFTER FIREBASE", pushNotiImage);
      } else {
        notifi_detail = {
          notification_title: notificationTitle,
          notification_message: notificationMessage,
        };
      }
      //    console.log("IMAGES AFTER FIREBASE",pushNotiImage);

      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/send/push/notification/to/app/user/${authState?.user?.app_id}`,
          { ...notifi_detail },
          {
            headers: {
              Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("Plugin Detail=>", res?.data);
          if (res?.data?.status) {
            setLoadingButton(false);
            setSnackbarOpen(true);
            setnotificationTitle("");
            setnotificationMessage("");
            setFileUpload(null);
            setMessage((prev) => ({
              ...prev,
              type: "success",
              message: "Notification Sent Successfully !!",
            }));
          }
          if (!res?.data?.status) {
            setLoadingButton(false);
            setSnackbarOpen(true);
            setMessage((prev) => ({
              ...prev,
              type: "error",
              message: "Unknown error occurred !!",
            }));
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingButton(false);
          setSnackbarOpen(true);
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Unknown error occurred !!",
          }));
        });
    }, 3000);
  };

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  // handle close video modal
  function handleCloseVideoModal() {
    setOpenVideoModal(false);
  }

  // handle open video modal
  function handleOpenVideoModal() {
    // setOpenVideoModal(true)
    const url = "https://google.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const handleCloseSaveAndCancelModal = () => {
    setOpenDeleteConfimModal(false);
    // setIsOpen2(false)
  };

  // ################### NOTIFICATION IMAGE UPLOAD  ########################
  const handleMainCategoryFileChange = async (e) => {
    const image = e.target.files[0];
    console.log("PUSH IMAGES_____", image);
    setFileUpload(image);
  };
  // ################### NOTIFICATION IMAGE UPLOAD  ########################

  return (
    <div className="custom-conatiner">
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
              <h2>Push Notification </h2>
            </div>
          </div>
          <div className="plugin_detail_main_container">
            <div className="plugin-details-box-style plugin-video-main-box">
              <div className="plugin_detail_card_main_box">
                <div className="plugin_card_box">
                  <img
                    src={imageImport.icon_sidebar25}
                    className="plugin_icon"
                  />
                  <div className="flex-columns">
                    <Typography
                      variant="h4"
                      sx={{ paddingBottom: 0.5, textTransform: "capitalize" }}
                    >
                      App Push Notification
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Push notifications are messages that pop up on the screen.
                      This kind of communication is enables them to contact
                      customers instantly, even if they are not using an app at
                      the moment.
                    </Typography>
                  </div>
                </div>
                {/* <div className='install_plugin_detail_btn' >
         
          </div> */}
                <div className="key_feature_box">
                  <Typography variant="h6">Key Features</Typography>
                  <ul className="key_feature_list">
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Increased engagement with users.
                      </Typography>
                    </li>
                    {/* <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Greater customer retention.
                  </Typography>
                    </li> */}
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Personalized offers and triggered messages to end user.
                      </Typography>
                    </li>
                    <li>
                      {" "}
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Efficient upselling and cross-selling strategies.
                      </Typography>
                    </li>
                  </ul>
                </div>

                <form onSubmit={sendPushNotify} className="plugin_config_box">
                  <Typography
                    variant="h4"
                    sx={{ paddingBottom: 0.5, textTransform: "capitalize" }}
                  >
                    {" "}
                    Notification Content{" "}
                  </Typography>

                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor="" className="push_noti_input_label">
                      {" "}
                      Notification Title{" "}
                      <Tooltip
                        title="Shown to app user as notification title."
                        arrow
                        placement="right"
                      >
                        <IconButton size="small">
                          <Iconify icon="ion:help-circle-outline" />
                        </IconButton>
                      </Tooltip>{" "}
                    </label>
                    <TextField
                      required
                      fullWidth
                      value={notificationTitle}
                      onChange={(e) => setnotificationTitle(e.target.value)}
                      className="product_form_input"
                      id="outlined-basic"
                      type="text"
                      name="notification_title"
                      placeholder="App Notification Title "
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor="" className="push_noti_input_label">
                      {" "}
                      Notification Message{" "}
                      <Tooltip
                        title="Shown to app user as notification Message."
                        arrow
                        placement="right"
                      >
                        <IconButton size="small">
                          <Iconify icon="ion:help-circle-outline" />
                        </IconButton>
                      </Tooltip>{" "}
                    </label>
                    <TextField
                      required
                      fullWidth
                      rows={3}
                      multiline
                      value={notificationMessage}
                      onChange={(e) => setnotificationMessage(e.target.value)}
                      className="product_form_input"
                      id="outlined-basic"
                      name="notification_message"
                      placeholder="App Notification Message"
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor="" className="push_noti_input_label">
                      {" "}
                      Notification Image (optional){" "}
                      <Tooltip
                        title="Shown to app user as Notification Image."
                        arrow
                        placement="right"
                      >
                        <IconButton size="small">
                          <Iconify icon="ion:help-circle-outline" />
                        </IconButton>
                      </Tooltip>{" "}
                    </label>
                    <p className="image-recommedation-text">
                      Best Size is 850 x 378 pixels.
                    </p>
                    <div className="main-category-image-change">
                      {fileUpload && (
                        <div className="push-notification_preview_box">
                          <img
                            className="upload-push-notifi-preview-image "
                            alt="notification"
                            src={URL.createObjectURL(fileUpload)}
                          />
                          <IconButton
                            onClick={() => setFileUpload(null)}
                            style={{ color: "text.secondary" }}
                            className="push-notification_preview_close_btn"
                          >
                            <Iconify icon="material-symbols:close" />
                          </IconButton>
                        </div>
                      )}

                      <Button
                        className="image-guide-btn-text"
                        variant="text"
                        component="label"
                        startIcon={
                          <Iconify icon="ant-design:cloud-upload-outlined" />
                        }
                      >
                        Upload
                        <input
                          hidden
                          accept=".png, .jpg, .jpeg, .webp"
                          type="file"
                          name="mainCategoryImage"
                          onChange={handleMainCategoryFileChange}
                        />
                      </Button>
                    </div>
                  </div>

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
                    {/* <Button  type='submit' endIcon={<Iconify icon="carbon:send-filled" />}  variant='contained' > Send Notification </Button> */}
                    <LoadingButton
                      loading={loadingButton}
                      loadingPosition="end"
                      endIcon={<Iconify icon="carbon:send-filled" />}
                      variant="contained"
                      type="submit"
                    >
                      <span>Send Notification</span>
                    </LoadingButton>
                  </div>

                  <div className="app_signing_note">
                    <strong>Note :</strong> App push notification will only work
                    when your app is live.
                  </div>
                </form>
              </div>
            </div>
            <div className="plugin-details-box-style plugin-video-main-box">
              <AppPushNotifiTemplate
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                notificationImage={
                  fileUpload ? URL.createObjectURL(fileUpload) : ""
                }
              />
              {/* <div className='plugin-video-box' >
            <iframe className='app_plugin_video' width="100%" height="517" style={{borderRadius:'20px'}}  src="https://www.youtube.com/embed/AKYebqOCAzY" allowFullScreen  title="YouTube video player" frameborder="0" ></iframe>
                </div> */}
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default PushNotifi;
