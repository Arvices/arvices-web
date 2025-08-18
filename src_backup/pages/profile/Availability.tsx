import { Clock, Globe, MapPin, UserCheck } from "feather-icons-react";
import { formatTimeWithAmPm } from "../../util/mainutils";

export interface AppointmentTime {
  day: string;
  from: string;
  to: string;
}

export interface Availability {
  startTime: string;
  endTime: string;
  mobileService?: boolean;
  location: string;
  appointmentsAvailable: number;
  days: string[];
  appointmentTimes?: AppointmentTime[];
}

export default function AvailabilitySection({
  startTime,
  endTime,
  mobileService = true,
  location,
  days,
}: Availability) {
  return (
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center space-x-3">
        <Clock className="w-5 h-5 text-purple-600" />
        <span>
          Available {formatTimeWithAmPm(startTime)} -{" "}
          {formatTimeWithAmPm(endTime)}
        </span>
      </div>

      {mobileService && (
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-purple-600" />
          <span>Mobile services available</span>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <MapPin className="w-5 h-5 text-purple-600" />
        <span>Serving {location}</span>
      </div>
      <div className="flex items-start space-x-3">
        <UserCheck className="w-5 h-5 text-purple-600 mt-1" />
        <div>
          <p className="">Available Days:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {days.filter(Boolean).map((day, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-2xl border border-gray-300 text-sm"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
