import React from "react";
import { decodeUser } from "./saveUser";
import dayjs from "dayjs";
import { date } from "yup";

const userData = decodeUser();
const cutoff = userData?.cut_off[0]?.time || "12:00:00";
const now = new Date();

export const cutOffGet = () => {
  const [hours, minutes, seconds] = cutoff.split(":").map(Number);
  const cutoffTime = new Date(
    now?.getFullYear(),
    now?.getMonth(),
    now?.getDate(),
    hours,
    minutes,
    seconds || 0,
  );

  const minData =
    now <= cutoffTime ? dayjs(new Date()) : dayjs(new Date()).add(1, "day");

  return minData;
};

export const isCutOff = (dateNeeded) => {
  if (!dateNeeded) return false;
  const neededDate = new Date(dateNeeded);

  const [hours, minutes, seconds] = cutoff.split(":").map(Number);

  const targetCutoff = new Date(
    neededDate?.getFullYear(),
    neededDate?.getMonth(),
    neededDate?.getDate(),
    hours,
    minutes,
    seconds,
  );

  return targetCutoff <= now;
};

export const isRush = (dateNeeded) => {
  if (!dateNeeded) return false;
  const neededDate = new Date(dateNeeded);

  if (neededDate < now) return true;
  if (neededDate > now) return false;
  if (isCutOff(neededDate)) return true;
  return false;
};

export const canOrder = (dateNeeded) => {
  if (!dateNeeded) return false;

  const neededDate = new Date(dateNeeded);
  const today = new Date();

  neededDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const rush = isRush(neededDate);
  const cutoffReached = isCutOff(neededDate);

  if (neededDate < today) return true;
  if (neededDate > today) return false;
  if (rush && cutoffReached) return true;
  return false;
};
