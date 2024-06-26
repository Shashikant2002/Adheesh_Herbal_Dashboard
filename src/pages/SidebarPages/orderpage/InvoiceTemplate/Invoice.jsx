import React, { useState, useEffect } from "react";
import {
  Toolbar,
  TextField,
  Container,
  FormControl,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  InputAdornment,
  colors,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import "./invoice.css";
import { editable_config } from "src/editable_config";
import { convertDateForOrder } from "src/global/globalFunctions";
import { UseContextState } from "src/global/GlobalContext/GlobalContext";
import axios from "axios";

function Invoice({ orderDetail }) {
  const { authState } = UseContextState();
  const [invoiceDetails, setInvoiceDetails] = useState({
    company_name: "",
    company_address: "",
    company_phone_number: "",
    company_state: "",
    company_zipcode: "",
    gst_number: "gst_number",
  });
  const [loading, setLoading] = useState(false);
  console.log("orderDetails-----------", orderDetail);

  let sub_total = 0;
  for (let i = 0; i < orderDetail?.products?.length; i++) {
    sub_total =
      sub_total +
      orderDetail?.products[i]?.product_sale_price *
        orderDetail?.products[i]?.product_quantity;
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/get/users/invoice/details/${authState?.user?.app_id}`,
        {
          headers: {
            Authorization: `token ${editable_config.FRONTEND_VALIDATOR}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log("details",res?.data);
        setInvoiceDetails((prev) => ({
          ...prev,
          company_name: res?.data?.details?.invoice_details?.company_name,
          company_address: res?.data?.details?.invoice_details?.company_address,
          company_phone_number:
            res?.data?.details?.invoice_details?.company_phone_number,
          company_state: res?.data?.details?.invoice_details?.company_state,
          company_zipcode: res?.data?.details?.invoice_details?.company_zipcode,
          gst_number: res?.data?.details?.invoice_details?.gst_number,
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* #################### LOADING SPINNER ######################## */}

      <div class="invoice-main-container">
        <div class="invoice-main-inner ">
          <div class="row-invoice mt-4">
            <div class="col-12 col-lg-12">
              <div class="row-invoice">
                <div class="text-center text-150"></div>
              </div>
              <div class="row-invoice">
                <div class="text-center text-150">
                  <h3 class="">INVOICE</h3>
                </div>
                <div class="invoice-store-owner-detail-box font-capitalize-case">
                  <h3>
                    {invoiceDetails?.company_name
                      ? invoiceDetails?.company_name
                      : "Your Company Name"}
                  </h3>
                  <p>
                    {invoiceDetails?.gst_number ? (
                      <>
                        <b>GSTIN: </b> {invoiceDetails?.gst_number}
                      </>
                    ) : (
                      ""
                    )}
                  </p>
                  <p>
                    {invoiceDetails?.company_address
                      ? invoiceDetails?.company_address
                      : "Your Company Address"}
                  </p>
                  <p style={{ paddingLeft: "10px" }}>
                    {invoiceDetails?.company_state
                      ? invoiceDetails?.company_state
                      : "Your State"}
                    ,{" "}
                    {invoiceDetails?.company_zipcode
                      ? invoiceDetails?.company_zipcode
                      : "Your Zipcode"}
                  </p>
                  <p>
                    {invoiceDetails?.company_phone_number
                      ? invoiceDetails?.company_phone_number
                      : "Your Phone Number"}
                  </p>
                </div>
              </div>

              <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

              <div class="row-invoice">
                <div class="invoice-customer-detail-box">
                  <h4>To : {orderDetail?.customer_name?.toUpperCase()}</h4>
                  <div className="invoice-customer-details">
                    <p>{orderDetail?.shipping_address}</p>
                    <p>
                      {" "}
                      {orderDetail?.state}, {orderDetail?.pincode}{" "}
                    </p>
                    <p>
                      {" "}
                      <strong>Payment Mode :</strong>{" "}
                      {orderDetail?.payment_mode}
                    </p>
                  </div>
                </div>

                <div class="invoice-customer-detail-box-right">
                  <div className="invoice-customer-details">
                    <p>
                      <strong>Invoice ID :</strong> {orderDetail?.order_id}
                    </p>
                    <p>
                      <strong>Date & Time :</strong>{" "}
                      {convertDateForOrder(orderDetail?.createdAt)}
                    </p>
                    <p>
                      {" "}
                      <strong>Mobile : </strong>+91-
                      {orderDetail?.customer_phone_number}
                    </p>
                    <p style={{ textTransform: "lowercase" }}>
                      <strong style={{ textTransform: "capitalize" }}>
                        Email :{" "}
                      </strong>{" "}
                      {orderDetail?.customer_email}
                    </p>
                  </div>
                </div>
              </div>
              <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />
              <div class="mt-4">
                <TableContainer>
                  <Table sx={{ minWidth: 850 }} aria-label="simple table">
                    <TableHead sx={{ fontWeight: "900" }}>
                      <TableRow>
                        <TableCell align="left">
                          <h4>#</h4>
                        </TableCell>
                        <TableCell align="left">
                          <h4>Products</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Quantity</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4>Price</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4>Amount</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail?.products?.map((value, index) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell style={{ maxWidth: 250 }} align="left">
                            {" "}
                            {value?.product_name?.toUpperCase()}
                            {value?.product_code
                              ? ` | code: ${value?.product_code}`
                              : ""}
                            {value?.selected_variation &&
                            value?.selected_variation[0]
                              ? ` | ${value?.selected_variation[0]}`
                              : ""}
                            {value?.selected_variation &&
                            value?.selected_variation[1]
                              ? ` | ${value?.selected_variation[1]}`
                              : ""}
                          </TableCell>
                          <TableCell align="center">
                            {value?.product_quantity}
                          </TableCell>
                          <TableCell align="right">
                            Rs.{value?.product_sale_price}
                          </TableCell>
                          <TableCell align="right">
                            Rs.
                            {value?.product_quantity *
                              value?.product_sale_price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

                <div class="row-invoice mt-3">
                  <div class="col-12 col-sm-6 text-grey-d2 text-95 mt-2 mt-lg-0">
                    {/* Extra note such as company or payment information... */}
                  </div>
                  <div class="invoice-customer-detail-box-right">
                    <div className="invoice-customer-total-details">
                      <p className="total-amount-box">
                        <strong>Sub Total :</strong> Rs.{sub_total}
                      </p>

                      <p className="total-amount-box">
                        <strong style={{ paddingRight: "13px" }}>
                          Delivery & Shipping :{" "}
                        </strong>{" "}
                        + Rs.{orderDetail?.delivery_charges}
                      </p>

                      {orderDetail.used_wallet_amount.coins_used ? (
                        <>
                          <p className="total-amount-box">
                            <strong>Coins Used :</strong>{" "}
                            {orderDetail.used_wallet_amount.coins_used}
                          </p>
                          <p className="total-amount-box">
                            <strong>
                              {orderDetail?.used_wallet_amount?.coins_used} X
                              coin value is{" "}
                              {orderDetail?.used_wallet_amount?.coin_value} :
                            </strong>{" "}
                            - Rs.
                            {orderDetail?.used_wallet_amount?.coins_used *
                              orderDetail?.used_wallet_amount?.coin_value}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                      {orderDetail?.coupon_discount ? (
                        <>
                          <p className="total-amount-box">
                            <strong>
                              Coupon Discount (
                              {orderDetail?.coupon_discount?.coupon_code}) :
                            </strong>{" "}
                            - Rs.{" "}
                            {/* {orderDetail.coupon_discount.discount_value} */}
                            {(orderDetail?.coupon_discount?.discount_type?.toLowerCase() ==
                            "amount"
                              ? orderDetail?.coupon_discount.discount_value
                              : (orderDetail?.coupon_discount.discount_value /
                                  100) *
                                parseInt(orderDetail?.order_total)
                            ).toFixed(1)}
                          </p>
                        </>
                      ) : (
                        ""
                      )}

                      <hr />

                      <p className="total-amount-box total-amount-detail">
                        {" "}
                        <strong style={{ paddingRight: "13px" }}>
                          Total Amount :{" "}
                        </strong>
                        <strong>
                          Rs.
                          {/* {orderDetail?.coupon_discount?.discount_value
                            ? orderDetail?.delivery_charges +
                              parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value -
                              orderDetail?.coupon_discount?.discount_value
                            : orderDetail?.delivery_charges +
                              parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value} */}
                          {/* {orderDetail?.coupon_discount?.discount_value
                            ? parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value -
                              orderDetail?.coupon_discount?.discount_value
                            : parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value} */}
                          {(orderDetail?.coupon_discount?.discount_value
                            ? parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value -
                              Number(
                                orderDetail?.coupon_discount?.discount_type?.toLowerCase() ==
                                  "amount"
                                  ? orderDetail?.coupon_discount.discount_value
                                  : (orderDetail?.coupon_discount
                                      .discount_value /
                                      100) *
                                      parseInt(orderDetail?.order_total)
                              )
                            : parseInt(orderDetail?.order_total) -
                              orderDetail?.used_wallet_amount?.coins_used *
                                orderDetail?.used_wallet_amount?.coin_value
                          ).toFixed(1)}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "80px", textAlign: "center" }}>
                  <p class="">
                    Have a Nice Day, Thank You For Shopping With Us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
