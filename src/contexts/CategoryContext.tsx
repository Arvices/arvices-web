import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllCategory } from "../api-services/categories.service";
import { parseHttpError } from "../api-services/parseReqError";
import { Category } from "../api-services/categories.types";
interface CategoryContextType {
  categories: Category[];
  catLoading: boolean;
  catError: string;
  loadCategories: () => Promise<void>;
  findCategoryByName: (name: string) => Category | null;
  findCategoryById: (id: number) => Category | null;
}
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);
export const CategoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  const loadCategories = async () => {
    setCatLoading(true);
    setCatError("");
    try {
      const response = await getAllCategory();
      setCategories(response.data.response);
    } catch (error: any) {
      const errorMsg = parseHttpError(error);
      setCatError(
        (errorMsg || "Failed to load categories") +
          ". Use the button below to reload categories",
      );
    } finally {
      setCatLoading(false);
    }
  };
  const findCategoryByName = (name: string) =>
    categories.find((cat) => cat.name === name) || null;
  const findCategoryById = (id: number) =>
    categories.find((cat) => cat.id === id) || null;
  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <CategoryContext.Provider
      value={{
        categories,
        catLoading,
        catError,
        loadCategories,
        findCategoryByName,
        findCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
