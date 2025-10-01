import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Mail, Phone, Building, MapPin, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Step1Data {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  businessName: string;
  category: string;
  experience: string;
  serviceAreas: string[];
  profileImage: File | null;
}

const serviceCategories = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Catering",
  "IT Services",
  "Cleaning",
  "Landscaping",
  "Photography",
  "Tutoring",
  "Pet Care",
  "Home Repair",
];

const experienceOptions = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const cities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Benin City",
  "Jos",
  "Ilorin",
];

export function OnboardingStep1() {
  const [data, setData] = useState<Step1Data>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "",
    businessName: "",
    category: "",
    experience: "",
    serviceAreas: [],
    profileImage: null,
  });

  const navigate = useNavigate();

  // 🔥 Update state with partial changes
  const onDataChange = (newData: Partial<Step1Data>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const onNext = () => {
    console.log("Next button clicked", data);
    navigate("/provider/onboarding/2");
  };

  const onSave = () => {
    console.log("Save button clicked", data);
  };

  const handleServiceAreaAdd = (city: string) => {
    if (!data.serviceAreas.includes(city)) {
      onDataChange({ serviceAreas: [...data.serviceAreas, city] });
    }
  };

  const handleServiceAreaRemove = (city: string) => {
    onDataChange({
      serviceAreas: data.serviceAreas.filter((area) => area !== city),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onDataChange({ profileImage: file });
  };

  const isFormValid =
    data.fullName &&
    data.email &&
    data.phone &&
    data.businessName &&
    data.category;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-13">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-royalblue-tint2 to-royalblue-main font-medium tracking-tight bg-clip-text text-transparent">
              Service Provider Onboarding
            </h1>
            <p className="text-muted-foreground">
              Join our service provider network
            </p>
          </div>
          <h2 className="text-2xl mb-4">
            Step 1 of 3: Profile & Business Details
          </h2>
          <Progress value={33} className="max-w-md mx-auto" />
        </div>

        <Card>
          <CardHeader>
            <h3>Let's get to know you and your business</h3>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="fullName"
                      value={data.fullName}
                      onChange={(e) =>
                        onDataChange({ fullName: e.target.value })
                      }
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => onDataChange({ email: e.target.value })}
                      className="pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={data.countryCode}
                      onValueChange={(value) =>
                        onDataChange({ countryCode: value })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="+234" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+234">+234</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+27">+27</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) =>
                          onDataChange({ phone: e.target.value })
                        }
                        className="pl-10"
                        placeholder="8012345678"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Business Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="businessName">Business/Brand Name *</Label>
                  <Input
                    id="businessName"
                    value={data.businessName}
                    onChange={(e) =>
                      onDataChange({ businessName: e.target.value })
                    }
                    placeholder="Your business or brand name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Service Category *</Label>
                  <Select
                    value={data.category}
                    onValueChange={(value) => onDataChange({ category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select
                    value={data.experience}
                    onValueChange={(value) =>
                      onDataChange({ experience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Service Areas</Label>
                  <Select onValueChange={handleServiceAreaAdd}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add service areas" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities
                        .filter((city) => !data.serviceAreas.includes(city))
                        .map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {data.serviceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.serviceAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          {area}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => handleServiceAreaRemove(area)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <Label>Profile Picture / Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-upload"
                />
                <label htmlFor="profile-upload" className="cursor-pointer">
                  {data.profileImage ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(data.profileImage)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full mx-auto"
                      />
                      <p className="text-sm text-muted-foreground">
                        {data.profileImage.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="ghost" onClick={onSave}>
            Save & Continue Later
          </Button>
          <Button onClick={onNext} disabled={!isFormValid} className="px-8">
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
