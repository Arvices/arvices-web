import React from "react";

import imgShape from "../../assets/images/pro-sample-img.png"
import { Button } from "antd";
import { Badge } from "antd";
import { Card } from "antd";
import { Avatar } from "antd";
import {
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Star,
  Clock,
  Globe,
  Edit3,
  Calendar,
  TrendingUp,
  ArrowLeft,
} from "feather-icons-react";
import { PortfolioFilter } from "./portfoliofilter";
import { BookingCalendar } from "./bookingcarlendar";
import { BookingStatus } from "./bookingstatus";

const Profile = (): React.ReactNode => {
  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
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

                <nav className="hidden md:flex items-center space-x-8">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Providers
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Showcase
                  </a>
                </nav>

                <div className="flex items-center space-x-3">
                  <Button>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative inline-block mb-6">
                <div
                  className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-white shadow-2xl"
                  style={{ backgroundImage: `url('${imgShape}')` }}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Theresa Lane
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Ikeja, Lagos</span>
              </div>

              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                Makeup Artist
              </Badge>

              <div className="flex items-center justify-center space-x-1 mb-6">
                {[1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <Star className="w-5 h-5 text-gray-300" />
                <span className="ml-2 text-gray-600">4.2 (127 reviews)</span>
              </div>

              {/* Enhanced Booking Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <BookingCalendar />
                <Button className="shadow-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">127</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.2</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                </div>
              </div>

              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Professional makeup artist specializing in bridal and event
                makeup. I bring out the natural beauty in every client with
                personalized looks that last all day. Based in Lagos, serving
                clients across the city with mobile services.
              </p>
            </div>
          </section>

          {/* Booking Status - Show upcoming appointments */}
          <BookingStatus />

          {/* Interactive Portfolio with Filtering */}
          <PortfolioFilter />

          {/* Skills & Info */}
          <section className="py-16 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Skills */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Bridal Makeup",
                      "Special Events",
                      "Photo Shoots",
                      "Natural Looks",
                      "Glam Makeup",
                      "Contouring",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-white/80 text-gray-700 border border-purple-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Service Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Available 7am - 7pm</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">
                        Mobile services available
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">
                        Serving Lagos & surrounding areas
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">
                        2+ appointments available this week
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Written Reviews */}
          <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
                Recent Reviews
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Sarah Ahmed",
                    text: "Theresa did an amazing job on my wedding day. The makeup lasted all day and looked perfect in photos! Highly professional and such a lovely person to work with.",
                    rating: 5,
                    service: "Bridal Makeup",
                    date: "2 weeks ago",
                  },
                  {
                    name: "Ikenna Chukwu",
                    text: "Professional, talented, and such a lovely person to work with. The makeup for our family photoshoot was absolutely perfect. Highly recommend for any special event!",
                    rating: 5,
                    service: "Photoshoot Makeup",
                    date: "1 month ago",
                  },
                ].map((review, idx) => (
                  <Card key={idx} className="p-6 border-0 shadow-md bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <Badge className="text-xs">{review.service}</Badge>
                    </div>
                    <p className="text-gray-700 mb-4">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar size={32} src={imgShape}>
                          {review.name.charAt(0)}
                        </Avatar>
                        <span className="font-medium text-gray-900">
                          {review.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  View All Reviews
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-semibold">Arvice</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting you with the best service providers
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </div>
            </div>
          </footer>
        </div>
        );
      </div>
    </section>
  );
};

export default Profile;
