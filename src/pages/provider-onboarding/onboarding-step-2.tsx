"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Image,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Step2Data {
  govId: File | null;
  businessCert: File | null;
  portfolioImages: File[];
  testimonials: string;
}

export default function OnboardingStep2Page() {
  const [data, setData] = useState<Step2Data>({
    govId: null,
    businessCert: null,
    portfolioImages: [],
    testimonials: "",
  });

  const navigate = useNavigate();

  // Update partial state
  const onDataChange = (updated: Partial<Step2Data>) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  // Dummy navigation handlers

  const onNext = () => {
    console.log("Next button clicked", data);
    navigate("/provider/onboarding/3");
  };

  const onBack = () => {
    console.log("Going back with data:", data);
    alert("Back step triggered ⬅️");
  };

  const handleGovIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onDataChange({ govId: file });
  };

  const handleBusinessCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onDataChange({ businessCert: file });
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...data.portfolioImages, ...files].slice(0, 5);
    onDataChange({ portfolioImages: newImages });
  };

  const removePortfolioImage = (index: number) => {
    const newImages = data.portfolioImages.filter((_, i) => i !== index);
    onDataChange({ portfolioImages: newImages });
  };

  // Reusable upload card
  const FileUploadCard = ({
    title,
    description,
    file,
    onChange,
    accept = "image/*,.pdf",
    required = false,
  }: {
    title: string;
    description: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label>
        {title} {required && <span className="text-destructive">*</span>}
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
          id={`upload-${title.replace(/\s/g, "")}`}
        />
        <label
          htmlFor={`upload-${title.replace(/\s/g, "")}`}
          className="cursor-pointer"
        >
          {file ? (
            <div className="space-y-2">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              <p className="text-sm">{file.name}</p>
              <p className="text-xs text-green-600">✓ Uploaded successfully</p>
              <p className="text-xs text-muted-foreground">Click to replace</p>
            </div>
          ) : (
            <div className="space-y-2">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm">{description}</p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  const isFormValid = data.govId !== null;

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
            Step 2 of 3: Upload Verification Documents
          </h2>
          <Progress value={66} className="max-w-md mx-auto" />
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <h3>Help us verify your identity and business</h3>
            <p className="text-muted-foreground">
              Upload clear, readable documents to speed up verification
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Identity Verification */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Identity Verification
              </h4>

              <FileUploadCard
                title="Government-issued ID"
                description="Upload your National ID, Driver's License, or Passport"
                file={data.govId}
                onChange={handleGovIdChange}
                accept="image/*,.pdf"
                required
              />
            </div>

            {/* Business Verification */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Business Verification
              </h4>

              <FileUploadCard
                title="Business Registration Certificate"
                description="Upload your CAC certificate (optional if not registered)"
                file={data.businessCert}
                onChange={handleBusinessCertChange}
                accept="image/*,.pdf"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">
                    Don't have a business registration?
                  </p>
                  <p className="text-blue-700">
                    You can still join as an individual service provider.
                    Business registration helps build trust with clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Portfolio Showcase */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Portfolio Showcase
              </h4>

              <div>
                <Label>Sample Work Images (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioChange}
                    className="hidden"
                    id="portfolio-upload"
                    disabled={data.portfolioImages.length >= 5}
                  />
                  <label htmlFor="portfolio-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm">
                        Upload up to 5 images of your work
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {5 - data.portfolioImages.length} slots remaining
                      </p>
                    </div>
                  </label>
                </div>

                {data.portfolioImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {data.portfolioImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePortfolioImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-1 left-1 right-1">
                          <Badge
                            variant="secondary"
                            className="text-xs truncate"
                          >
                            {file.name}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <Label htmlFor="testimonials">
                Client Testimonials or References (Optional)
              </Label>
              <Textarea
                id="testimonials"
                value={data.testimonials}
                onChange={(e) => onDataChange({ testimonials: e.target.value })}
                placeholder="Paste client testimonials or provide references..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={onNext} disabled={!isFormValid} className="px-8">
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
