export const convertDateToTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};
