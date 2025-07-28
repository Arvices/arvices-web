import { Clock, Globe, MapPin, Calendar } from "feather-icons-react";
import { Dropdown, Menu } from "antd";
export interface AppointmentTime {
  day: string;
  from: string;
  to: string;
}

export interface Availability {
  startTime: string;
  endTime: string;
  mobileService: boolean;
  location: string;
  appointmentsAvailable: number;
  days: string[];
  appointmentTimes: AppointmentTime[];
}

export default function AvailabilitySection({
  availability,
}: {
  availability: Availability
}) {
  const appointmentMenu = (
    <Menu>
      {availability.appointmentTimes.map((item, idx) => (
        <Menu.Item key={idx} className="!w-max">
          <span className="text-sm">
            {item.day}: {item.from} – {item.to}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center space-x-3">
        <Clock className="w-5 h-5 text-purple-600" />
        <span>
          Available {availability.startTime} - {availability.endTime}
        </span>
      </div>

      {availability.mobileService && (
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-purple-600" />
          <span>Mobile services available</span>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <MapPin className="w-5 h-5 text-purple-600" />
        <span>Serving {availability.location}</span>
      </div>

      <Dropdown
        overlay={appointmentMenu}
        trigger={["hover"]}
        className="!w-max"
      >
        <div className="flex items-center space-x-3 cursor-pointer">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>
            {availability.appointmentsAvailable}+ appointments available this
            week
          </span>
        </div>
      </Dropdown>
    </div>
  );
}
