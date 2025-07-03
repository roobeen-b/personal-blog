const parseDate = (date: string) => {
  const tempDate = new Date(date);
  return tempDate.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
};

export { parseDate };
