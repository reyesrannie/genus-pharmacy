import React from "react";
import { decodeUser } from "./saveUser";
import dayjs from "dayjs";
import { date } from "yup";

export const isCutOffReached = () => {
  const userData = decodeUser();
  const cutoff = userData?.cut_off[0]?.time || "12:00:00";
  const now = dayjs();

  const [hours, minutes, seconds] = cutoff.split(":").map(Number);

  const cutoffTime = dayjs()
    .hour(hours)
    .minute(minutes)
    .second(seconds || 0);

  return now.isAfter(cutoffTime);
};

export const getMinDeliveryDate = (isRushOrder = false) => {
  const pastCutoff = isCutOffReached();
  const today = dayjs().startOf("day");

  if (isRushOrder) return pastCutoff ? today.add(1, "day") : today;
  else return pastCutoff ? today.add(2, "day") : today.add(1, "day");
};

export const isRushDate = (dateNeeded) => {
  if (!dateNeeded) return false;

  const needed = dayjs(dateNeeded).startOf("day");
  const today = dayjs().startOf("day");
  const pastCutoff = isCutOffReached();

  if (needed.isSame(today)) {
    return true;
  }

  if (needed.isSame(today.add(1, "day")) && pastCutoff) {
    return true;
  }

  return false;
};

export const isValidOrderDate = (dateNeeded, isRushOrder = false) => {
  if (!dateNeeded) return false;

  const needed = dayjs(dateNeeded).startOf("day");
  const minAllowedDate = getMinDeliveryDate(isRushOrder);

  return needed.valueOf() >= minAllowedDate.valueOf();
};
