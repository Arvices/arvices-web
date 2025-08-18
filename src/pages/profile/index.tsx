import React, { useEffect, useState, useRef } from "react";
import { Carousel, Badge, Card, Button } from "antd";
import { LeftOutlined, RightOutlined, StarFilled } from "@ant-design/icons";
import { PortfolioFilter } from "./portfoliofilter";


{/* Interactive Portfolio with Filtering */}
<div className="w-full overflow-hidden">
  <PortfolioFilter />
</div>


import { Heart, MapPin, Star } from "feather-icons-react";
import { BookingCalendar } from "./bookingcarlendar";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAccountById, getUserReviews } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { UserAccount } from "../../api-services/auth";
import { parseHttpError } from "../../api-services/parseReqError";
import AvailabilitySection from "./Availability";
import { getInitials } from "../../util/getInitials";
import { formatRating } from "../../util/mainutils";
import { CheckCheckIcon, MessageCircle } from "lucide-react";
import moment from "moment";
import { getAllProfileService } from "../../api-services/profileservice.service";
import { ServiceOfferingPayload } from "./profile.types";
export interface Review {
  createdDate: string;
  id: number;
  rating: number;
  review: string;
  user: UserAccount;
  userWhoWasReviewed: UserAccount;
}
const Profile = (): React.ReactNode => {
  const auth = useAuth();
  const { pathname } = useLocation();
  const params = useParams();
  const id = params.id || auth?.user?.id;
  const isMyProfile =
    pathname.includes("myprofile") || params.id === auth?.user?.id;
  const carouselRef = useRef<any>(null);
  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [reviewsError, setReviewsError] = useState<string>("");
  const loadUserReviews = async () => {
    console.log({
      reviewsLoading,
      reviewsError,
    });
    setReviewsLoading(true);
    setReviewsError("");
    try {
      if (!auth?.user?.id) {
        setReviewsError("User not authenticated.");
        setReviewsLoading(false);
        return;
      }
      const response = await getUserReviews(auth.user.id, auth.token);
      setReviews(response.data.response);
      console.log({
        reviews: response,
      });
    } catch (error) {
      console.error("Failed to load user reviews:", error);
      setReviewsError("Failed to fetch reviews. Please try again.");
    } finally {
      setReviewsLoading(false);
    }
  };
  const [services, setServices] = useState<ServiceOfferingPayload[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const [servicesError, setServicesError] = useState<string>("");
  console.log({
    servicesLoading,
    servicesError,
  });
  const loadUserServices = async () => {
    setServicesLoading(true);
    setServicesError("");
    try {
      if (!auth?.token) {
        setServicesError("Authentication token is missing. Please log in.");
        setServicesLoading(false);
        return;
      }
      const response = await getAllProfileService(auth.token);
      setServices(response.data.response);
      console.log("User services fetched:", response.data.response);
    } catch (error) {
      setServicesError("Failed to fetch services. Please try again later.");
    } finally {
      setServicesLoading(false);
    }
  };
  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await getAccountById(String(id), auth.token);
      setUserProfile(response.data.response);
      setProfileErr(null);
    } catch (error: any) {
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
      loadUserReviews();
      loadUserServices();
    }
  }, [id, auth?.token]);
  let UIComponent = (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] relative mx-auto bg-[linear-gradient(to_right,_#ffe4f2,_#e8f4ff)]">
        {}
        {isMyProfile && (
          <Link to={"/profile/edit"}>
            <button className="border z-[50] border-blue-200 fixed cursor-pointer bottom-10 right-10 flex items-center space-x-1 text-sm px-5 py-2 bg-white text-gray-600 rounded">
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
              {userProfile?.category[0]?.name || "Uncategorized"}
            </Badge>

            <div className="flex items-center justify-center space-x-1 mb-6">
              {}
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  className={
                    index < (userProfile?.rating || 0)
                      ? "w-5 h-5 fill-yellow-400 text-yellow-400"
                      : "w-5 h-5 text-gray-300"
                  }
                />
              ))}

              {}
              <span className="ml-2 text-gray-600">
                {userProfile?.rating?.toFixed?.(1) || "0.0"} Rating from (
                {userProfile?.numberOfRating} reviews)
              </span>
            </div>

            {}
            {!isMyProfile && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <BookingCalendar profile={userProfile} services={services} />
                <Button className="shadow-sm !h-12">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
                <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-sm font-medium rounded-full text-blue-800 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With User</span>
                </button>
              </div>
            )}

            {}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8 items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userProfile?.satisfiedClients}
                </div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatRating(userProfile?.rating ? userProfile.rating : 0) ||
                    "0.0"}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              {}
            </div>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {userProfile?.bio || ""}
            </p>
          </div>
        </section>
      </div>
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {}

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Booking Status - Show upcoming appointments */}
{/* <BookingStatus /> */}

{/* Interactive Portfolio with Filtering */}
<PortfolioFilter />


          {/* Skills & Info */}
          <section className="py-16 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap !gap-2">
                    {userProfile?.specialties &&
                      userProfile.specialties.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-white/80 text-gray-700 border !px-2 !py-2 rounded-2xl text-sm border-purple-400"
                        >
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>

                {}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Service Info
                  </h3>
                  <AvailabilitySection
                    startTime={userProfile?.availableFromTime || ""}
                    location={userProfile?.address || ""}
                    appointmentsAvailable={3}
                    endTime={userProfile?.availableToTime || ""}
                    days={userProfile?.availableDays || []}
                  />
                </div>
              </div>
            </div>
          </section>

          {}

          <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
                Recent Reviews
              </h3>
              {reviews.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4 h-full w-full">
                  <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-slate-400 dark:text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2H3l-1-1v-4a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                      No reviews available
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      This user hasn't received any reviews yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {}
                  <Carousel
                    ref={carouselRef}
                    dots={false}
                    autoplay={reviews.length > 1}
                    slidesToShow={reviews.length === 1 ? 1 : 2}
                    responsive={
                      reviews.length > 1
                        ? [
                            {
                              breakpoint: 768,
                              settings: {
                                slidesToShow: 1,
                              },
                            },
                          ]
                        : []
                    }
                  >
                    {reviews.map((review, idx) => (
                      <div key={idx} className="px-2">
                        <Card className="px-6 pt-6 card-shadow bg-white h-full">
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
                              <CheckCheckIcon
                                className="inline-block"
                                size={16}
                              />
                            </span>
                          </div>
                          <p className="text-gray-800 mb-6">
                            "{review.review}"
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900 inline-block ml-2">
                                {review.user.fullName}{" "}
                                <span className="text-gray-500 text-[12px] font-normal">
                                  Client
                                </span>
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {moment(review.createdDate).format("lll")}
                            </span>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </Carousel>

                  {}
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
              )}
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
