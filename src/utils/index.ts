export const getSize = (initial?: number | string): string =>
  typeof initial === "number" ? `${initial}px` : initial || "100%";

export default getSize;
