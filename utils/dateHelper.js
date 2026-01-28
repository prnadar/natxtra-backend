// utils/dateHelper.js

function dateToString(date) {
  if (!(date instanceof Date) || isNaN(date)) return null;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function stringToDate(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date) ? null : date;
}

function formDateToDateString(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;

  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return null;

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

module.exports = {
  dateToString,
  stringToDate,
  formDateToDateString,
};
