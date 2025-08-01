import React, { useEffect, useState, useRef } from "react";
import { Carousel, Avatar, Badge, Card, Button } from "antd";
import imgShape from "../../assets/images/pro-sample-img.png";
import { LeftOutlined, RightOutlined, StarFilled } from "@ant-design/icons";

import { Heart, MapPin, Star } from "feather-icons-react";
import { PortfolioFilter } from "./portfoliofilter";
import { BookingCalendar } from "./bookingcarlendar";
import { BookingStatus } from "./bookingstatus";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAccountById, getAllUsers } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { UserAccount } from "../../api-services/auth";
import { parseHttpError } from "../../api-services/parseReqError";
import AvailabilitySection, { Availability } from "./Availability";
import { getInitials } from "../../util/getInitials";

const reviews = [
  {
    name: "Adaobi Nwosu",
    text: "Theresa is incredibly talented! She arrived early, listened to exactly what I wanted, and delivered beyond expectations. My birthday glam was flawless.",
    rating: 5,
    service: "Birthday Glam",
    date: "3 weeks ago",
  },
  {
    name: "Fola Adeyemi",
    text: "Her attention to detail is unmatched. The makeup she did for my engagement shoot looked so natural and lasted all day—even through the Lagos heat!",
    rating: 5,
    service: "Engagement Makeup",
    date: "2 weeks ago",
  },
  {
    name: "Chisom Eze",
    text: "Theresa brought out the best version of me for my traditional wedding. She’s calm, punctual, and seriously gifted at her craft.",
    rating: 5,
    service: "Traditional Bridal",
    date: "1 month ago",
  },
  {
    name: "Tosin Aluko",
    text: "I was nervous about getting my makeup done, but she made me feel comfortable and beautiful. Will definitely book again for future events.",
    rating: 5,
    service: "Event Makeup",
    date: "1 week ago",
  },
  {
    name: "Ngozi Okeke",
    text: "Absolutely loved the soft glam look she gave me for my friend's wedding. Got compliments all day and night!",
    rating: 5,
    service: "Soft Glam",
    date: "5 days ago",
  },
];

const Profile = (): React.ReactNode => {
  const auth = useAuth();
  const { pathname } = useLocation();
  const params = useParams();
  const id = params.id || auth?.user?.id;

  const isMyProfile =
    pathname.includes("myprofile") || params.id === auth?.user?.id;
  console.log({ isMyProfile });
  const carouselRef = useRef<any>(null);

  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const availability: Availability = {
    startTime: "7am",
    endTime: "7pm",
    mobileService: true,
    location: "Lagos & surrounding areas",
    appointmentsAvailable: 2,
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    appointmentTimes: [
      { day: "Monday", from: "7am", to: "7pm" },
      { day: "Tuesday", from: "7am", to: "7pm" },
      { day: "Wednesday", from: "7am", to: "7pm" },
      { day: "Thursday", from: "7am", to: "7pm" },
      { day: "Friday", from: "7am", to: "7pm" },
      { day: "Saturday", from: "7am", to: "7pm" },
      { day: "Sunday", from: "7am", to: "7pm" },
    ],
  };

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await getAccountById(String(id), auth.token);
      setUserProfile(response.data.response);
      console.log({ res: response.data });
      setProfileErr(null);
    } catch (error: any) {
      console.log({ error });
      const message = parseHttpError(error);
      setProfileErr(message || "Failed to load profile");
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (id && auth?.token) {
      loadProfile();
    }
  }, [id, auth?.token]);

  let UIComponent = (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] relative mx-auto bg-[linear-gradient(to_right,_#ffe4f2,_#e8f4ff)]">
        {/* Hero Section */}
        {isMyProfile && (
          <Link to={"/profile/edit"}>
            <button className="border z-[1] border-blue-200 absolute cursor-pointer top-10 right-10 flex items-center space-x-1 text-sm px-5 py-2 bg-white text-gray-600 rounded">
              <span>Edit Profile</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-.878.515L7 17l.657-3.95a2 2 0 01.515-.878z"
                />
              </svg>
            </button>
          </Link>
        )}
        <section className="relative py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center bg-gray-200 text-white text-3xl font-semibold">
                {userProfile?.picture ? (
                  <img
                    src={userProfile?.picture}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(userProfile?.fullName || "")}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
              {userProfile?.fullName}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{userProfile?.address}</span>
            </div>

            <Badge className="!mb-6 !px-6 !py-3 cursor-pointer bg-gradient-to-r from-purple-200 to-pink-200 border-purple-400 rounded">
              Makeup Artist
            </Badge>

            <div className="flex items-center justify-center space-x-1 mb-6">
              {/* Stars */}
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={
                    index < (userProfile?.rating || 0)
                      ? "w-5 h-5 fill-yellow-400 text-yellow-400"
                      : "w-5 h-5 text-gray-300"
                  }
                />
              ))}

              {/* Rating text */}
              <span className="ml-2 text-gray-600">
                {userProfile?.rating?.toFixed?.(1) || "0.0"} Rating from (
                {userProfile?.numberOfRating} reviews)
              </span>
            </div>

            {/* Enhanced Booking Section */}
            {!isMyProfile && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <BookingCalendar />
                <Button className="shadow-sm !h-12">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8 items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {"D-P"}
                </div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userProfile?.rating || "0.0"}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              {/*
                
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Return Rate</div>
              </div>
                */}
            </div>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {userProfile?.bio || ""}
            </p>
          </div>
        </section>
      </div>
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          {/* Booking Status - Show upcoming appointments 
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
                  <div className="flex flex-wrap !gap-2">
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
                        className="bg-white/80 text-gray-700 border !px-2 !py-2 rounded-sm text-sm border-purple-100"
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
                  <AvailabilitySection availability={availability} />
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

              <div className="relative">
                {/* Carousel */}
                <Carousel
                  ref={carouselRef}
                  dots={false}
                  autoplay
                  slidesToShow={2}
                  responsive={[
                    {
                      breakpoint: 768,
                      settings: { slidesToShow: 1 },
                    },
                  ]}
                >
                  {reviews.map((review, idx) => (
                    <div key={idx} className="px-2">
                      <Card className="px-6 pt-6 border-0 shadow-md bg-white h-full">
                        <div className="flex justify-between items-center mb-7">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarFilled
                                key={star}
                                className="!text-yellow-400 w-4 h-4"
                              />
                            ))}
                          </div>
                          <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-600">
                            {review.service}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-6">"{review.text}"</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900 inline-block ml-2">
                              {review.name}{" "}
                              <span className="text-gray-500 text-[12px] font-normal">
                                Client
                              </span>
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Carousel>

                {/* Prev/Next Buttons */}
                <div className="absolute -left-8 md:-left-14 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={() => carouselRef.current?.prev()}
                    className="border border-gray-300 bg-white rounded-full w-9 h-9 md:w-15 md:h-15 shadow hover:bg-gray-100"
                  >
                    <LeftOutlined />
                  </button>
                </div>
                <div className="absolute -right-8 md:-right-14 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={() => carouselRef.current?.next()}
                    className="border border-gray-300 bg-white rounded-full  w-9 h-9 md:w-15 md:h-15  shadow hover:bg-gray-100"
                  >
                    <RightOutlined />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );

  return (
    <ContentHOC
      loading={profileLoading}
      loadingText={"Loading User Profile. Please Wait"}
      error={!!profileErr}
      errMessage={profileErr as string}
      noContent={false}
      actionFn={loadProfile}
      UIComponent={UIComponent}
    />
  );
};

export default Profile;
