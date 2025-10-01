"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  CreditCard,
  Calendar,
  Clock,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Step3Data {
  selectedServices: string[];
  pricing: string;
  pricingType: string;
  availability: {
    [key: string]: boolean;
  };
  bankAccount: string;
  bankName: string;
  paymentMethods: string[];
  termsAccepted: boolean;
}

const serviceOptions = [
  { id: "installation", label: "Installation", icon: "🔧" },
  { id: "repair", label: "Repair & Maintenance", icon: "🛠️" },
  { id: "consultation", label: "Consultation", icon: "💡" },
  { id: "emergency", label: "Emergency Services", icon: "🚨" },
  { id: "training", label: "Training & Support", icon: "📚" },
  { id: "custom", label: "Custom Projects", icon: "⚡" },
];

const pricingTypes = [
  "Per Hour",
  "Per Job",
  "Package Deal",
  "Quote on Request",
];

const paymentMethods = [
  { id: "paystack", label: "Paystack", logo: "💳" },
  { id: "flutterwave", label: "Flutterwave", logo: "🌊" },
  { id: "stripe", label: "Stripe", logo: "💎" },
  { id: "bank", label: "Bank Transfer", logo: "🏦" },
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

export default function OnboardingStep3Page() {
  const [data, setData] = useState<Step3Data>({
    selectedServices: [],
    pricing: "",
    pricingType: "",
    availability: {},
    bankAccount: "",
    bankName: "",
    paymentMethods: [],
    termsAccepted: false,
  });

  const navigate = useNavigate();

  const onDataChange = (changes: Partial<Step3Data>) => {
    setData((prev) => ({ ...prev, ...changes }));
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServices = data.selectedServices.includes(serviceId)
      ? data.selectedServices.filter((s) => s !== serviceId)
      : [...data.selectedServices, serviceId];
    onDataChange({ selectedServices: newServices });
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    const newMethods = data.paymentMethods.includes(methodId)
      ? data.paymentMethods.filter((m) => m !== methodId)
      : [...data.paymentMethods, methodId];
    onDataChange({ paymentMethods: newMethods });
  };

  const handleAvailabilityChange = (day: string, available: boolean) => {
    onDataChange({
      availability: {
        ...data.availability,
        [day]: available,
      },
    });
  };

  const onSubmit = () => {
    console.log("Submitting Step 3 data:", data);
    // TODO: API call
  };

  const onBack = () => {
    console.log("Going back to Step 2");
    navigate("/provider/onboarding/2");
    // TODO: navigation logic
  };

  const isFormValid =
    data.selectedServices.length > 0 &&
    data.pricing &&
    data.pricingType &&
    data.bankAccount &&
    data.bankName &&
    data.paymentMethods.length > 0 &&
    data.termsAccepted;

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
            Step 3 of 3: Service Details & Payment Setup
          </h2>
          <Progress value={100} className="max-w-md mx-auto" />
        </div>

        <Card>
          <CardHeader>
            <h3>Set up your services and get paid</h3>
            <p className="text-muted-foreground">
              Configure your service offerings and payment preferences
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Service Categories */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Service Categories
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      data.selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <span className="flex-1">{service.label}</span>
                      {data.selectedServices.includes(service.id) && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricing">Your Rate *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      id="pricing"
                      type="number"
                      value={data.pricing}
                      onChange={(e) =>
                        onDataChange({ pricing: e.target.value })
                      }
                      className="pl-8"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Pricing Type *</Label>
                  <Select
                    value={data.pricingType}
                    onValueChange={(value) =>
                      onDataChange({ pricingType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankAccount">Account Number *</Label>
                  <Input
                    id="bankAccount"
                    value={data.bankAccount}
                    onChange={(e) =>
                      onDataChange({ bankAccount: e.target.value })
                    }
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select
                    value={data.bankName}
                    onValueChange={(value) => onDataChange({ bankName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gtb">GTBank</SelectItem>
                      <SelectItem value="access">Access Bank</SelectItem>
                      <SelectItem value="first">First Bank</SelectItem>
                      <SelectItem value="zenith">Zenith Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                      <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Payment Methods *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        data.paymentMethods.includes(method.id)
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                      onClick={() => handlePaymentMethodToggle(method.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{method.logo}</span>
                        <span className="text-sm">{method.label}</span>
                        {data.paymentMethods.includes(method.id) && (
                          <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms & Agreement */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="terms"
                  checked={data.termsAccepted}
                  onCheckedChange={(checked) =>
                    onDataChange({ termsAccepted: checked as boolean })
                  }
                />
                <div className="text-sm">
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                    >
                      Service Policy
                    </button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Success Preview */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h5 className="text-green-800">You're almost done!</h5>
              </div>
              <p className="text-green-700 text-sm">
                Submit for verification and start receiving job requests from
                clients in your area.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid}
            className="px-8 bg-royalblue-shade4 text-white"
            size="lg"
          >
            Finish & Submit for Verification
          </Button>
        </div>
      </div>
    </div>
  );
}
