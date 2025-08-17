export const getImagePreview = (input: File | string | null): string => {
  if (!input) return "";
  return typeof input === "string" ? input : URL.createObjectURL(input);
};
