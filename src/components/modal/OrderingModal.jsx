import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  TextField as MuiTextField,
  IconButton,
  Divider,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setHasRun,
  setSelectedIndex,
} from "../../services/server/slice/modalSlice";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import "../styles/ChangePassword.scss";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderingSchema from "../schema/orderingSchema";

import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CloseIcon from "@mui/icons-material/Close";

import AppTextBox from "../custom/AppTextBox";
import { decodeUser, getCustomer } from "../../services/functions/saveUser";
import Autocomplete from "../custom/AutoComplete";
import dayjs from "dayjs";
import {
  useLazyMaterialsQuery,
  useMaterialsQuery,
} from "../../services/server/api/materialsAPI";
import useParamsHook from "../../services/hooks/useParamsHook";
import EnterRemarks from "../custom/EnterRemarks";

import {
  handleScroll,
  hasOrderChanged,
} from "../../services/functions/reusableFunctions";

import {
  mapOrderingData,
  mapOrderingPayload,
} from "../../services/functions/dataMapping";

import { useSnackbar } from "notistack";
import {
  setApprove,
  setArchive,
  setCreate,
  setIsNotMatch,
  setPayloadData,
  setReset,
  setServe,
  setUpdate,
} from "../../services/server/slice/promptSlice";
import CreateOrderPrompt from "../custom/CreateOrderPrompt";
import {
  setAssetData,
  setChargingData,
  setMaterialsData,
} from "../../services/server/slice/valuesSlice";
import {
  useLazyOneChargingQuery,
  useOneChargingQuery,
} from "../../services/server/api/oneChargingAPI";
import useParamsHookOrdering from "../../services/hooks/useParamsHookOrdering";

import warningImg from "../../assets/svg/warning.svg";
import AppPrompt from "../custom/AppPrompt";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";
import { cutOffGet } from "../../services/functions/dateChecker";
import {
  useAssetsQuery,
  useLazyAssetsQuery,
} from "../../services/server/api/assetsAPI";
import { FetchDataFn } from "../../services/functions/FetchDataFn";
import { useCustomerQuery } from "../../services/server/api/customerAPI";
import { useOrderTypeQuery } from "../../services/server/api/orderTypeAPI";

const OrderingModal = () => {
  const dispatch = useDispatch();
  const { multipleOrderFetch } = FetchDataFn();

  const [openPicker, setOpenPicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [openRemarks, setOpenRemarks] = useState(false);

  const debounceTimeout = useRef(null);
  const running = useRef(false);

  const customers = getCustomer();
  const user = decodeUser();

  const access = user?.role?.access_permission?.map((item) => item?.trim());
  const createOrdering = useSelector((state) => state.modal.createOrdering);
  const updateOrdering = useSelector((state) => state.modal.updateOrdering);
  const approveOrdering = useSelector((state) => state.modal.approveOrdering);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);
  const hasRun = useSelector((state) => state.modal.hasRun);

  const viewOrdering = useSelector((state) => state.modal.viewOrdering);
  const ordering = useSelector((state) => state.modal.ordering);
  const selectedIndex = useSelector((state) => state.modal.selectedIndex);
  const materialsData = useSelector((state) => state.values.materialsData);
  const assetData = useSelector((state) => state.values.assetData);
  const chargingData = useSelector((state) => state.values.chargingData);
  const warning = useSelector((state) => state.prompt.warning);

  const {
    params: paramsMaterials,
    onSearchData: searchMaterials,
    onSelectPage: onSelectPageMaterials,
    onReset: resetMaterials,
  } = useParamsHookOrdering();

  const {
    params: paramsCharging,
    onSearchData: searchCharging,
    onReset: resetCharging,
    onSelectPage: onSelectPageCharging,
  } = useParamsHook();

  const { data: materials, isError: errorMaterials } =
    useMaterialsQuery(paramsMaterials);

  const [getMaterials, { data: materialsFetch }] = useLazyMaterialsQuery();

  const { data: charging } = useOneChargingQuery(paramsCharging);
  const [getCharging, { data: chargingFetch }] = useLazyOneChargingQuery();

  const { data: customer } = useCustomerQuery({
    status: "active",
    pagination: "none",
  });

  const { data: order_type } = useOrderTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderingSchema),
    defaultValues: {
      order_no: "",
      batch_no: "",
      rush: "",
      reason: "",
      customer: null,
      charging: null,
      date_needed: null,
      type: null,
      year: dayjs(new Date()),
      order: [
        {
          id: new Date(),
          material: null,
          category: null,
          uom: null,
          quantity: "",
          account_title: null,
          remarks: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "order",
  });

  const submitHandler = async (submitData) => {
    const items = {
      ...submitData,
      charging: user?.charging,
      company: user?.company,
      business_unit: user?.business_unit,
      department: user?.department,
      department_unit: user?.department_unit,
      sub_unit: user?.sub_unit,
      location: user?.location,
    };

    const payload = {
      ...mapOrderingPayload(items),
      id: ordering !== null ? ordering?.id : null,
    };

    console.log(payload);
    dispatch(setPayloadData(payload));
    createOrdering && dispatch(setCreate(true));
    updateOrdering && dispatch(setUpdate(true));
    approveOrdering && dispatch(setApprove(true));
  };

  const handleServe = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      id: ordering !== null ? ordering?.id : null,
    };

    dispatch(setIsNotMatch(hasOrderChanged(ordering?.order, payload?.order)));
    dispatch(setPayloadData(payload));
    dispatch(setServe(true));
  };

  const handleReturn = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setReset(true));
  };

  const handleReject = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setArchive(true));
  };

  const mapTransaction = () => {
    if (hasRun) return;
    const data = {
      ...mapOrderingData(
        ordering,
        approveOrdering,
        viewOrdering,
        serveOrdering,
        chargingData,
        customers,
        materialsData,
        order_type?.result || [],
      ),
    };

    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  const handleCheckCharging = () => {
    const matchedCustomer = chargingData?.some(
      (item) => item?.code === ordering?.customer?.code,
    );
    const matchedCharging = chargingData?.some(
      (item) => item?.code === ordering?.charging?.code,
    );

    return matchedCharging && matchedCustomer;
  };

  const handleCheckMaterial = () => {
    const matched = ordering?.order?.every((mats) =>
      materialsData?.some(
        (material) => material?.code === mats?.material?.code,
      ),
    );
    return matched;
  };

  const getValue = useCallback((e, func) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      func(e.target.value);
    }, 500);
  }, []);

  useEffect(() => {
    if (materials?.result?.data) {
      dispatch(setMaterialsData(materials?.result?.data));
    }
    if (materialsFetch?.result?.data) {
      dispatch(setMaterialsData(materialsFetch?.result?.data));
    }
    if (charging?.result?.data) {
      dispatch(setChargingData(charging?.result?.data));
    }
    if (chargingFetch?.result?.data) {
      dispatch(setChargingData(chargingFetch?.result?.data));
    }
  }, [materials, charging, materialsFetch, chargingFetch]);

  useEffect(() => {
    if (ordering !== null) {
      multipleOrderFetch(
        ordering?.order?.map((items) => items?.material?.code),
        handleCheckMaterial,
        getMaterials,
        setMaterialsData,
        running,
      );

      multipleOrderFetch(
        [ordering?.charging?.code, ordering?.customer?.code],
        handleCheckCharging,
        getCharging,
        setChargingData,
        running,
      );
    }
  }, [ordering]);

  useEffect(() => {
    if (
      ordering !== null &&
      handleCheckCharging() &&
      handleCheckMaterial() &&
      chargingData &&
      (viewOrdering ||
        createOrdering ||
        updateOrdering ||
        approveOrdering ||
        serveOrdering)
    ) {
      mapTransaction();
    }
  }, [
    ordering,
    viewOrdering,
    createOrdering,
    updateOrdering,
    approveOrdering,
    serveOrdering,
    chargingData,
  ]);

  useEffect(() => {
    if (customers?.length === 1 && !hasRun && createOrdering) {
      setValue("customer", customers[0]);

      getCharging({
        status: "active",
        search: customers[0]?.charging_code,
      });

      dispatch(setHasRun(true));
    }
  }, [customers, hasRun, createOrdering]);

  return (
    <Dialog
      open={
        viewOrdering ||
        createOrdering ||
        updateOrdering ||
        approveOrdering ||
        serveOrdering
      }
      onClose={() => {
        dispatch(setHasRun(false));
        viewOrdering && reset();
        !viewOrdering && dispatch(setWarning(true));
        viewOrdering && dispatch(resetModal());
      }}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: { xs: "100%", md: "80%" },
          borderRadius: 2,
          // overflowY: { xs: "auto", md: "hidden" },
          paddingTop: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack position={"absolute"} top={10} right={2}>
            <IconButton onClick={() => dispatch(setWarning(true))}>
              <CloseIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Stack>
          <Stack
            gap={2}
            sx={{
              minHeight: { xs: "auto", md: "80vh" },
              maxHeight: { xs: "auto", md: "80vh" },
              overflow: { xs: "hidden", md: "auto" },
            }}
          >
            <Divider orientation="horizontal" />

            <Stack
              gap={2}
              display={{ xs: "flex", md: "grid" }}
              gridTemplateColumns="repeat(3, minmax(250px, 1fr))"
              rowGap={1.5}
              columnGap={2}
              sx={{
                borderRadius: 2,
              }}
            >
              <AppTextBox
                disabled={approveOrdering || viewOrdering || serveOrdering}
                control={control}
                name="order_no"
                label="Order No."
                error={Boolean(errors?.order_no)}
                helperText={errors?.order_no?.message}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />

              <AppTextBox
                disabled={approveOrdering || viewOrdering || serveOrdering}
                control={control}
                name="batch_no"
                label="Batch No."
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                error={Boolean(errors?.batch_no)}
                helperText={errors?.batch_no?.message}
                icon={
                  <Button
                    disabled={dayjs().month() < 10 || dayjs().month() > 11}
                    variant="text"
                    color="info"
                    size="small"
                    sx={{
                      width: "fit-content",
                      minWidth: "unset",
                    }}
                    onClick={() => setShowPicker(true)}
                  >
                    {`${dayjs(new Date(watch("year"))).format("YYYY")} -`}
                  </Button>
                }
              />

              <Autocomplete
                disabled={approveOrdering || viewOrdering || serveOrdering}
                control={control}
                name={"customer"}
                options={
                  approveOrdering || viewOrdering
                    ? chargingData
                    : customers || []
                }
                getOptionLabel={(option) => {
                  const optName =
                    approveOrdering || viewOrdering || serveOrdering
                      ? option?.name
                      : option?.charging_name;
                  const optCode =
                    approveOrdering || viewOrdering || serveOrdering
                      ? option?.code
                      : option?.charging_code;

                  return `${optCode} - ${optName}`;
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onClose={() => {
                  getCharging({
                    status: "active",
                    search: watch("charging")?.charging_name,
                  });
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Customer"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.customer)}
                    helperText={errors.customer?.message}
                  />
                )}
              />

              {user?.order_type?.code === "MT" && (
                <Autocomplete
                  disabled={approveOrdering || viewOrdering || serveOrdering}
                  control={control}
                  name={"customer"}
                  options={customer?.result || []}
                  getOptionLabel={(option) => {
                    return `${option?.code} - ${option?.name}`;
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      label="Customer"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors.customer)}
                      helperText={errors.customer?.message}
                    />
                  )}
                />
              )}
              <Controller
                disabled={approveOrdering || viewOrdering || serveOrdering}
                control={control}
                name="date_needed"
                render={({ field }) => (
                  <MobileDatePicker
                    disabled={approveOrdering || viewOrdering || serveOrdering}
                    open={openPicker}
                    onOpen={() => setOpenPicker(true)}
                    onClose={() => setOpenPicker(false)}
                    minDate={cutOffGet()}
                    maxDate={dayjs().add(1, "year")}
                    label="Date Needed"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    closeOnSelect
                    slotProps={{
                      textField: {
                        size: "small",
                        InputProps: {
                          style: {
                            fontSize: "12px",
                            paddingTop: "3px",
                            paddingBottom: "3px",

                            borderRadius: "6px",
                          },
                        },
                        onClick: () =>
                          !approveOrdering &&
                          !viewOrdering &&
                          setOpenPicker(true),
                        error: Boolean(errors?.date_needed),
                        helperText: errors?.date_needed?.message,
                      },
                    }}
                  />
                )}
              />

              {showPicker && (
                <Controller
                  disabled={approveOrdering || viewOrdering || serveOrdering}
                  control={control}
                  name="year"
                  render={({ field }) => (
                    <MobileDatePicker
                      open={showPicker}
                      onClose={() => setShowPicker(false)}
                      format="YYYY"
                      maxDate={dayjs().add(1, "year")}
                      minDate={dayjs()}
                      label="Date Needed"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      closeOnSelect
                      views={["year"]}
                      renderInput={() => null}
                    />
                  )}
                />
              )}

              <Autocomplete
                disabled={approveOrdering || viewOrdering || serveOrdering}
                control={control}
                name={"type"}
                options={order_type?.result || []}
                getOptionLabel={(option) => {
                  return `${option?.name}`;
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onKeyUp={(e) => {
                  if (e?.target?.value === "") {
                    resetCharging();
                  } else {
                    getValue(e, searchCharging);
                  }
                }}
                scrollChange={(e) =>
                  handleScroll(e, () =>
                    onSelectPageCharging(paramsCharging?.page + 1),
                  )
                }
                noOptionsText={
                  errorMaterials ? "No item found" : "Searching..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Type"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.type)}
                    helperText={errors.type?.message}
                  />
                )}
              />
            </Stack>
            <Stack
              sx={{
                overflowY: "hidden",
                display: "flex",
              }}
            >
              <Stack
                sx={{
                  border: "1px solid #A0A0A0",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: { xs: "auto", md: "auto" },
                  padding: 2,
                  bgcolor: "#F5F5F5",
                  width: "100%",
                }}
              >
                <Typography fontWeight={700}>Cart</Typography>
                {fields.map((item, index) => {
                  return (
                    <Stack key={item?.id} gap={1}>
                      <Stack
                        paddingLeft={1}
                        gap={1}
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Autocomplete
                          disabled={
                            approveOrdering || viewOrdering || serveOrdering
                          }
                          fullWidth
                          control={control}
                          name={`order.${index}.material`}
                          options={materialsData || []}
                          getOptionLabel={(option) =>
                            `${option?.code} - ${option?.name}`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          getOptionDisabled={(option) => {
                            return watch("order")?.some(
                              (order) => order.material?.id === option.id,
                            );
                          }}
                          scrollChange={(e) =>
                            handleScroll(e, () =>
                              onSelectPageMaterials(paramsMaterials?.page + 1),
                            )
                          }
                          onKeyUp={(e) => {
                            if (e?.target?.value === "") {
                              resetMaterials();
                            } else {
                              getValue(e, searchMaterials);
                            }
                          }}
                          noOptionsText={
                            errorMaterials
                              ? "No product found"
                              : "Raw materials..."
                          }
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              fullWidth
                              size="small"
                              label="Raw materials"
                              variant="filled"
                              error={
                                Boolean(errors.order?.[index]?.material) ||
                                Boolean(errors.order?.[index]?.material?.code)
                              }
                              helperText={
                                errors.order?.[index]?.material?.message ||
                                errors.order?.[index]?.material?.code?.message
                              }
                            />
                          )}
                        />
                        <Autocomplete
                          disabled={viewOrdering}
                          control={control}
                          name={`order.${index}.account_title`}
                          options={
                            watch(`order.${index}.material`)?.account_title ||
                            []
                          }
                          getOptionLabel={(option) =>
                            `${option?.account_title.code} - ${option?.account_title?.name}`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              sx={{
                                minWidth: "300px",
                              }}
                              size="small"
                              label="Account Title"
                              variant="filled"
                              error={
                                Boolean(errors.order?.[index]?.account_title) ||
                                Boolean(
                                  errors.order?.[index]?.account_title?.code,
                                )
                              }
                              helperText={
                                errors.order?.[index]?.account_title?.message ||
                                errors.order?.[index]?.account_title?.code
                                  ?.message
                              }
                            />
                          )}
                        />
                        <AppTextBox
                          disabled={
                            approveOrdering || viewOrdering || serveOrdering
                          }
                          control={control}
                          name={`order.${index}.quantity`}
                          size="small"
                          variant="filled"
                          label="Quantity"
                          sx={{
                            minWidth: "100px",

                            "& .MuiFilledInput-input": {
                              fontSize: "12px",
                            },
                          }}
                          endIcon={
                            <Typography>
                              {watch(`order.${index}.material`)?.uom?.code}
                            </Typography>
                          }
                          error={Boolean(errors.order?.[index]?.quantity)}
                          helperText={errors.order?.[index]?.quantity?.message}
                        />

                        <AppTextBox
                          disabled={
                            approveOrdering || viewOrdering || serveOrdering
                          }
                          control={control}
                          name={`order.${index}.remarks`}
                          size="small"
                          variant="filled"
                          sx={{
                            minWidth: "100px",

                            "& .MuiFilledInput-root": {
                              backgroundColor: "#0000001f",
                            },
                            "& .MuiFilledInput-input": {
                              fontSize: "12px",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              cursor: "pointer",
                            },
                          }}
                          label="Remarks"
                          onClick={() => {
                            dispatch(setSelectedIndex(index));
                            setOpenRemarks(true);
                          }}
                          inputProps={{
                            readOnly: true,
                          }}
                          error={Boolean(errors.order?.[index]?.remarks)}
                          helperText={errors.order?.[index]?.remarks?.message}
                        />
                        {(createOrdering || updateOrdering) && (
                          <IconButton
                            disabled={watch("order")?.length === 1}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <RemoveCircleOutlineOutlinedIcon
                              color={
                                watch("order")?.length === 1
                                  ? "disabled"
                                  : `error`
                              }
                            />
                          </IconButton>
                        )}
                      </Stack>
                      <Divider
                        orientation="horizontal"
                        sx={{
                          borderColor: "#A0A0A0",
                          marginBottom: 1.5,
                        }}
                      />
                    </Stack>
                  );
                })}
                {(createOrdering || updateOrdering) && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      append({
                        id: new Date(),
                      });
                    }}
                  >
                    Add Order
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack alignItems={"flex-end"}>
            {(createOrdering || updateOrdering) && (
              <Stack flexDirection={"row"} gap={1} alignItems="center">
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={
                    fields.length === 0 ||
                    watch("order_no") === "" ||
                    watch("date_needed") === null ||
                    watch("type") === null ||
                    watch("customer") === null ||
                    watch("batch_no") === ""
                  }
                  startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                  size="small"
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  Check out
                </Button>
                {/* {updateOrdering && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteForeverOutlinedIcon />}
                    size="small"
                    sx={{
                      textTransform: "uppercase",
                    }}
                    onClick={() => {
                      handleReject();
                    }}
                  >
                    Archive
                  </Button>
                )} */}
              </Stack>
            )}

            {approveOrdering && (
              <Stack flexDirection={"row"} gap={2} alignItems="center">
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  startIcon={<ThumbUpOutlinedIcon />}
                  size="small"
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<UpdateOutlinedIcon />}
                  size="small"
                  onClick={() => {
                    handleReturn();
                  }}
                >
                  Return
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RemoveCircleOutlineOutlinedIcon />}
                  size="small"
                  onClick={() => {
                    handleReject();
                  }}
                >
                  Reject
                </Button>
              </Stack>
            )}

            {serveOrdering && (
              <Stack flexDirection={"row"} gap={2} alignItems="center">
                {access?.includes("order_taker") && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ThumbUpOutlinedIcon />}
                    size="small"
                    onClick={() => {
                      handleServe();
                    }}
                  >
                    Consolidate
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </DialogActions>
      </form>

      <EnterRemarks
        currentValue={watch(`order.${selectedIndex}.remarks`)}
        open={openRemarks}
        submitData={(e) => {
          setValue(`order.${selectedIndex}.remarks`, e);
        }}
        setOpen={setOpenRemarks}
      />

      <CreateOrderPrompt />

      <AppPrompt
        open={warning}
        image={warningImg}
        title={`Warning`}
        message={`All changes that have not been saved will be discarded upon closing.`}
        confirmButton={`Yes, Close it!`}
        cancelButton={`No, Keep it! `}
        confirmOnClick={() => {
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default OrderingModal;
