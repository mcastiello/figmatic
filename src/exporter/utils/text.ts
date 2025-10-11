export const className = (value: string): string => {
  return value
    .replaceAll(/[^A-Za-z\d]/g, " ")
    .replaceAll(/^(\d)/g, "cn$1")
    .replaceAll(/([A-Z\d])/g, " $1")
    .split(/\s/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .join("-");
};
