import { useState } from "react";
import { Button, Modal } from "antd";
import { Calendar } from "antd";

import { Badge } from "antd";
import { Input } from "antd";
import { Divider } from "antd";
import {
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  CreditCard,
} from "feather-icons-react";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const services = [
  {
    name: "Bridal Makeup",
    duration: "3-4 hours",
    price: "₦45,000",
    description: "Complete bridal look with trial session included",
  },
  {
    name: "Event Makeup",
    duration: "2-3 hours",
    price: "₦25,000",
    description: "Perfect for parties, galas, and special events",
  },
  {
    name: "Photoshoot Makeup",
    duration: "2 hours",
    price: "₦20,000",
    description: "Camera-ready makeup for professional shoots",
  },
  {
    name: "Natural Glam",
    duration: "1.5 hours",
    price: "₦15,000",
    description: "Subtle enhancement for everyday elegance",
  },
];

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
  });
  const [bookingStep, setBookingStep] = useState<
    "selection" | "details" | "confirmation"
  >("selection");
  const [isOpen, setIsOpen] = useState(false);

  const selectedServiceDetails = services.find(
    (s) => s.name === selectedService,
  );

  const handleServiceSelection = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleBookingSubmit = () => {
    if (
      selectedDate &&
      selectedTime &&
      selectedService &&
      clientDetails.name &&
      clientDetails.email &&
      clientDetails.phone
    ) {
      setBookingStep("confirmation");
    }
  };

  const handleFinalConfirmation = () => {
    // Here you would typically send the booking data to your backend
    alert(`Booking confirmed! You'll receive a confirmation email shortly.`);
    setIsOpen(false);
    // Reset form
    setBookingStep("selection");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedService(undefined);
    setClientDetails({
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    });
  };

  const resetBooking = () => {
    setIsOpen(false);
    setBookingStep("selection");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedService(undefined);
    setClientDetails({
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    });
  };

  return (
    <>
      <Button
        type="primary"
        className="bg-gradient-to-r  !h-12 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <CalendarIcon className="w-5 h-5 mr-2" />
        Book Appointment
      </Button>

      <Modal
        title={
          bookingStep === "selection"
            ? "Book Your Appointment"
            : bookingStep === "details"
              ? "Your Details"
              : "Booking Confirmation"
        }
        open={isOpen}
        onCancel={resetBooking}
        footer={null}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {bookingStep === "selection" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Select Date
                </h3>
                <Calendar className="rounded-lg border shadow-sm" />
                <p className="text-sm text-gray-500 mt-2">
                  * Sundays are not available. Mobile services available
                  throughout Lagos.
                </p>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Available Times
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={
                          selectedTime === time
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "hover:bg-purple-50 border-purple-200"
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Select Service
                </h3>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.name
                          ? "ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => handleServiceSelection(service.name)}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">
                            {service.name}
                          </h4>
                          <Badge className="text-lg px-3 py-1 font-medium">
                            {service.price}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              {selectedDate && selectedTime && selectedService && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <div>
                    <div className="text-xl text-purple-900">
                      Booking Summary
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">
                        Mobile service (Location to be specified)
                      </span>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">{selectedService}</span>
                      <span className="font-bold text-purple-700">
                        {selectedServiceDetails?.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedServiceDetails?.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={() => setBookingStep("details")}
                disabled={!selectedDate || !selectedTime || !selectedService}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {bookingStep === "details" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={clientDetails.name}
                  onChange={(e: any) =>
                    setClientDetails({ ...clientDetails, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={clientDetails.phone}
                  onChange={(e: any) =>
                    setClientDetails({
                      ...clientDetails,
                      phone: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={clientDetails.email}
                onChange={(e: any) =>
                  setClientDetails({ ...clientDetails, email: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Service Location *
              </label>
              <Input
                type="text"
                placeholder="Enter address where service will be provided"
                value={clientDetails.location}
                onChange={(e: any) =>
                  setClientDetails({
                    ...clientDetails,
                    location: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Special Requests or Notes
              </label>
              <textarea
                placeholder="Any specific requirements, skin concerns, or preferences..."
                value={clientDetails.notes}
                onChange={(value: any) =>
                  setClientDetails({ ...clientDetails, notes: value })
                }
                className="w-full h-24"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setBookingStep("selection")}
                className="flex-1"
              >
                Back to Selection
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={
                  !clientDetails.name ||
                  !clientDetails.email ||
                  !clientDetails.phone ||
                  !clientDetails.location
                }
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Review Booking
              </Button>
            </div>
          </div>
        )}

        {bookingStep === "confirmation" && (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Almost Done!
              </h3>
              <p className="text-gray-600">
                Please review your booking details below
              </p>
            </div>

            <div className="text-left">
              <div>
                <div>Booking Details</div>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Client</span>
                    </div>
                    <p>{clientDetails.name}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Date & Time</span>
                    </div>
                    <p>
                      {selectedDate?.toLocaleDateString()} at {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <p>{clientDetails.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p>{clientDetails.email}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p>{clientDetails.location}</p>
                </div>

                {clientDetails.notes && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">Special Notes</span>
                    </div>
                    <p>{clientDetails.notes}</p>
                  </div>
                )}

                <Divider />

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">{selectedService}</span>
                    <span className="font-bold text-purple-700">
                      {selectedServiceDetails?.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedServiceDetails?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Payment</span>
              </div>
              <p className="text-sm text-gray-600">
                A 50% deposit (₦
                {Math.round(
                  parseInt(
                    selectedServiceDetails?.price
                      .replace("₦", "")
                      .replace(",", "") || "0",
                  ) / 2,
                ).toLocaleString()}
                ) will be required to confirm your booking. You'll receive
                payment instructions via email.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setBookingStep("details")}
                className="flex-1"
              >
                Edit Details
              </Button>
              <Button
                onClick={handleFinalConfirmation}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
