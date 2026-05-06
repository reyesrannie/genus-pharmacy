import dayjs from "dayjs";
import { batch } from "react-redux";

export const mapOrderingPayload = (submitData) => {
  const payload = {
    order_no: submitData?.order_no,
    rush: submitData?.rush,
    reason: submitData?.reason,
    date_needed: dayjs(submitData?.date_needed).format("YYYY-MM-DD"),
    batch_no: `${dayjs(submitData?.year).format("YYYY")}-${submitData?.batch_no}`,
    customer:
      submitData?.customer?.charging_id !== undefined
        ? {
            id: submitData?.customer?.charging_id,
            code: submitData?.customer?.charging_code,
            name: submitData?.customer?.charging_name,
          }
        : {
            id: submitData?.customer?.sync_id,
            code: submitData?.customer?.code,
            name: submitData?.customer?.name,
          },
    charging: {
      id: submitData?.charging?.id,
      code: submitData?.charging?.code,
      name: submitData?.charging?.name,
    },

    company: {
      id: submitData?.company?.id || "",
      code: submitData?.company?.code || "",
      name: submitData?.company?.name || "",
    },
    business_unit: {
      id: submitData?.business_unit?.id || "",
      code: submitData?.business_unit?.code || "",
      name: submitData?.business_unit?.name || "",
    },
    department: {
      id: submitData?.department?.id || "",
      code: submitData?.department?.code || "",
      name: submitData?.department?.name || "",
    },
    department_unit: {
      id: submitData?.department_unit?.id || "",
      code: submitData?.department_unit?.code || "",
      name: submitData?.department_unit?.name || "",
    },
    sub_unit: {
      id: submitData?.sub_unit?.id || "",
      code: submitData?.sub_unit?.code || "",
      name: submitData?.sub_unit?.name || "",
    },
    location: {
      id: submitData?.location?.id || "",
      code: submitData?.location?.code || "",
      name: submitData?.location?.name || "",
    },
    type: {
      id: submitData?.type?.id || "",
      name: submitData?.type?.name || "",
    },
    order: submitData?.order?.map((items) => ({
      material: {
        id: items?.material?.id,
        code: items?.material?.code,
        name: items?.material?.name,
      },
      category: {
        id: items?.material?.category?.id,
        name: items?.material?.category?.name,
      },
      uom: {
        id: items?.material?.uom?.id,
        code: items?.material?.uom?.code,
        description: items?.material?.uom?.description,
      },
      account_title: {
        id: items?.account_title?.account_title?.id,
        code: items?.account_title?.account_title?.code,
        name: items?.account_title?.account_title?.name,
      },
      quantity: items?.quantity,
      remarks: items?.remarks || "",
    })),
  };

  return payload;
};

export const mapPayloadApproverImport = (submitData, charging) => {
  const chargingValue = charging?.find(
    (c) => c.code === submitData?.charging_code?.toString(),
  );

  const payload = {
    approver_id: submitData?.approver_id || null,
    approver_name: submitData?.approver_name || "",

    charging: {
      id: chargingValue?.id || "",
      code: submitData?.charging_code || "",
      name: submitData?.charging_name || "",
    },

    company: {
      id: chargingValue?.company_id || "",
      code: submitData?.company_code || "",
      name: submitData?.company_name || "",
    },

    business_unit: {
      id: chargingValue?.business_unit_id || "",
      code: submitData?.business_code || "",
      name: submitData?.business_name || "",
    },

    department: {
      id: chargingValue?.department_id || "",
      code: submitData?.department_code || "",
      name: submitData?.department_name || "",
    },

    department_unit: {
      id: chargingValue?.department_unit_id || "",
      code: submitData?.unit_code || "",
      name: submitData?.unit_name || "",
    },

    sub_unit: {
      id: chargingValue?.sub_unit_id || "",
      code: submitData?.subunit_code || "",
      name: submitData?.subunit_name || "",
    },

    location: {
      id: chargingValue?.location_id || "",
      code: submitData?.location_code || "",
      name: submitData?.location_name || "",
    },
  };

  return payload;
};

export const mapPayloadUserImport = (submitData, charging) => {
  const chargingValue = charging?.find(
    (c) => c.code === submitData?.charging?.toString(),
  );
  const scopeValue = charging?.find(
    (c) => c.code === submitData?.scope_order?.toString(),
  );

  const payload = {
    ...submitData,

    charging: {
      id: chargingValue?.id || "",
      code: chargingValue?.code || "",
      name: chargingValue?.name || "",
    },

    company: {
      id: chargingValue?.company_id || "",
      code: chargingValue?.company_code || "",
      name: chargingValue?.company_name || "",
    },

    business_unit: {
      id: chargingValue?.business_unit_id || "",
      code: chargingValue?.business_unit_code || "",
      name: chargingValue?.business_unit_name || "",
    },

    department: {
      id: chargingValue?.department_id || "",
      code: chargingValue?.department_code || "",
      name: chargingValue?.department_name || "",
    },

    department_unit: {
      id: chargingValue?.department_unit_id || "",
      code: chargingValue?.department_unit_code || "",
      name: chargingValue?.department_unit_name || "",
    },

    sub_unit: {
      id: chargingValue?.sub_unit_id || "",
      code: chargingValue?.sub_unit_code || "",
      name: chargingValue?.sub_unit_name || "",
    },

    location: {
      id: chargingValue?.location_id || "",
      code: chargingValue?.location_code || "",
      name: chargingValue?.location_name || "",
    },
    scope_order: {
      charging_id: scopeValue?.sync_id,
      charging_code: scopeValue?.code,
      charging_name: scopeValue?.name,
    },
  };

  return payload;
};

export const mapPayloadUser = (submitData) => {
  const payload = {
    account_code: submitData?.account_code?.general_info?.full_id_number,
    account_name: submitData?.account_name,
    mobile_no: submitData?.mobile_no,
    charging: {
      id: submitData?.charging?.sync_id,
      code: submitData?.charging?.code,
      name: submitData?.charging?.name,
    },
    company: {
      id: submitData?.charging?.company_id,
      code: submitData?.charging?.company_code,
      name: submitData?.charging?.company_name,
    },
    business_unit: {
      id: submitData?.charging?.business_unit_id,
      code: submitData?.charging?.business_unit_code,
      name: submitData?.charging?.business_unit_name,
    },
    department: {
      id: submitData?.charging?.department_id,
      code: submitData?.charging?.department_code,
      name: submitData?.charging?.department_name,
    },
    department_unit: {
      id: submitData?.charging?.department_unit_id,
      code: submitData?.charging?.department_unit_code,
      name: submitData?.charging?.department_unit_name,
    },
    sub_unit: {
      id: submitData?.charging?.sub_unit_id,
      code: submitData?.charging?.sub_unit_code,
      name: submitData?.charging?.sub_unit_name,
    },
    location: {
      id: submitData?.charging?.location_id,
      code: submitData?.charging?.location_code,
      name: submitData?.charging?.location_name,
    },
    role_id: submitData?.role_id?.id,
    username: submitData?.username,
    scope_order: submitData?.scope_order?.map((item) => ({
      charging_id: item?.sync_id,
      charging_code: item?.code,
      charging_name: item?.name,
    })),
  };

  return payload;
};

export const mapPayloadApprover = (submitData) => {
  const payload = {
    approver:
      submitData?.approver?.map((item) => ({
        approver_id: item?.id,
        approver_name: item?.account_name,
      })) || [],
    charging: {
      id: submitData?.charging?.sync_id || "",
      code: submitData?.charging?.code || "",
      name: submitData?.charging?.name || "",
    },
    company: {
      id: submitData?.charging?.company_id || "",
      code: submitData?.charging?.company_code || "",
      name: submitData?.charging?.company_name || "",
    },
    business_unit: {
      id: submitData?.charging?.business_unit_id || "",
      code: submitData?.charging?.business_unit_code || "",
      name: submitData?.charging?.business_unit_name || "",
    },
    department: {
      id: submitData?.charging?.department_id || "",
      code: submitData?.charging?.department_code || "",
      name: submitData?.charging?.department_name || "",
    },
    department_unit: {
      id: submitData?.charging?.department_unit_id || "",
      code: submitData?.charging?.department_unit_code || "",
      name: submitData?.charging?.department_unit_name || "",
    },
    sub_unit: {
      id: submitData?.charging?.sub_unit_id || "",
      code: submitData?.charging?.sub_unit_code || "",
      name: submitData?.charging?.sub_unit_name || "",
    },
    location: {
      id: submitData?.charging?.location_id || "",
      code: submitData?.charging?.location_code || "",
      name: submitData?.charging?.location_name || "",
    },
  };

  return payload;
};

export const mapOrderingData = (
  ordering,
  approveOrdering,
  viewOrdering,
  serveOrdering,
  chargingData,
  customers,
  materialsData,
  orderType,
) => {
  const mapData = {
    order_no: ordering?.order_no || "",
    cip_no: ordering?.cip_no || "",
    helpdesk_no: ordering?.helpdesk_no || "",
    rush: ordering?.rush || "",
    reason: ordering?.reason || "",
    batch_no: ordering?.batch_no?.split("-")[1] || "",
    year: dayjs(ordering?.batch_no ? ordering?.batch_no.split("-")[0] : null),
    type:
      orderType?.find((type) => type?.id.toString() === ordering?.type?.id) ||
      null,
    customer:
      approveOrdering || viewOrdering || serveOrdering
        ? chargingData?.find(
            (c) => c?.sync_id === ordering?.customer?.id?.toString(),
          )
        : customers?.find(
            (c) => c?.charging_id === ordering?.customer?.id?.toString(),
          ) || null,
    charging:
      approveOrdering || viewOrdering || serveOrdering
        ? chargingData?.find(
            (c) => c?.sync_id === ordering?.charging?.id?.toString(),
          )
        : customers?.find(
            (c) => c?.charging_id === ordering?.charging?.id?.toString(),
          ) || null,
    date_needed: dayjs(ordering?.date_needed),
    order: ordering?.order?.map((item) => {
      const material = materialsData?.find(
        (mats) => mats?.code === item?.material?.code,
      );

      return {
        id: item?.id || new Date(),
        material: material,
        category: {
          id: item?.category?.id || "",
          name: item?.category?.name || "",
        },
        uom: {
          id: item?.uom?.id || "",
          code: item?.uom?.code || "",
          description: item?.uom?.name || "",
        },
        quantity: item?.quantity || 1,
        account_title:
          material?.account_title?.find(
            (title) => title?.account_title?.code === item?.account_title?.code,
          ) || null,
        remarks: item?.remarks || "",
      };
    }),
  };

  return mapData || {};
};
