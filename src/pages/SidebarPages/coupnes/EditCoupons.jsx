import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDesign from "../../../components/common/FileUploadDesign";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SearchIcon from "@mui/icons-material/Search";
import { Button, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import Iconify from "../../../components/Iconify";
import palette from "../../../theme/palette";
import Autocomplete from "@mui/material/Autocomplete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { uploadFileToFirebase } from "src/global/globalFunctions";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import { UseContextState } from "src/global/GlobalContext/GlobalContext";
import noImage from "../../../assests/No_image.svg";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CancelIcon from "@mui/icons-material/Cancel";
import { editable_config } from "src/editable_config";
import PopupModal from "src/global/Modals/PopupModal";
import ImageError from "src/global/Modals/ImageError";
import ImageLength from "src/global/Modals/ImageLength";
import { useNavigate, useParams } from "react-router-dom";
import utils from "src/utils/utils";
import VideoModal from "src/global/Modals/VideoModal";
import ProductVariationModal from "src/global/Modals/ProductVariationModal";
import { toast } from "react-toastify";
import imageImport from "src/utils/imageImport";

// for auto complete feilds
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function EditCoupons({ handleClose }) {
  const [productData, setProductData] = useState({
    product_main_category: "choose_main_category",
    product_category: "choose_category",
    product_subcategory: "",
    color: [],
    size: [],
    weight: [],
  });
  const [mainCategory, setMainCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [openPopupModal, setOpenPopupModal] = useState(false);
  const [openImageLenghtPopupModal, setOpenImageLenghtPopupModal] =
    useState(false);
  const [openProductLimitModal, setOpenProductLimitModal] = useState(false);
  const [productCount, setProductCount] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
  const [openAddWeightModal, setOpenAddWeightModal] = useState(false);
  const [addCustomSize, setAddCustomSize] = useState("");
  const [addCustomWeight, setAddCustomWeight] = useState("");
  const [customSizeAndWeight, setCustomSizeAndWeight] = useState({
    custom_size: [],
    custom_weight: [],
  });
  const [productVariantFields, setProductVariantFields] = React.useState([
    { anchorEl: null, option_name: "", option_values: [] },
  ]);
  const [productVariant, setProductVariant] = useState([]);
  const [errorMessageVariant, setErrorMessageVariant] = useState({
    index: 0,
    error: false,
  });
  const [openProductVariantModal, setOpenProductVariantModal] = useState(false);
  //  const [productVariant, setProductVariant] = useState([{product_regular_price:'',product_sale_price:'',attributes:[]}])

  //  product_regular_price:{ type:Number},
  //  product_sale_price:{type:Number},
  //  attributes:[
  //      {
  //          value: {type:String},
  //          master_attribute:{type:String},
  //      },
  //  ]

  const [sizes, setsizes] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [searchInSize, setSearchInSize] = React.useState("");
  const { authState } = UseContextState();
  const navigate = useNavigate();
  console.log("PRODUCT productVariantFields", productVariantFields);
  console.log("productVariant=>", productVariant);

  // ===================== PRODUCT VARIANTS FUNCTIONS. =====================

  const handleClickOpenSelectVariantList = (i, event) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i]["anchorEl"] = event.currentTarget;
    setProductVariantFields(newFormValues);
  };
  const handleClickCloseSelectVariantList = (i, event) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i]["anchorEl"] = null;
    setProductVariantFields(newFormValues);
  };

  let removeProductVariants = (i) => {
    let newFormValues = [...productVariantFields];
    newFormValues.splice(i, 1);
    setProductVariantFields(newFormValues);
  };

  let addMoreProductVariants = () => {
    setProductVariantFields([
      ...productVariantFields,
      { option_name: "", option_values: [] },
    ]);
  };

  let handleSelectProductVariantsOption = (i, value) => {
    console.log("value", value, "index", i);
    let newFormValues = [...productVariantFields];
    for (let inner = 0; inner < productVariantFields?.length; inner++) {
      if (productVariantFields[inner]?.option_name === value) {
        console.log(
          "productVariantFields[inner]?.option_name",
          productVariantFields[inner]?.option_name,
          "===",
          value
        );

        newFormValues[i]["option_name"] = "";
        // alert('already exists!!')
        setMessage({ type: "error", message: "Option Name Already Exists !!" });
        setSnackbarOpen(true);
        return;
      }
    }
    newFormValues[i]["option_name"] = value;
    setProductVariantFields(newFormValues);
  };

  let handleChangeProductVariants = (i, e) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i][e.target.name] = e.target.value;
    setProductVariantFields(newFormValues);
  };
  let handleProductVariantsOptionsValue = (i, value) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i]["option_values"] = value;
    setProductVariantFields(newFormValues);
  };

  const createVariantListForPriceFilling = () => {
    let newList = [];

    if (!productVariantFields?.length) {
      setMessage({
        type: "error",
        message: "Add Atleast 1 Product Variant !!",
      });
      setSnackbarOpen(true);
      return;
    }

    if (
      productVariantFields?.length == 1 &&
      !productVariantFields[0]?.option_name?.length
    ) {
      setMessage({ type: "error", message: "Add Option Name !!" });
      setSnackbarOpen(true);
      return;
    }
    // console.log("productVariantFields[0]?.option_values?.length",productVariantFields[0]?.option_values?.length)
    if (
      productVariantFields?.length == 1 &&
      !productVariantFields[0]?.option_values?.length
    ) {
      setMessage({ type: "error", message: "Add Option Values !!" });
      setSnackbarOpen(true);
      return;
    }

    if (
      productVariantFields?.length == 2 &&
      !productVariantFields[1]?.option_name?.length
    ) {
      setMessage({ type: "error", message: "Add Option Name !!" });
      setSnackbarOpen(true);
      return;
    }
    if (
      productVariantFields?.length == 2 &&
      !productVariantFields[1]?.option_values?.length
    ) {
      setMessage({ type: "error", message: "Add Option Values !!" });
      setSnackbarOpen(true);
      return;
    }

    // for 2 variants
    if (productVariantFields?.length == 2) {
      productVariantFields[0]?.option_values?.map((value1, index) => {
        // console.log("value----->>>",value,index)
        productVariantFields[1]?.option_values?.map((value2) => {
          newList?.push({
            product_regular_price: "",
            product_sale_price: "",
            attributes: [value1, value2],
          });
        });
      });
    }

    // for 1 variant
    if (productVariantFields?.length < 2) {
      productVariantFields[0]?.option_values?.map((value1, index) => {
        // console.log("value----->>>",value,index)
        newList?.push({
          product_regular_price: "",
          product_sale_price: "",
          attributes: [value1],
        });
      });
    }

    console.log("allOption===>", newList);
    setProductVariant(newList);

    setOpenProductVariantModal(false);
  };

  // product variants close modal
  function handleCloseProductVariantsModal() {
    setOpenProductVariantModal(false);
  }

  // set price in variants
  const handleChangeProductVariantPrice = (i, e) => {
    let newData = [...productVariant];
    newData[i][e.target.name] = e.target.value;
    setProductVariant(newData);
    setErrorMessageVariant((prev) => ({ ...prev, index: 0, error: false }));
  };

  const removeProductVariantPricefield = (i) => {
    let newData = [...productVariant];
    newData.splice(i, 1);
    setProductVariant(newData);
  };

  //==============  PRODUCT VARIANTS FUNCTIONS =====================

  // GET CUSTOM SIZES AND WEIGHT
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/get/all/custom/sizes/and/weight/${authState?.user?.app_id}`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res?.data------>>>>>>>", res?.data);
        setCustomSizeAndWeight((prev) => ({
          ...prev,
          custom_weight: res?.data?.custom_size_and_weight?.custom_weight,
          custom_size: res?.data?.custom_size_and_weight?.custom_size,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);
  // GET CUSTOM SIZES AND WEIGHT

  const availablecolors = utils.availablecolors;

  //  let availablesizes = utils.availablesizes
  let availablesizes = customSizeAndWeight?.custom_size;

  // const availableWeight = utils.availableWeight
  const availableWeight = customSizeAndWeight?.custom_weight;

  const handleColorsChange = (event, value) => {
    setProductData((prev) => ({ ...prev, color: value }));
  };

  const handleSizeChange = (event, value) => {
    setProductData((prev) => ({ ...prev, size: value }));
  };
  const handleWeightChange = (event, value) => {
    setProductData((prev) => ({ ...prev, weight: value }));
  };

  // check product limit

  //================= GET ALL MAIN CATEGORY =================
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/addproduct/maincategory`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setMainCategory(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/products/count`, {
        headers: {
          Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("PPRODYCT ______", res?.data);
        setProductCount(res?.data.product_count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);

  //================= GET ALL MAIN CATEGORY =================

  // GET CATEGORY BY BRAND
  useEffect(() => {
    if (productData?.product_main_category === "choose_main_category") return;
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?main_category=${productData?.product_main_category}`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setCategory(res?.data);
      });
  }, [productData?.product_main_category]);
  // GET CATEGORY BY BRAND

  // GET SUB CATEGORY BY BRAND
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?category=${productData?.product_category}`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setSubCategory(res?.data[0]?.subcategory);
      });
  }, [productData?.product_category]);
  // GET SUB CATEGORY BY BRAND

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  //############################# IMAGE SIZE ERROR MODAL FUNCTION #############################
  const handleClosePopupModal = () => {
    setOpenPopupModal(false);
    // setIsOpen2(false)
    onYesFunction();
  };

  const onYesFunction = () => {
    // fetchAuthuser()
    // navigate('/dashboard/manage')
  };
  //############################# IMAGE SIZE ERROR MODAL FUNCTION #############################
  //############################# IMAGE lenght ERROR MODAL FUNCTION #############################
  const handleCloseImageLenghtPopupModal = () => {
    setOpenImageLenghtPopupModal(false);
    // setIsOpen2(false)
    onYesFunction();
  };
  const handleImageLenghtOpenPopupModal = () => {
    setOpenImageLenghtPopupModal(true);
    // setIsOpen2(false)
  };

  //############################# IMAGE lenght ERROR MODAL FUNCTION #############################

  // product limit popup handle close function

  // product limit popup handle close function

  // handle close video modal

  // handle open Custom add size modal
  // function handleChangeCustomSize(){
  //   setOpenVideoModal(true)
  // }

  // handle close add size modal
  // function handleCloseAddCustomSizeModal(){
  //   setOpenAddSizeModal(false)
  // }
  // console.log(addCustomSize)

  // handle save custom sizes
  // const handleSaveCustomSize=async(e)=>{
  //   e.preventDefault()
  //   await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/custom/size/for/product/upload/${authState?.user?.app_id}`,{size:addCustomSize},{headers: {
  //     'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  //   },withCredentials:true})
  //   .then(res=>{
  //     console.log("ADD SIZE SUCCESS",res?.data);
  //     setAddCustomSize('')
  //     setMessage((prev)=>({...prev,type:'success',message:'Size Added Successfully !!'}))
  //     setSnackbarOpen(true);
  //     setRender(prev=>!prev)
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //     setMessage((prev)=>({...prev,type:'error',message:'Size Add Failed !!'}))
  //     setSnackbarOpen(true);
  //   })
  // }

  // handle close add weight modal
  // function handleCloseAddCustomWeightModal(){
  //   setOpenAddWeightModal(false)
  // }
  // console.log(addCustomWeight)

  // handle save custom sizes
  // const handleSaveCustomWeight=async(e)=>{
  //   e.preventDefault()
  //   await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/custom/weights/for/product/upload/${authState?.user?.app_id}`,{weight:addCustomWeight},{headers: {
  //     'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  //   },withCredentials:true})
  //   .then(res=>{
  //     console.log("ADD SIZE SUCCESS",res?.data);
  //     setAddCustomWeight('')
  //     setMessage((prev)=>({...prev,type:'success',message:'Weight Added Successfully !!'}))
  //     setSnackbarOpen(true);
  //     setRender(prev=>!prev)
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //     setMessage((prev)=>({...prev,type:'error',message:'Weight Add Failed !!'}))
  //     setSnackbarOpen(true);
  //   })

  // }

  const [anyMinAmount, setAnyMinAmount] = useState("false");

  const [coupon_code_input, setCoupon_code_input] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [description, setDiscription] = useState("");

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/coupon/${id}`, {
        headers: {
          Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("DAta here", res.data.coupon);
        setLoading(false);

        const coupon = res.data.coupon;

        setAnyMinAmount(coupon.min_amount > 0 ? "true" : "false");
        setMinAmount(coupon.min_amount);
        setCoupon_code_input(coupon.coupon_code);
        setExpDate(coupon.expiry_date);
        setDiscountType(coupon.discount_type);
        setDiscountValue(coupon.discount_value);
        setDiscription(coupon.description);

        // toast.success("Coupne Created Successful", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });

        // navigate(-1);

        // setRender((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.warn(err.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }, []);

  const submitHandaler = async (e) => {
    e.preventDefault();
    try {
      if (discountType == "Percentage" && discountValue >= 100) {
        return toast.warn("% Discount less then or equle 100 !!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setLoading(true);

      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/update/coupons/${id}`,
          {
            coupon_code_input,
            minAmount: anyMinAmount == "true" ? minAmount : 0,
            expDate,
            discountType,
            discountValue,
            description,
          },
          {
            headers: {
              Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          setLoading(false);

          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Coupon Updated Successfull !!",
          }));
          setSnackbarOpen(true);

          // navigate(-1);

          setRender((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Unknown Error Occured !!",
          }));
          setSnackbarOpen(true);
        });
      setLoading(false);
    } catch (error) {
      setMessage((prev) => ({
        ...prev,
        type: "error",
        message: "Unknown Error Occured !!",
      }));
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <div className="custom-conatiner">
        {/* #################### ACCOUNT LIMIT PROTECTION ######################## */}

        {/* #################### ACCOUNT LIMIT PROTECTION ######################## */}
        {/*===== IMAGE SIZE ERROR Popup  Modal ====== */}
        <PopupModal
          handleClose={handleClosePopupModal}
          open={openPopupModal}
          data={
            <ImageError
              handleClose={handleClosePopupModal}
              onYes={onYesFunction}
              confirmBtnName="Image Compress Now"
              title="Reduce Image Size!! "
              message="Max Image Upload Size is 1Mb.  For more read our image upload guidelines."
            />
          }
        />
        {/*===== IMAGE SIZE ERROR Popup Modal ====== */}
        {/*=====Number of Image alert Popup Modal ====== */}
        <PopupModal
          handleClose={handleCloseImageLenghtPopupModal}
          open={openImageLenghtPopupModal}
          data={
            <ImageLength
              handleClose={handleCloseImageLenghtPopupModal}
              onYes={handleCloseImageLenghtPopupModal}
              confirmBtnName="Okay, Got it"
              title="Image Error!! "
              message="You can only upload 4 product images. For more read our image upload guidelines."
            />
          }
        />

        {/* #################### LOADING SPINNER ######################## */}
        <Backdrop
          sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* #################### LOADING SPINNER ######################## */}

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
                <h2> Edit Coupons</h2>
                {/* <p>  Add your products for your app</p> */}
              </div>
            </div>
            <div className="addproducts_slider">
              {/* <div className='slider_heading'>
                <h4>Add Products</h4>
                <p>Add your product and necessary information from here</p>
            </div> */}
              {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
              <div className="addproduct_img_and_details flex">
                {/* file upload box */}

                <div className="add_product_form">
                  <form onSubmit={submitHandaler}>
                    <div
                      className="flex add_product_regular_price_and_sale_price"
                      style={{ width: "100%", gap: "10px" }}
                    >
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor=""> Coupon Code </label>
                        <TextField
                          required
                          fullWidth
                          className="product_form_input"
                          id="outlined-basic"
                          name="coupon_code"
                          value={coupon_code_input}
                          onChange={(e) => setCoupon_code_input(e.target.value)}
                          placeholder=" Coupon Code "
                          variant="outlined"
                        />
                      </div>
                    </div>

                    <div
                      className="flex add_product_regular_price_and_sale_price"
                      style={{ width: "100%", gap: "10px" }}
                    >
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label>Discount Type</label>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={discountType}
                          // label="Discount Type"
                          onChange={(e) => {
                            setDiscountType(e.target.value);
                          }}
                          fullWidth={true}
                        >
                          <MenuItem value={"Amount"}>Amount (Flat)</MenuItem>
                          <MenuItem value={"Percentage"}>Percentage</MenuItem>
                        </Select>
                      </div>
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor="">Discount Value</label>
                        <TextField
                          required
                          fullWidth
                          className="product_form_input"
                          id="outlined-basic"
                          name="coupon_code"
                          value={discountValue}
                          onChange={(e) => {
                            setDiscountValue(e.target.value);
                          }}
                          placeholder="Discount Value In Numbers"
                          variant="outlined"
                          type="text"
                        />
                      </div>
                    </div>
                    <div
                      className="add_product_label_input"
                      style={{ width: "100%" }}
                    >
                      <label htmlFor="">Expiry Date</label>
                      <TextField
                        required
                        fullWidth
                        className="product_form_input"
                        id="outlined-basic"
                        name="coupon_code"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        placeholder=" Coupon Code "
                        variant="outlined"
                        s
                        type="datetime-local"
                      />
                    </div>
                    <div className="min">
                      <div
                        className="add_product_label_input"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor="">
                          {" "}
                          Is there any minimum order value?
                        </label>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue={anyMinAmount}
                          name="radio-buttons-group"
                          onChange={(e) => {
                            setAnyMinAmount(e.target.value);
                          }}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            checked={anyMinAmount == "true" ? true : false}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            checked={anyMinAmount == "false" ? true : false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="minAmount">
                      {anyMinAmount == "true" ? (
                        <>
                          <label htmlFor=""> Minimum Order Value </label>
                          <TextField
                            required
                            fullWidth
                            className="product_form_input"
                            id="outlined-basic"
                            name="coupon_code"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            placeholder="Minimum Order Value"
                            variant="outlined"
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    <div
                      className="add_product_label_input"
                      style={{ width: "100%" }}
                    >
                      <label htmlFor="">Coupon Description</label>
                      <TextField
                        required
                        fullWidth
                        className="product_form_input"
                        id="outlined-basic"
                        name="coupon_code"
                        value={description}
                        onChange={(e) => {
                          if (description.length > 25) {
                            return;
                          }
                          setDiscription(e.target.value);
                        }}
                        placeholder="Get 10% Off"
                        variant="outlined"
                        type="text"
                        multiline={true}
                        rows={3}
                      />
                    </div>

                    <div style={{ paddingTop: 20 }}>
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
                      {/* <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="material-symbols:check-circle" />} > Add Product </Button> */}

                      <Button
                        variant="contained"
                        type="submit"
                        style={{ padding: "6px 30px" }}
                        startIcon={
                          <Iconify icon="material-symbols:check-circle" />
                        }
                      >
                        {" "}
                        Save Changes{" "}
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="" style={{ width: "100%" }}>
                  <img src={imageImport?.coupons_page} />
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
}

export default EditCoupons;
