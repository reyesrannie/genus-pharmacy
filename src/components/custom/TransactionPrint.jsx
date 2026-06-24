import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import { useReactToPrint } from "react-to-print";
import logoRdf from "../../assets/logoRdf.png";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";

import TableGrid from "./TableGrid";
import dayjs from "dayjs";
import { useServeOrderMutation } from "../../services/server/api/orderTakerAPI";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/server/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import { usePostOrderMutation } from "../../services/server/api/orderingAPI";

const TransactionPrint = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);
  const postingOrder = useSelector((state) => state.modal.postingOrder);

  const access = user?.role?.access_permission?.map((item) => item?.trim());
  const printableModal = useSelector((state) => state.modal.printableModal);
  const ordering = useSelector((state) => state.modal.ordering);
  const mapOrder = { data: ordering?.order };
  const contentRef = useRef();

  const header = [
    { name: "No.", type: "index" },
    {
      name: "Item",
      type: "order-print",

      children: [
        {
          value: "material",
          child: "name",
          orderBy: 1,
        },
        {
          value: "material",
          child: "code",
          orderBy: 2,
        },

        {
          value: "uom",
          child: "code",
          orderBy: 3,
        },
      ],
    },
    { name: "Qty.", value: "quantity" },
    { name: "Qty Served.", value: "quantity_serve" },

    { name: "Remarks", value: "remarks" },
  ];

  const reactToPrintFn = useReactToPrint({ contentRef });

  const [serveOrder, { isLoading }] = useServeOrderMutation();
  const [postOrder, { isLoading: loadingPost }] = usePostOrderMutation();

  const handleServe = async () => {
    try {
      await serveOrder({ id: ordering?.id }).unwrap();
      enqueueSnackbar("Order consolidated succesfully!", {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handlePost = async () => {
    try {
      await postOrder({ id: ordering?.id }).unwrap();
      enqueueSnackbar("Order posted succesfully!", {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Dialog
      open={printableModal}
      onClose={() => dispatch(resetModal())}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "unset",
          width: "800px",
        },
      }}
    >
      <DialogContent ref={contentRef}>
        <Stack position={"absolute"} top={0} right={2}>
          <IconButton onClick={() => dispatch(resetModal())}>
            <CloseIcon
              sx={{
                fontSize: "20px",
                "@media print": {
                  display: "none",
                },
              }}
            />
          </IconButton>
        </Stack>
        <Stack flexDirection={"row"} justifyContent={"space-between"} mb={2}>
          <Stack>
            <img
              src={logoRdf}
              style={{
                width: "100px",
              }}
            />
          </Stack>
          <Stack>
            <Typography
              fontSize={"16px"}
              fontWeight={700}
              sx={{
                textTransform: "uppercase",
              }}
            >
              Product Request
            </Typography>
            <Typography fontSize={"10px"}>
              {`MIR No: ${ordering?.id}`}
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection={"row"} justifyContent={"space-between"} mb={2}>
          <Stack gap={0.3}>
            <Stack flexDirection={"row"} gap={0.5}>
              <Typography
                fontSize={"12px"}
                fontWeight={700}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Requested By:
              </Typography>
              <Typography
                fontSize={"12px"}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {ordering?.requestor?.name?.toLowerCase()}
              </Typography>
            </Stack>

            {ordering?.updated_by !== null && (
              <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                <Typography fontSize={"12px"} fontWeight={700}>
                  Updated By:
                </Typography>
                <Typography
                  fontSize={"12px"}
                  sx={{
                    textTransform: "capitalize",
                  }}
                  color="warning"
                >
                  {ordering?.updated_by?.toLowerCase()}
                </Typography>
              </Stack>
            )}

            <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
              <Typography fontSize={"12px"} fontWeight={700}>
                Status:
              </Typography>
              <Typography
                fontSize={"12px"}
                sx={{
                  color:
                    {
                      posted: "#065F46",
                      pending: "#b4a305ff",
                      served: "#1E40AF",
                    }[ordering?.status?.toLowerCase()] || "#A0A0A0",
                  textTransform: "capitalize",
                }}
              >
                {ordering?.status?.toLowerCase()}
              </Typography>
            </Stack>

            {ordering?.reason !== null && (
              <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                <Typography fontSize={"12px"} fontWeight={700}>
                  Rush Reason:
                </Typography>
                {/* <BoltIcon color="warning" /> */}

                <Typography
                  fontSize={"12px"}
                  sx={{
                    textTransform: "capitalize",
                  }}
                  color="error"
                >
                  {ordering?.reason?.toLowerCase()}
                </Typography>
              </Stack>
            )}

            <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
              <Typography fontSize={"12px"} fontWeight={700}>
                Type:
              </Typography>
              <Typography
                fontSize={"12px"}
                sx={{
                  color: "#065F46",
                  textTransform: "capitalize",
                }}
              >
                {ordering?.type?.name?.toLowerCase()}
              </Typography>
            </Stack>

            <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
              <Typography fontSize={"12px"} fontWeight={700}>
                Customer:
              </Typography>
              <Typography
                fontSize={"12px"}
                sx={{
                  color:
                    {
                      approved: "#065F46",
                      consolidated: "#065F46",
                      served: "#1E40AF",
                    }[ordering?.status?.toLowerCase()] || "#A0A0A0",
                  textTransform: "capitalize",
                }}
              >
                {`${ordering?.customer?.code?.toLowerCase()} - ${ordering?.customer?.name?.toLowerCase()}`}
              </Typography>
            </Stack>

            <Stack>
              <Typography
                fontSize={"12px"}
                fontWeight={700}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Date information
              </Typography>
              <Stack flexDirection={"row"} gap={0.5}>
                <Typography fontSize={"8px"}>Ordered at</Typography>
                <Typography fontSize={"8px"} fontWeight={700}>
                  {dayjs(ordering?.date_orderd).format("MMMM DD, YYYY")}
                </Typography>
              </Stack>
              <Stack flexDirection={"row"} gap={0.5}>
                <Typography fontSize={"8px"}>Needed on</Typography>
                <Typography fontSize={"8px"} fontWeight={700}>
                  {dayjs(ordering?.date_needed).format("MMMM DD, YYYY")}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            bgcolor={"#F4F6F8"}
            flexDirection={"row"}
            gap={1}
            padding={1}
            borderRadius={2}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                backgroundColor: "#3F51B5",
                width: "12px",
                ml: 1,
              }}
            />
            <Stack
              sx={{
                minWidth: "300px",
              }}
            >
              <Typography fontSize={"12px"} fontWeight={700} color="#1F2937">
                Charging
              </Typography>
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.charging?.code} - ${ordering?.charging?.name}`}</Typography>
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.company?.code} - ${ordering?.company?.name}`}</Typography>
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.business_unit?.code} - ${ordering?.business_unit?.name}`}</Typography>{" "}
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.department?.code} - ${ordering?.department?.name}`}</Typography>{" "}
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.department_unit?.code} - ${ordering?.department_unit?.name}`}</Typography>{" "}
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.sub_unit?.code} - ${ordering?.sub_unit?.name}`}</Typography>
              <Typography
                fontSize={"8px"}
                fontWeight={700}
                color="#828282"
              >{`${ordering?.location?.code} - ${ordering?.location?.name}`}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <TableGrid header={header} items={mapOrder} />
        <Typography fontSize={"10px"} fontWeight={700}>
          MIS-FRM-19-2001
        </Typography>
      </DialogContent>
      {access?.includes("printing") && (
        <DialogActions
          sx={{
            "@media print": {
              display: "none",
            },

            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {serveOrdering && (
            <Button
              color="success"
              variant="contained"
              onClick={() => handleServe()}
              loading={isLoading}
              disabled={
                ordering?.status?.toLowerCase() === "consolidated" ||
                ordering?.status?.toLowerCase() === "pending"
              }
            >
              Serve
            </Button>
          )}

          {postingOrder && (
            <Button
              color="success"
              variant="contained"
              onClick={() => handlePost()}
              loading={loadingPost}
              disabled={ordering?.status?.toLowerCase() === "consolidated"}
            >
              Post
            </Button>
          )}
          <Button
            color="info"
            startIcon={<LocalPrintshopOutlinedIcon />}
            onClick={reactToPrintFn}
          >
            Print
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TransactionPrint;
