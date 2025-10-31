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
import {
  OnboardingPageProps,
  Step1Data,
  validateStep1,
  ValidationErrors,
} from "./start";
import { Calendar, Clock } from "feather-icons-react";
import { Switch } from "@/components/ui/switch";

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

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function OnboardingStep1({
  onNext,
  onStepDataSubmit,
  alldata,
}: OnboardingPageProps) {
  const [data, setData] = useState<Step1Data>({
    fullName: alldata.fullName || "",
    email: alldata.email || "",
    phone: alldata.phone || "",
    businessName: alldata.businessName || "",
    category: alldata.category || "",
    experience: alldata.experience || "",
    serviceAreas: alldata.serviceAreas || [],
    profileImage: alldata.profileImage || null,
    availability: alldata.availability || {},
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleNext = () => {
    const { isValid, errors } = validateStep1(data);
    if (!isValid) {
      setErrors(errors); // or show them in UI
      return;
    }

    onStepDataSubmit(data);
    onNext?.();
  };

  // 🔥 Update state with partial changes
  const onDataChange = (newData: Partial<Step1Data>) => {
    setData((prev) => ({ ...prev, ...newData }));

    setErrors({});
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

  const handleAvailabilityChange = (day: string, available: boolean) => {
    onDataChange({
      availability: {
        ...data.availability,
        [day]: available,
      },
    });
  };

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
            Step 1 of 2: Profile & Business Details
          </h2>
          <Progress value={40} className="max-w-md mx-auto" />
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
                  {errors.fullName && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.fullName}
                    </span>
                  )}
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

                  {errors.email && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className=" gap-2">
                    <div className="relative">
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
                    {errors.phone && (
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.phone}
                      </span>
                    )}
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
                  {errors.businessName && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.businessName}
                    </span>
                  )}
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
                  {errors.category && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.category}
                    </span>
                  )}
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
                  {errors.experience && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.experience}
                    </span>
                  )}
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
                  {errors.serviceAreas && (
                    <span className="text-sm text-red-500 mt-1 block">
                      {errors.serviceAreas}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Availability
              </h4>

              <div className="space-y-3">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Label
                        className="cursor-pointer"
                        htmlFor={`availability-${day}`}
                      >
                        {day}
                      </Label>
                    </div>
                    <Switch
                      id={`availability-${day}`}
                      checked={data.availability[day] || false}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(day, checked)
                      }
                    />
                  </div>
                ))}
              </div>
              {errors.availability && (
                <span className="text-sm text-red-500 mt-1 block">
                  {errors.availability}
                </span>
              )}
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
                {errors.profileImage && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {errors.profileImage}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8">
          <div></div>
          <Button onClick={handleNext} className="px-8">
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
