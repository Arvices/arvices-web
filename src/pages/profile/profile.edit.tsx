import { useState } from "react";
import {
  UserOutlined,
  RiseOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  SettingOutlined,
  UploadOutlined,
  CameraOutlined,
  CalendarOutlined,
  PlusOutlined,
  CloseOutlined,
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

import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Calendar,
  Camera,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Settings,
  Briefcase,
  Image as ImageIcon,
  Star,
  Globe,
} from "feather-icons-react";

import imgShape from "../../assets/images/pro-sample-img.png";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  active: boolean;
}

interface ProfileData {
  // Personal Info
  fullName: string;
  profileImage: string;
  bio: string;
  profession: string;
  location: string;
  phone: string;
  email: string;
  website: string;

  // Professional Details
  experience: string;
  specialties: string[];
  languages: string[];

  // Services
  services: Service[];

  // Availability
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  bookingAdvance: string;
  mobileService: boolean;
  serviceRadius: string;

  // Business Settings
  depositRequired: boolean;
  depositPercentage: string;
  cancellationPolicy: string;
  autoConfirm: boolean;
}

const initialData: ProfileData = {
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

export function ProfileEdit() {
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [activeTab, setActiveTab] = useState("personal");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    // Here you would typically send the data to your backend
    alert("Profile updated successfully!");
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !profileData.specialties.includes(newSpecialty.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfileData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "",
      description: "",
      duration: "",
      price: "",
      active: true,
    };
    setProfileData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const updateService = (id: string, field: keyof Service, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    }));
  };

  const removeService = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Arvice
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide Preview" : "Preview"}
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600">
            Manage your professional profile, services, and booking settings
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b pb-2">
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

          {/* PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <Title level={4}>Personal Information</Title>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full" />
                <div>
                  <label className="block mb-2">Profile Photo</label>
                  <div className="flex gap-2">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                    <Button icon={<CameraOutlined />}>Take Photo</Button>
                  </div>
                </div>
              </div>

              <Divider />

              <Form
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Form.Item label="Full Name">
                  <Input
                    placeholder="Enter full name"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Profession">
                  <Input
                    placeholder="e.g., Makeup Artist"
                    value={profileData.profession}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        profession: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Phone Number">
                  <Input
                    placeholder="+234 XXX XXX XXXX"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Email Address">
                  <Input
                    placeholder="your@email.com"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Location">
                  <Input
                    placeholder="City, State"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Website">
                  <Input
                    placeholder="www.yourwebsite.com"
                    value={profileData.website}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        website: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Bio">
                  <TextArea
                    rows={4}
                    maxLength={500}
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Tell potential clients about yourself and your services..."
                  />
                  <Text type="secondary">
                    {profileData.bio.length}/500 characters
                  </Text>
                </Form.Item>
              </Form>
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
                <label className="block text-sm font-medium mb-1">Email</label>
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
  );
}
