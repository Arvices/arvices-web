export const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};
