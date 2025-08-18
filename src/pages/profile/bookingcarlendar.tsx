import { useState } from "react";
import { Button, Modal } from "antd";
import { Badge } from "antd";
import {
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowUpRight,
  CreditCard,
} from "feather-icons-react";
import { ServiceOfferingPayload } from "./profile.types";
import CalendarAndTimeslots from "./carlender";
import { UserAccount } from "../../api-services/auth";
import { formatNumber } from "../util/formatNumber";
import moment from "moment";
import { useLoading } from "../../contexts/LoadingContext";
import { createBooking } from "../../api-services/booking";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../contexts/NotificationContext";
export interface BookingData {
  totalCost: number;
  totalDuration: number;
  bookingDate: string;
  bookingFromTime: string;
  bookingToTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientLocation: string;
  clientNotes: string;
  depositAmount: number;
  serviceId: number[];
}
export const BookingCalendar: React.FC<{
  services: ServiceOfferingPayload[];
  profile: UserAccount | null;
}> = ({ services, profile }) => {
  const availableDays = profile?.availableDays || [];
  const availableFromTime = profile?.availableFromTime || "09:00";
  const availableToTime = profile?.availableToTime || "16:00";
  const { setLoading, setLoadingText } = useLoading();
  const auth = useAuth();
  const navigate = useNavigate();
  const { openNotification } = useNotificationContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedFromTime, setSelectedFromTime] = useState<string | null>(null);
  const [selectedToTime, setSelectedToTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
  });
  const [bookingStep, setBookingStep] = useState<
    "time" | "selection" | "details" | "confirmation"
  >("selection");
  const [isOpen, setIsOpen] = useState(false);
  const selectedServiceDetails = services.filter((service) =>
    selectedService.includes(service.title),
  );
  const totalCost = selectedServiceDetails.reduce(
    (total, service) => total + Number(service.price),
    0,
  );
  const totalDuration = selectedServiceDetails.reduce(
    (total, service) => total + Number(service.duration),
    0,
  );
  const depositAmount = totalCost / 2;
  const handleServiceSelection = (serviceName: string) => {
    setSelectedService((prevSelectedServices) => {
      const isSelected = prevSelectedServices.includes(serviceName);
      if (isSelected) {
        return prevSelectedServices.filter((name) => name !== serviceName);
      } else {
        return [...prevSelectedServices, serviceName];
      }
    });
  };
  const handleBookingSubmit = async () => {
    const payload: BookingData = {
      totalCost,
      totalDuration,
      bookingDate: moment(selectedDate).format("YYYY-MM-DD"),
      bookingFromTime: selectedFromTime?.toString() || "",
      bookingToTime: selectedToTime?.toString() || "",
      clientEmail: clientDetails.email,
      clientName: clientDetails.name,
      clientPhone: clientDetails.phone,
      clientLocation: clientDetails.location,
      clientNotes: clientDetails.notes,
      depositAmount: totalCost / 2,
      serviceId: selectedServiceDetails.map((service) => service.id),
    };
    try {
      setLoading(true);
      setLoadingText("Creating your booking...");
      await createBooking(payload, auth.token);
      openNotification(
        "topRight",
        "Booking Confirmed",
        "Your booking has been successfully created!",
        "success",
      );
      navigate("/bookings");
    } catch (error) {
      console.error("Booking failed:", error);
      openNotification(
        "topRight",
        "Booking Failed",
        "An error occurred while creating your booking. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const resetBooking = () => {
    setIsOpen(false);
    setBookingStep("selection");
    setSelectedDate(undefined);
    setSelectedService([]);
    setClientDetails({
      name: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    });
  };
  const goToTime = () => {
    if (selectedService.length > 0) {
      setBookingStep("time");
    }
  };
  const goToDetails = () => {
    setBookingStep("details");
  };
  const goToConfirmation = () => {
    setBookingStep("confirmation");
  };
  const goToSelection = () => {
    setBookingStep("selection");
  };
  console.log({
    selectedService,
  });
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
        title={"Book Your Appointment"}
        open={isOpen}
        onCancel={resetBooking}
        footer={null}
        style={{
          top: 20,
        }}
        styles={{}}
      >
        <div className="h-[80vh] w-full w-max-[500px] overflow-y-auto">
          {bookingStep === "selection" && (
            <div className="grid grid-cols-1 gap-8">
              <div className="mt-5">
                <h6 className="text-[18px] font-bold tracking-tight">
                  Step 1 - Select Services
                </h6>
                <p className="text-gray-700">
                  Pick the services you are interested in.
                </p>
              </div>
              {}
              <div className="space-y-6">
                <div>
                  <div className="space-y-4 grid grid-cols-1 gap-4 px-0.5">
                    {services.map((service) => (
                      <div
                        key={service.title}
                        className={`cursor-pointer transition-all rounded card-shadow ${selectedService?.includes(service.title) ? "border-2 border-pink-200 bg-gradient-to-r from-purple-50 to-pink-50" : "hover:shadow-lg"}`}
                        onClick={() => handleServiceSelection(service.title)}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">
                              {service.title}
                            </h4>
                            <Badge className="text-lg px-3 py-1 font-medium">
                              {formatNumber(service.price, {
                                currency: "NGN",
                                locale: "en-NG",
                                minimumFractionDigits: 0,
                              })}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            ₦ {service.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>₦ {service.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 my-10">
                    {}
                    <button
                      disabled
                      className="h-11 w-full flex items-center justify-center rounded-md border border-purple-300 text-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>

                    {}
                    <button
                      onClick={() => goToTime()}
                      disabled={selectedService.length === 0}
                      className="h-11 w-full flex items-center cursor-pointer justify-center rounded-md bg-gradient-to-r from-purple-300 to-pink-500 text-white hover:from-purple-400 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next - Pick A Date
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {bookingStep === "time" && (
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900"></h3>
                  <CalendarAndTimeslots
                    availableDays={availableDays}
                    availableFromTime={availableFromTime}
                    availableToTime={availableToTime}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedFromTime={selectedFromTime}
                    setSelectedFromTime={setSelectedFromTime}
                    selectedToTime={selectedToTime}
                    setSelectedToTime={setSelectedToTime}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 my-10">
                {}
                <button
                  onClick={goToSelection}
                  className="h-11 w-full flex items-center justify-center rounded-md border border-purple-300 text-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {}
                <button
                  onClick={goToDetails}
                  disabled={
                    !selectedFromTime || !selectedToTime || !selectedDate
                  }
                  className="h-11 w-full flex items-center cursor-pointer justify-center rounded-md bg-gradient-to-r from-purple-300 to-pink-500 text-white hover:from-purple-400 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next - Add Your Info
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {bookingStep === "details" && (
            <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={clientDetails.name}
                    onChange={(e) =>
                      setClientDetails({
                        ...clientDetails,
                        name: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                  />
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={clientDetails.phone}
                    onChange={(e) =>
                      setClientDetails({
                        ...clientDetails,
                        phone: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={clientDetails.email}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      email: e.target.value,
                    })
                  }
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Service Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter address where service will be provided"
                  value={clientDetails.location}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      location: e.target.value,
                    })
                  }
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  placeholder="Any specific requirements, skin concerns, or preferences..."
                  value={clientDetails.notes}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      notes: e.target.value,
                    })
                  }
                  className="w-full h-24 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                />
              </div>

              {}

              <div className="flex items-center justify-between gap-4 my-10">
                {}
                <button
                  onClick={goToTime}
                  className="h-11 w-full flex items-center justify-center rounded-md border border-purple-300 text-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {}
                <button
                  onClick={() => goToConfirmation()}
                  disabled={
                    !clientDetails.name ||
                    !clientDetails.email ||
                    !clientDetails.phone ||
                    !clientDetails.location ||
                    !clientDetails.notes
                  }
                  className="h-11 w-full flex items-center cursor-pointer justify-center rounded-md bg-gradient-to-r from-purple-300 to-pink-500 text-white hover:from-purple-400 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next - Confirm Booking
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
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
                  Please review your booking summary details below
                </p>
              </div>
              <div className="space-y-6">
                {}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold tracking-tight text-gray-800 mb-4">
                    Selected Services
                  </h3>
                  <div className="space-y-3">
                    {selectedServiceDetails.map((service) => (
                      <div
                        key={service.title}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600 font-medium tracking-tight">
                          {service.title}
                        </span>
                        <span className="font-semibold tracking-tight text-gray-800">
                          {formatNumber(service.price, {
                            currency: "NGN",
                            locale: "en-NG",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-semibold tracking-tight text-base">
                        Total Cost
                      </span>
                      <span className="text-lg font-bold tracking-tight text-gray-900">
                        {formatNumber(totalCost, {
                          currency: "NGN",
                          locale: "en-NG",
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-semibold tracking-tight text-base">
                        Total Duration
                      </span>
                      <div className="flex items-center text-gray-600 space-x-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-tight">
                          {totalDuration} Hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg mt-5">
                <h3 className="text-lg font-semibold tracking-tight text-gray-800 mb-4">
                  Booking Date & Time
                </h3>
                <div className="space-y-3">
                  {selectedDate && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600 space-x-2">
                        <CalendarIcon className="w-5 h-5" />
                        <span className="font-medium tracking-tight">
                          Date:
                        </span>
                      </div>
                      <span className="font-semibold tracking-tight text-gray-800">
                        {moment(selectedDate).format("LL")}
                      </span>
                    </div>
                  )}
                  {(selectedFromTime || selectedToTime) && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600 space-x-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium tracking-tight">
                          Time:
                        </span>
                      </div>
                      <span className="font-semibold tracking-tight text-gray-800">
                        {selectedFromTime} - {selectedToTime}
                      </span>
                    </div>
                  )}
                  {!selectedDate && !selectedFromTime && (
                    <p className="text-sm text-gray-500">
                      No date or time has been selected yet.
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg mt-5">
                <h3 className="text-lg font-semibold tracking-tight text-gray-800 mb-4">
                  Client Information
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  {clientDetails.name && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium tracking-tight">
                        {clientDetails.name}
                      </span>
                    </div>
                  )}
                  {clientDetails.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium tracking-tight">
                        {clientDetails.email}
                      </span>
                    </div>
                  )}
                  {clientDetails.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium tracking-tight">
                        {clientDetails.phone}
                      </span>
                    </div>
                  )}
                  {clientDetails.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium tracking-tight">
                        {clientDetails.location}
                      </span>
                    </div>
                  )}
                  {clientDetails.notes && (
                    <div className="flex flex-col space-y-1 mt-4 text-left">
                      <span className="font-semibold tracking-tight text-gray-700">
                        Notes:
                      </span>
                      <p className="font-normal text-gray-600 tracking-normal">
                        {clientDetails.notes}
                      </p>
                    </div>
                  )}
                  {!clientDetails.name &&
                    !clientDetails.email &&
                    !clientDetails.phone &&
                    !clientDetails.location &&
                    !clientDetails.notes && (
                      <p className="text-sm text-gray-500">
                        No client information has been entered yet.
                      </p>
                    )}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-2 mb-2 text-center">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold tracking-tight text-gray-800">
                    Payment
                  </span>
                </div>
                <p className="text-sm text-left text-gray-600 font-medium tracking-tight">
                  A 50% deposit of{" "}
                  <span className="font-bold text-gray-900 tracking-tight">
                    {formatNumber(depositAmount, {
                      currency: "NGN",
                      locale: "en-NG",
                      minimumFractionDigits: 0,
                    })}
                  </span>{" "}
                  will be required to confirm your booking. You'll receive
                  payment instructions via email.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 my-5">
                {}
                <button
                  onClick={goToDetails}
                  className="h-11 w-full flex items-center justify-center rounded-md border border-purple-300 text-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Change Something
                </button>

                {}
                <button
                  onClick={handleBookingSubmit}
                  className="h-11 w-full flex items-center cursor-pointer justify-center rounded-md bg-gradient-to-r from-purple-300 to-pink-500 text-white hover:from-purple-400 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Your Booking
                  <ArrowUpRight className="inline w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
