import { Badge, Button, Card } from "antd";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
} from "feather-icons-react";
interface Booking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  price: string;
  phone?: string;
}
const upcomingBookings: Booking[] = [
  {
    id: "1",
    clientName: "Adaeze Okonkwo",
    service: "Bridal Makeup",
    date: "2025-01-25",
    time: "10:00 AM",
    location: "Lekki Phase 1, Lagos",
    status: "upcoming",
    price: "₦45,000",
    phone: "+234 801 234 5678",
  },
  {
    id: "2",
    clientName: "Blessing Adamu",
    service: "Event Makeup",
    date: "2025-01-27",
    time: "2:00 PM",
    location: "Victoria Island, Lagos",
    status: "upcoming",
    price: "₦25,000",
    phone: "+234 802 345 6789",
  },
];
const recentBookings: Booking[] = [
  {
    id: "3",
    clientName: "Funmi Alabi",
    service: "Photoshoot Makeup",
    date: "2025-01-18",
    time: "11:00 AM",
    location: "Ikeja, Lagos",
    status: "completed",
    price: "₦20,000",
  },
  {
    id: "4",
    clientName: "Chioma Udoh",
    service: "Natural Glam",
    date: "2025-01-15",
    time: "3:00 PM",
    location: "Surulere, Lagos",
    status: "completed",
    price: "₦15,000",
  },
];
export function BookingStatus() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Upcoming Appointments ({upcomingBookings.length})
              </h3>
              <Badge color="blue">
                Next:{" "}
                {upcomingBookings.length > 0
                  ? formatDate(upcomingBookings[0].date)
                  : "None"}
              </Badge>
            </div>

            <div className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <Card className="text-center bg-white/50">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your next bookings will appear here
                  </p>
                </Card>
              ) : (
                upcomingBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-lg">
                            {booking.clientName}
                          </span>
                        </div>
                        <Badge color={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-purple-700">
                          {booking.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.service}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(booking.date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {booking.location}
                      </span>
                    </div>

                    {booking.phone && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {booking.phone}
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        icon={<MessageSquare className="w-3 h-3" />}
                      >
                        Message
                      </Button>
                      <Button className="flex-1">View Details</Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Recent Work</h3>
              <Badge color="green">
                {recentBookings.length} completed this month
              </Badge>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="bg-white/70 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          {booking.clientName}
                        </span>
                      </div>
                      <Badge color={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-700">{booking.price}</p>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {formatDate(booking.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {booking.location}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">Request Review</Button>
                    <Button className="flex-1">View Photos</Button>
                  </div>
                </Card>
              ))}

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="p-6 text-center">
                  <p className="text-gray-700 mb-3">
                    View your complete booking history and performance metrics
                  </p>
                  <Button className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    View All Bookings
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
