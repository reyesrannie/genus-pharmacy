import React from "react";
import { decodeUser } from "./saveUser";
import dayjs from "dayjs";

export const cutOffGet = () => {
  const userData = decodeUser();
  const cutoff = userData?.cut_off[0]?.time || "12:00:00";
  const now = new Date();

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

export const canOrder = (dateNeeded = new Date()) => {
  const userData = decodeUser();
  const cutoff = userData?.cut_off?.[0]?.time || "12:00:00";
  const now = new Date();

  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const neededDate = new Date(
    dateNeeded?.getFullYear(),
    dateNeeded?.getMonth(),
    dateNeeded?.getDate(),
  );

  if (neededDate < todayDate) return false;

  if (neededDate > todayDate) return true;

  console.log("either the two");
  const [hours, minutes, seconds] = cutoff.split(":").map(Number);
  const cutoffTime = new Date(
    now?.getFullYear(),
    now?.getMonth(),
    now?.getDate(),
    hours,
    minutes,
    seconds || 0,
  );

  return now <= cutoffTime;
};

export const canUpdate = (dateNeeded = new Date()) => {
  const userData = decodeUser();
  const cutoff = userData?.cut_off?.[0]?.time || "12:00:00";
  const now = new Date();

  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const neededDate = new Date(
    dateNeeded?.getFullYear(),
    dateNeeded?.getMonth(),
    dateNeeded?.getDate(),
  );

  if (neededDate < todayDate) return false;

  if (neededDate > todayDate) return true;

  const [hours, minutes, seconds] = cutoff.split(":").map(Number);
  const cutoffTime = new Date(
    now?.getFullYear(),
    now?.getMonth(),
    now?.getDate(),
    hours,
    minutes,
    seconds || 0,
  );

  const checkIfCanOrder = now <= cutoffTime;

  return checkIfCanOrder;
};
