import { useEffect, useRef, useState } from "react";
import ProductsTab from "../profile/ProductsTab";
import PortfolioTab from "../profile/PortfolioTab"
import {
  UserOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Button, Select, Divider } from "antd";
const { Option } = Select;

import { Plus, Save, X } from "feather-icons-react";

import { UserAccount } from "../../api-services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountById, updateAccountById } from "../../api-services/auth-re";
import { parseHttpError } from "../../api-services/parseReqError";
import { ContentHOC } from "../../components/nocontent";
import { getImagePreview } from "../util/getImagePreview";
import { useCategory } from "../../contexts/CategoryContext";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { ServiceOfferingPayload } from "./profile.types";
import {
  createProfileService,
  deleteProfileService,
  getAllProfileService,
  updateProfileService,
} from "../../api-services/profileservice.service";
import { formatTime } from "../util/timeUtil";
import { Settings } from "lucide-react";
import PasswordChange from "./passwordchange";
import { ServiceDetailCard } from "./userservicecomponents";
type ChangeLikeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | {
      target: {
        name: string;
        value: any;
      };
    };
export function ProfileEdit() {
  const auth = useAuth();
  const id = auth?.user?.id;
  const { setLoading, setLoadingText } = useLoading();
  const { openNotification } = useNotificationContext();
  let tabOptions = [
  { label: "Personal", value: "personal", icon: <UserOutlined /> },
  { label: "Availability", value: "availability", icon: <ClockCircleOutlined /> },
  { label: "Services", value: "services", icon: <DollarOutlined /> },
  { label: "Settings", value: "settings", icon: <Settings size={14} /> },
    { label: "Products", value: "products", icon: <UploadOutlined /> },
    { label: "Portfolio", value: "portfolio", icon: <UploadOutlined/>}
];

// 🚀 Only add Products tab if NOT a client
if (auth.isClient) {
  tabOptions = tabOptions.filter(
    (tab) => tab.value !== "products" && tab.value !== "availability" && tab.value !== "services" && tab.value !== "portfolio"
  );
}


  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [editData, setEditData] = useState<UserAccount | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceErr, setServiceErr] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageSrc = getImagePreview(imgFile ?? editData?.picture ?? null);
  const category = useCategory();
  const [changesSaved, setChangesSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [serviceEditIndex, setServiceEditIndex] = useState<number>();
  const [serviceEdit, setServiceEdit] = useState<ServiceOfferingPayload>();
  const [newServiceForm, setNewServiceForm] = useState<ServiceOfferingPayload>({
    title: "",
    price: "",
    description: "",
    duration: "",
    timeUnit: "",
    id: 0,
  });
  const [input, setInput] = useState("");
  const specialities: string[] = editData?.specialties || [];
  const updateSpecialities = (list: string[]) => {
    setEditData((prev: any) => ({
      ...prev,
      specialties: list.length > 0 ? list : null,
    }));
  };
  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed || specialities.includes(trimmed)) return;
    updateSpecialities([...specialities, trimmed]);
    setInput("");
  };
  const handleRemove = (index: number) => {
    const updated = specialities.filter((_, i) => i !== index);
    updateSpecialities(updated);
  };
  const handleNewServiceFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const toggleDay = (day: string) => {
    if (!editData) return;
    const isSelected = editData.availableDays?.includes(day) ?? false;
    const updatedDays = isSelected
      ? (editData.availableDays?.filter((d) => d !== day) ?? [])
      : [...(editData.availableDays ?? []), day];
    setEditData((prev) =>
      prev
        ? {
            ...prev,
            availableDays: updatedDays,
          }
        : null,
    );
    setChangesSaved(false);
  };
  const handleChange = (e: ChangeLikeEvent) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const found = category.findCategoryById(value[0]);
      if (!found) return;
      setEditData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          category: [found],
        };
      });
    }
    setEditData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
    setChangesSaved(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      setChangesSaved(false);
    }
  };
  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await getAccountById(String(id), auth.token);
      setUserProfile(response.data.response);
      setEditData(response.data.response);
      console.log({
        res: response.data,
      });
      setProfileErr(null);
    } catch (error: any) {
      console.log({
        error,
      });
      const message = parseHttpError(error);
      setProfileErr(message || "Failed to load profile");
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };
  const fetchServices = async () => {
    setServiceLoading(true);
    setServiceErr(null);
    try {
      const res = await getAllProfileService(auth.token);
      console.log({
        servicesRes: res,
      });
      setServices(res?.data?.response || []);
    } catch (error: any) {
      console.error(error);
      setServiceErr("Could not fetch services.");
    } finally {
      setServiceLoading(false);
    }
  };
  const handleSaveNewService = async () => {
    try {
      setLoading(true);
      setLoadingText("Saving new service...");
      const payload = {
        ...newServiceForm,
      };
      await createProfileService(payload, auth.token);
      setShowForm(false);
      openNotification(
        "topRight",
        "New Service Added Successfully",
        "",
        "success",
      );
      fetchServices();
    } catch (error) {
      console.error(error);
      openNotification(
        "topRight",
        "Error saving service",
        error?.toString() || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const saveEditedService = async () => {
    if (!serviceEdit || serviceEditIndex === undefined) return;
    try {
      setLoading(true);
      setLoadingText("Saving service changes...");
      await updateProfileService(serviceEdit.id, serviceEdit, auth.token);
      setServices((prev) => {
        const copy = [...prev];
        copy[serviceEditIndex] = serviceEdit;
        return copy;
      });
      openNotification(
        "topRight",
        "Service updated successfully",
        "",
        "success",
      );
      setServiceEditIndex(undefined);
      setServiceEdit(undefined);
    } catch (error) {
      openNotification("topRight", "Failed to update service", "", "error");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  useEffect(() => {
    if (id && auth?.token) {
      loadProfile();
      fetchServices();
    }
  }, [id, auth?.token]);
  const [activeTab, setActiveTab] = useState("personal");
  const handleSave = async () => {
    if (changesSaved) {
      return openNotification(
        "topRight",
        "All changes have been saved",
        "",
        "info",
      );
    }
    const data = new FormData();
    console.log({
      editData,
    });
    if (imgFile) {
      data.append("image", imgFile);
    }
    const skipFields = ["accountDisable", "password"];
    console.log({
      editData,
    });
    if (editData && userProfile) {
      Object.entries(editData).forEach(([key, value]) => {
        const originalValue = userProfile[key as keyof typeof userProfile];
        const hasChanged = value !== originalValue;
        const shouldSkip = skipFields.includes(key);
        if (
          hasChanged &&
          !shouldSkip &&
          value !== undefined &&
          value !== null
        ) {
          console.log({
            isUpdating: {
              key,
              value,
            },
          });
          if (Array.isArray(value)) {
            if (value.length <= 1) {
              value.push("");
              value.push("");
            }
            value.forEach((item) => {
              data.append(`${key}`, String(item));
            });
          } else {
            data.append(key, String(value));
          }
        }
      });
    }
    try {
      setLoading(true);
      setLoadingText("Updating Profile. Please wait");
      const res = await updateAccountById(
        data,
        auth?.user?.id as number,
        auth.token,
      );
      console.log("Update response:", res);
      openNotification(
        "topRight",
        "Profile updated successfully",
        "",
        "success",
      );
      setChangesSaved(true);
    } catch (error) {
      console.error("Error updating account:", error);
      openNotification("topRight", "Failed to update profile", "", "error");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const handleDeleteService = async (serviceId: string) => {
    try {
      setLoading(true);
      setLoadingText("Deleting service...");
      await deleteProfileService(serviceId, auth.token);
      openNotification(
        "topRight",
        "Service deleted successfully",
        "",
        "success",
      );
      fetchServices?.();
    } catch (err: any) {
      openNotification(
        "topRight",
        "Error deleting service",
        err?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log({
      editData,
    });
  }, [editData]);
  return (
    <ContentHOC
      loading={profileLoading}
      loadingText="Loading Edit"
      error={!!profileErr}
      errMessage={profileErr as string}
      noContent={false}
      actionFn={loadProfile}
      UIComponent={
        <div className="min-h-screen px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
          {}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 mt-14"></header>

          <div className="py-8">
            <div className="mb-8">
              <h1 className="text-[21px] font-bold mb-2">Edit Profile</h1>
              <p className="text-gray-600">
                Manage your professional profile, services, and booking settings
              </p>
            </div>

            <div className="space-y-6">
              <div className="hidden sm:flex flex-wrap gap-2 border-b border-gray-200 pb-7 ">
                {tabOptions.map((tabData, index) => {
                  return (
                    <Button
                      key={index}
                      type={activeTab === tabData.value ? "primary" : "default"}
                      icon={tabData.icon}
                      onClick={() => setActiveTab(tabData.value)}
                    >
                      {tabData.label}
                    </Button>
                  );
                })}
              </div>

              <div className="flex sm:hidden flex-wrap gap-2 border-b border-gray-200 pb-7 ">
                <label>Select a section of your profile to edit</label>
                <Select
                  className="w-full max-w-xs"
                  value={activeTab}
                  onChange={(value) => setActiveTab(value)}
                  optionLabelProp="label"
                >
                  {tabOptions.map((tab) => (
                    <Option key={tab.value} value={tab.value} label={tab.label}>
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* PERSONAL TAB */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h6 className="text-[18px] font-medium tracking-tighter">
                    Personal Information.
                  </h6>

                  <div className="flex items-center gap-4">
                    <div className="aspect-square w-24 rounded-full bg-gray-200 overflow-hidden">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        icon={<UploadOutlined />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Profile Photo
                      </Button>
                    </div>
                  </div>
                  

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {}
                    <div className="flex flex-col">
                      <label className="mb-2 font-medium">Full Name</label>
                      <input
                        name="fullName"
                        type="text"
                        placeholder="Enter full name"
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                        value={editData?.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    {}
                    {auth.isProvider && (
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Category</label>
                        <Select
                          placeholder="Select a category"
                          className="!w-full !h-10 !border-royalblue-tint5 !rounded-md !focus:outline-none !focus:ring-1 !focus:ring-royalblue-tint4"
                          value={Number(editData?.category[0]?.id) || undefined}
                          onChange={(value) =>
                            handleChange({
                              target: {
                                name: "categoryId",
                                value: [value],
                              },
                            })
                          }
                        >
                          {category.categories?.map((cat: any) => (
                            <Option key={cat.id} value={cat.id}>
                              {cat.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}

                    {}
                    {auth.isProvider && (
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">
                          Add Specialities
                        </label>

                        <div className="space-y-4 p-4 border border-gray-200 rounded-2xl">
                          {}
                          {}
                          {}
                          <div className="flex gap-2">
                            <input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
                              placeholder="Add speciality..."
                            />
                            <button
                              type="button"
                              className="bg-black text-white px-4 py-2 rounded-md text-sm w-max"
                              onClick={handleAdd}
                            >
                              Add
                            </button>
                          </div>

                          <div className="border-t border-gray-200 my-2 mb-4" />

                          {specialities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {specialities.map((item, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 bg-white text-gray-700 border border-gray-300 rounded-full px-3 py-1 text-sm"
                                >
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(i)}
                                    className="hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {}
                    <div className="flex flex-col">
                      <label className="mb-2 font-medium">Phone Number</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="+234 XXX XXX XXXX"
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                        value={editData?.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>

                    {}
                    <div className="flex flex-col">
                      <label className="mb-2 font-medium">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                        value={editData?.email}
                        onChange={handleChange}
                      />
                    </div>

                    {}
                    <div className="flex flex-col">
                      <label className="mb-2 font-medium">Location</label>
                      <input
                        name="location"
                        type="text"
                        placeholder="City, State"
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                        value={editData?.address}
                        onChange={handleChange}
                      />
                    </div>

                    {}
                    {auth.isProvider && (
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Website</label>
                        <input
                          name="website"
                          type="url"
                          placeholder="www.yourwebsite.com"
                          className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                          value={editData?.website}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    {}
                    {auth.isProvider && (
                      <div className="flex flex-col md:col-span-2">
                        <label className="mb-2 font-medium">Bio</label>
                        <textarea
                          name="bio"
                          rows={4}
                          maxLength={700}
                          placeholder="Tell potential clients about yourself and your services..."
                          className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4 w-full"
                          value={editData?.bio || ""}
                          onChange={handleChange}
                        />
                        <span className="text-sm text-gray-500 mt-1">
                          {editData?.bio?.length || 0} / 700 characters
                        </span>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
{activeTab === "products" && !auth.isClient && <ProductsTab />}
{activeTab === "portfolio" && !auth.isClient && <PortfolioTab />}

              {/* SERVICES */}
{activeTab === "services" && !auth.isClient && (
                <div>
                  {showForm && (
                    <div className="w-full flex justify-end gap-2 mb-4">
                      {}
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm"
                      >
                        Cancel
                      </button>

                      {}
                      <button
                        onClick={handleSaveNewService}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm"
                      >
                        Save Service
                      </button>
                    </div>
                  )}

                  {!showForm && (
                    <div className="w-full flex justify-end mb-4">
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm"
                      >
                        <Plus size={16} />
                        Add Service
                      </button>
                    </div>
                  )}

                  {showForm ? (
                    <div className="w-full border border-gray-200 rounded-xl p-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newServiceForm.title}
                          onChange={handleNewServiceFormChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={newServiceForm.description}
                          onChange={handleNewServiceFormChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={newServiceForm.price}
                          onChange={handleNewServiceFormChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={newServiceForm.duration}
                            onChange={handleNewServiceFormChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Time Unit
                          </label>
                          <select
                            name="timeUnit"
                            value={newServiceForm.timeUnit}
                            onChange={handleNewServiceFormChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          >
                            <option value="">Select unit</option>
                            <option value="Min">Minutes</option>
                            <option value="Hour">Hours</option>
                            <option value="days">Days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ContentHOC
                      loading={serviceLoading}
                      loadingText={"Fetching user Service"}
                      error={!!serviceErr}
                      errMessage={serviceErr || ""}
                      noContent={services.length == 0}
                      actionFn={fetchServices}
                      minHScreen={false}
                      UIComponent={
                        <div className="space-y-6 mt-6">
                          {services.map((service, index) => {
                            const isEditing = serviceEditIndex === index;
                            if (isEditing) {
                              return (
                                <div
                                  key={index}
                                  className="p-6 rounded-lg bg-white relative shadow-md border border-gray-100"
                                >
                                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                    Edit Service Details
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    {}
                                    <div>
                                      <label
                                        htmlFor="service-title"
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                      >
                                        Service Title
                                      </label>
                                      <input
                                        id="service-title"
                                        placeholder="e.g., Standard Loan Processing"
                                        className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors"
                                        value={serviceEdit?.title || ""}
                                        onChange={(e) =>
                                          setServiceEdit((prev) => ({
                                            ...prev!,
                                            title: e.target.value,
                                          }))
                                        }
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        A clear, concise name for your service.
                                      </p>
                                    </div>

                                    {}
                                    <div>
                                      <label
                                        htmlFor="service-price"
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                      >
                                        Price (e.g., ₦5,000)
                                      </label>
                                      <input
                                        id="service-price"
                                        type="number"
                                        placeholder="e.g., ₦5,000"
                                        className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors"
                                        value={serviceEdit?.price || ""}
                                        onChange={(e) =>
                                          setServiceEdit((prev) => ({
                                            ...prev!,
                                            price: e.target.value,
                                          }))
                                        }
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        The cost associated with this service.
                                      </p>
                                    </div>

                                    {}
                                    <div>
                                      <label
                                        htmlFor="service-duration"
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                      >
                                        Duration
                                      </label>
                                      <input
                                        id="service-duration"
                                        type="number"
                                        placeholder="e.g., 30"
                                        className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={serviceEdit?.duration || ""}
                                        onChange={(e) =>
                                          setServiceEdit((prev) => ({
                                            ...prev!,
                                            duration:
                                              parseFloat(
                                                e.target.value,
                                              ).toString() || "0",
                                          }))
                                        }
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        Numerical value for the service length.
                                      </p>
                                    </div>

                                    {}
                                    <div>
                                      <label
                                        htmlFor="time-unit"
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                      >
                                        Time Unit
                                      </label>
                                      <select
                                        id="time-unit"
                                        name="timeUnit"
                                        value={serviceEdit?.timeUnit || ""}
                                        onChange={(e) =>
                                          setServiceEdit((prev) => ({
                                            ...prev!,
                                            timeUnit: e.target.value,
                                          }))
                                        }
                                        className="w-full border border-gray-200 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors text-sm"
                                      >
                                        <option value="">Select unit</option>
                                        <option value="Min">Minutes</option>
                                        <option value="Hour">Hours</option>
                                        <option value="days">Days</option>
                                      </select>
                                      <p className="text-xs text-gray-500 mt-1">
                                        The unit of time for the service
                                        duration.
                                      </p>
                                    </div>
                                  </div>

                                  {}
                                  <div className="mt-5">
                                    <label
                                      htmlFor="service-description"
                                      className="block text-gray-600 text-sm font-medium mb-1"
                                    >
                                      Service Description
                                    </label>
                                    <textarea
                                      id="service-description"
                                      placeholder="Provide a detailed description of the service..."
                                      className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors resize-y"
                                      rows={4}
                                      value={serviceEdit?.description || ""}
                                      onChange={(e) =>
                                        setServiceEdit((prev) => ({
                                          ...prev!,
                                          description: e.target.value,
                                        }))
                                      }
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      Describe what this service entails for
                                      your customers.
                                    </p>
                                  </div>

                                  {}
                                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <button
                                      className="px-5 cursor-pointer py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                                      onClick={() => {
                                        setServiceEditIndex(undefined);
                                        setServiceEdit(undefined);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="px-5 py-2.5 bg-royalblue-main cursor-pointer text-white rounded-md hover:bg-royalblue-shade1 transition-colors duration-200 font-medium"
                                      onClick={saveEditedService}
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <ServiceDetailCard
                                handleDeleteService={handleDeleteService}
                                service={service}
                                key={index}
                                index={index}
                                setServiceEdit={setServiceEdit}
                                setServiceEditIndex={setServiceEditIndex}
                              />
                            );
                          })}
                        </div>
                      }
                    />
                  )}
                </div>
              )}

{activeTab === "availability" && !auth.isClient && (
                <div className="space-y-6">
                  {}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => {
                        const availableDays = editData?.availableDays || [];
                        const isSelected = availableDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              toggleDay(day);
                            }}
                            className={`px-4 py-2 text-[13px] cursor-pointer rounded-full border capitalize transition 
                              ${isSelected ? "bg-black text-white" : "border-gray-300 text-gray-600"}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Available From
                      </label>
                      <input
                        type="time"
                        name="availableFromTime"
                        value={
                          editData?.availableFromTime || formatTime(new Date())
                        }
                        onChange={handleChange}
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Available To
                      </label>
                      <input
                        type="time"
                        name="availableToTime"
                        value={
                          editData?.availableToTime || formatTime(new Date())
                        }
                        onChange={handleChange}
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4 w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <PasswordChange userId={editData?.id || 0} />
              )}
              {}
            </div>
          </div>
          <div className="my-8 border-t border-gray-300" />
          {activeTab !== "services" && activeTab !== "settings" && (
            <div className="">
              <button
                onClick={handleSave}
                className="!bg-black cursor-pointer !text-white !h-10 px-4 py-2 rounded-md block text-sm w-full max-w-[400px] mx-auto"
              >
                <Save className="inline w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}

          <div className="mt-10" />
        </div>
      }
    />
  );
}
