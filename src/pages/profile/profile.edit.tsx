import { useEffect, useRef, useState } from "react";
import {
  UserOutlined,
  RiseOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Button,
  Input,
  Select,
  Switch,
  Badge,
  Typography,
  Divider,
  Form,
  Checkbox,
} from "antd";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
import { getAllCategory } from "../../api-services/categories.service";

import { Save, Image as ImageIcon } from "feather-icons-react";

import imgShape from "../../assets/images/pro-sample-img.png";
import { UserAccount } from "../../api-services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountById, updateAccountById } from "../../api-services/auth-re";
import { parseHttpError } from "../../api-services/parseReqError";
import { ContentHOC } from "../../components/nocontent";
import { getImagePreview } from "../util/getImagePreview";
import { useCategory } from "../../contexts/CategoryContext";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";

const initialData = {
  fullName: "Theresa Lane",
  profileImage: imgShape,
  bio: "Professional makeup artist specializing in bridal and event makeup. I bring out the natural beauty in every client with personalized looks that last all day. Based in Lagos, serving clients across the city with mobile services.",
  profession: "Makeup Artist",
  location: "Ikeja, Lagos",
  phone: "+234 801 234 5678",
  email: "theresa.lane@example.com",
  website: "www.theresalane.com",
  experience: "5+ years",
  specialties: [
    "Bridal Makeup",
    "Special Events",
    "Photo Shoots",
    "Natural Looks",
    "Glam Makeup",
    "Contouring",
  ],
  languages: ["English", "Yoruba", "Igbo"],
  services: [
    {
      id: "1",
      name: "Bridal Makeup",
      description: "Complete bridal look with trial session included",
      duration: "3-4 hours",
      price: "45000",
      active: true,
    },
    {
      id: "2",
      name: "Event Makeup",
      description: "Perfect for parties, galas, and special events",
      duration: "2-3 hours",
      price: "25000",
      active: true,
    },
    {
      id: "3",
      name: "Photoshoot Makeup",
      description: "Camera-ready makeup for professional shoots",
      duration: "2 hours",
      price: "20000",
      active: true,
    },
    {
      id: "4",
      name: "Natural Glam",
      description: "Subtle enhancement for everyday elegance",
      duration: "1.5 hours",
      price: "15000",
      active: true,
    },
  ],
  workingHours: {
    monday: { start: "09:00", end: "18:00", available: true },
    tuesday: { start: "09:00", end: "18:00", available: true },
    wednesday: { start: "09:00", end: "18:00", available: true },
    thursday: { start: "09:00", end: "18:00", available: true },
    friday: { start: "09:00", end: "18:00", available: true },
    saturday: { start: "10:00", end: "16:00", available: true },
    sunday: { start: "10:00", end: "16:00", available: false },
  },
  bookingAdvance: "7",
  mobileService: true,
  serviceRadius: "30",
  depositRequired: true,
  depositPercentage: "50",
  cancellationPolicy:
    "24 hours notice required for cancellation. Deposits are non-refundable within 48 hours of appointment.",
  autoConfirm: false,
};

type ChangeLikeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | { target: { name: string; value: any } };

const tabOptions = [
  { label: "Personal", value: "personal", icon: <UserOutlined /> },
  { label: "Professional", value: "professional", icon: <RiseOutlined /> },
  { label: "Services", value: "services", icon: <DollarOutlined /> },
  {
    label: "Availability",
    value: "availability",
    icon: <ClockCircleOutlined />,
  },
  { label: "Portfolio", value: "portfolio", icon: <PictureOutlined /> },
  { label: "Settings", value: "settings", icon: <SettingOutlined /> },
];
export function ProfileEdit() {
  const auth = useAuth();
  const id = auth?.user?.id;
  const {setLoading,setLoadingText} = useLoading()
  const {openNotification} = useNotificationContext()

  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [editData, setEditData] = useState<UserAccount | null>(null);
  const [bioCharCount,setBioCharCount] = useState(editData?.bio?.length || 0)

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileErr, setProfileErr] = useState<string | null>(null);


  const [imgFile, setImgFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageSrc = getImagePreview(imgFile ?? editData?.picture ?? null);
  const category = useCategory();

  const [changesSaved, setChangesSaved] = useState(false);

  const handleChange = (e: ChangeLikeEvent) => {
    const { name, value } = e.target;

    setEditData((prev) => {
      if (!prev) return prev;
      if(name == "category"){
        let val = Number(value)
        return {
          ...prev,
          [name]: [val]
        }
      }
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
      console.log({ res: response.data });
      setProfileErr(null);
    } catch (error: any) {
      console.log({ error });
      const message = parseHttpError(error);
      setProfileErr(message || "Failed to load profile");
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (id && auth?.token) {
      loadProfile()
    }
  }, [id, auth?.token])

  const [activeTab, setActiveTab] = useState("personal");

const handleSave = async () => {
  if (changesSaved) {
    return openNotification("topRight", "All changes have been saved", "", "info");
  }

  const data = new FormData();

  // Append image if present
  if (imgFile) {
    data.append("image", imgFile);
  }

const skipFields = ['accountDisable', 'password'];

if (editData && userProfile) {
  Object.entries(editData).forEach(([key, value]) => {
    const originalValue = userProfile[key as keyof typeof userProfile];

    const hasChanged = value !== originalValue;
    const shouldSkip = skipFields.includes(key);

    if (hasChanged && !shouldSkip && value !== undefined && value !== null) {
      console.log({isUpdating: {key,value}})
      data.append(key, String(value));
    }
  });
}

  try {
    setLoading(true);
    setLoadingText("Updating Profile. Please wait");

    const res = await updateAccountById(data, auth?.user?.id as number, auth.token);
    console.log("Update response:", res);

    openNotification("topRight", "Profile updated successfully", "", "success");
    setChangesSaved(true);
  } catch (error) {
    console.error("Error updating account:", error);
    openNotification("topRight", "Failed to update profile", "", "error");
  } finally {
    setLoading(false);
    setLoadingText("");
  }
};


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
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 mt-14">
            <div className="mx-auto px-6 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3"></div>

                <div className="flex items-center space-x-3">
                  <Button onClick={handleSave} className="bg-gradient-to-r">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-[21px] font-bold mb-2">Edit Profile</h1>
              <p className="text-gray-600">
                Manage your professional profile, services, and booking settings
              </p>
            </div>

            <div className="space-y-6">
              <div className="hidden sm:flex flex-wrap gap-2 border-b border-gray-200 pb-7 ">
                <Button
                  type={activeTab === "personal" ? "primary" : "default"}
                  icon={<UserOutlined />}
                  onClick={() => setActiveTab("personal")}
                >
                  Personal
                </Button>
                <Button
                  type={activeTab === "professional" ? "primary" : "default"}
                  icon={<RiseOutlined />}
                  onClick={() => setActiveTab("professional")}
                >
                  Professional
                </Button>
                <Button
                  type={activeTab === "services" ? "primary" : "default"}
                  icon={<DollarOutlined />}
                  onClick={() => setActiveTab("services")}
                >
                  Services
                </Button>
                <Button
                  type={activeTab === "availability" ? "primary" : "default"}
                  icon={<ClockCircleOutlined />}
                  onClick={() => setActiveTab("availability")}
                >
                  Availability
                </Button>
                <Button
                  type={activeTab === "portfolio" ? "primary" : "default"}
                  icon={<PictureOutlined />}
                  onClick={() => setActiveTab("portfolio")}
                >
                  Portfolio
                </Button>
                <Button
                  type={activeTab === "settings" ? "primary" : "default"}
                  icon={<SettingOutlined />}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </Button>
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

                  <Divider />

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
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

                    {/* Profession */}
                    <div className="flex flex-col">
                      <label className="mb-2 font-medium">Category</label>
                      <Select
                        placeholder="Select a category"
                        className="!w-full !h-10 !border-royalblue-tint5 !rounded-md !focus:outline-none !focus:ring-1 !focus:ring-royalblue-tint4"
                        value={editData?.categoryId}
                        onChange={(value) =>
                          handleChange({
                            target: { name: "category", value: String(value) },
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

                    {/* Phone Number */}
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

                    {/* Email Address */}
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

                    {/* Location */}
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

                    {/* Website */}
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

                    {/* Bio */}
                    <div className="flex flex-col md:col-span-2">
                      <label className="mb-2 font-medium">Bio</label>
                      <textarea
                        name="bio"
                        rows={4}
                        maxLength={700}
                        placeholder="Tell potential clients about yourself and your services..."
                        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4"
                        value={editData?.bio || ''}
                        onChange={handleChange}
                      />
                      <span className="text-sm text-gray-500 mt-1">
                        {editData?.bio?.length || 0} / 700 characters
                      </span>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Highest Qualification
                      </label>
                      <Input placeholder="e.g. BSc in Computer Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Years of Experience
                      </label>
                      <Input type="number" placeholder="e.g. 5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio / Professional Summary
                    </label>
                    <Input.TextArea
                      rows={4}
                      placeholder="Describe your professional background..."
                    />
                  </div>

                  <div>
                    <Checkbox>I'm open to freelance or remote roles</Checkbox>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Primary Service
                      </label>
                      <Select
                        placeholder="Select a service"
                        options={[
                          { label: "Web Development", value: "web-dev" },
                          { label: "UI/UX Design", value: "ui-ux" },
                          { label: "Mobile Development", value: "mobile-dev" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rate (per hour)
                      </label>
                      <Input prefix="₦" placeholder="e.g. 10000" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Add Service Description
                    </label>
                    <Input.TextArea
                      rows={3}
                      placeholder="Details about your service..."
                    />
                  </div>

                  <div>
                    <Checkbox>Offer discount for bulk projects</Checkbox>
                  </div>
                </div>
              )}
              {activeTab === "availability" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Available for Work?
                    </label>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preferred Working Hours
                    </label>
                    <Input placeholder="e.g. 9am - 5pm, Weekdays" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Timezone
                    </label>
                    <Select
                      placeholder="Select timezone"
                      options={[
                        { label: "GMT+1 (West Africa)", value: "gmt+1" },
                        { label: "GMT", value: "gmt" },
                        { label: "EST", value: "est" },
                      ]}
                    />
                  </div>
                </div>
              )}
              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Portfolio Link
                    </label>
                    <Input placeholder="e.g. https://myportfolio.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload Portfolio Items
                    </label>
                    <Input type="file" multiple />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Short Description
                    </label>
                    <Input.TextArea
                      rows={3}
                      placeholder="Briefly describe your portfolio or work style..."
                    />
                  </div>
                </div>
              )}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input disabled value="you@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Change Password
                    </label>
                    <Input.Password placeholder="Enter new password" />
                  </div>

                  <div>
                    <Checkbox>Receive Email Notifications</Checkbox>
                  </div>

                  <div>
                    <Checkbox>Make Profile Public</Checkbox>
                  </div>
                </div>
              )}

              {/* Other tabs to be implemented similarly... */}
            </div>
          </div>
        </div>
      }
    />
  );
}
