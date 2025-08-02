import "./cards.css";
import { Button, Rate } from "antd";

import placeholderUserImg from "../../assets/images/pro-sample-img.png";
import FeatherIcon, {
  ArrowUpRight,
  Box,
  Briefcase,
  Calendar,
  Check,
  Edit,
  Eye,
  FileText,
  Layers,
  MapPin,
  PenTool,
  Plus,
  User,
} from "feather-icons-react";
import { UserAccount } from "../../api-services/auth";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { getInitials } from "../../util/getInitials";
import moment from "moment";
import { SlideIn } from "../slideupUI";
import { Input } from "../input";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useLoading } from "../../contexts/LoadingContext";
import { createOffer, updateOffer } from "../../api-services/offer.service";

export interface CategoryDataItem {
  title: string;
  tagline: string;
  img: string;
}

export const CatCard: React.FC<CategoryDataItem> = ({
  title,
  tagline,
  img,
}) => {
  return (
    <div className="card-shadow rounded-[10px] p-3 w-max">
      <div className="flex gap-x-3 items-center">
        <div className="w-max">
          <img className="w-20 h-20" src={img} />
        </div>
        <div className="flex-1">
          <h6 className="text-royalblue-shade3 font-medium">{title}</h6>
          <p>{tagline}</p>
        </div>
      </div>
    </div>
  );
};

interface ProviderCardInterface {
  provider: UserAccount;
}

export const ProviderCard: React.FC<ProviderCardInterface> = ({ provider }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const currentUserId = auth?.user?.id ?? -1;
  const isUserFollowing =
    Array.isArray(provider.followers) &&
    provider.followers.includes(currentUserId);

  const [isFollowing, setIsFollowing] = useState(isUserFollowing);

  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unfollowUser(provider.id.toString(), auth.token);
        setIsFollowing(false);
      } else {
        await followUser(provider.id.toString(), auth.token);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(`${isFollowing ? "Unfollow" : "Follow"} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[10px] card-shadow p-4 pb-5 pt-6">
      {/* Card Header */}
      <div className="flex mb-15">
        <div className="w-max">
          <span className="level-tag px-4 py-2 gradient text-white rounded">
            PRO
          </span>
        </div>
        <div className="flex-1" />
        <div className="w-max">
          <p className="text-royalblue-shade3 font-medium tracking-tight">
            Top Professional
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div>
        <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center overflow-hidden rounded-full bg-amber-50 text-4xl font-semibold text-royalblue-main">
          {provider?.picture ? (
            <img
              src={provider.picture}
              className="w-full h-full object-cover"
              alt="User"
            />
          ) : (
            <span>{getInitials(provider?.fullName || "")}</span>
          )}
        </div>
        <div className="mt-8 text-center">
          <h5 className="text-2xl font-medium tracking-tight mb-2 capitalize">
            {provider.fullName}
          </h5>
          <p className="mb-2">
            <span className="block my-3 w-max mx-auto p-1 rounded-2xl text-white bg-gradient-to-r px-4 py-2 from-royalblue-shade4 to-royalblue-main">
              <Layers className="inline w-4 h-4" /> Make Up Artist
            </span>
            <span className="inline-block ml-2">
              <FeatherIcon className="inline" size={18} icon="map-pin" />{" "}
              {provider.address}
            </span>
          </p>
          <div className="mb-2">
            <Rate
              style={{ fontSize: "16px" }}
              allowHalf
              disabled
              value={provider?.rating || 0}
            />{" "}
            {provider?.rating} Overall Rating
          </div>
          <p>0 Satisfied Clients</p>
        </div>
      </div>

      {/* Card Buttons */}
      <div className="flex gap-x-3 mt-10">
        <div className="flex-1">
          <Button
            block
            loading={loading}
            onClick={handleFollowToggle}
            className="!py-6 !bg-royalblue-main !text-white"
          >
            {isFollowing ? (
              <>
                Following <Check className="inline ml-1" size={18} />
              </>
            ) : (
              <>
                Follow <Plus className="inline ml-1" size={18} />
              </>
            )}
          </Button>
        </div>
        <div className="flex-1">
          <Link to={`/user-profile/${provider.id}`}>
            <Button
              block
              className="!py-6 !border !border-royalblue-tint3 text-royalblue-shade3"
            >
              View Page <ArrowUpRight className="inline ml-1" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ActivityCard: React.FC = () => {
  return (
    <div className="rounded-[10px] card-shadow p-0">
      <div className="w-full aspect-[5/3]">
        <img
          src={placeholderUserImg}
          className="rounded-t-[8px] w-full h-full object-cover"
        />
      </div>
      <div className="w-full p-3">
        <div className="flex px my-3">
          <div className="w-max">
            <FeatherIcon className="inline" icon="heart"></FeatherIcon>
          </div>
          <div className="flex-1" />
          <div className="w-max">
            <FeatherIcon className="inline-block mr-3" icon="send" />{" "}
            <FeatherIcon className="inline" icon="bookmark" />{" "}
          </div>
        </div>
        <div className="my-3">
          <p>
            Wedding Makeup Jobs at Eko Hotel and Suites. #beckystudios
            #brideglam
          </p>
        </div>
        <div className="my-3">
          <p className="text-gray-500">Posted Wed July, 2024. 3:14am</p>
        </div>
      </div>
    </div>
  );
};

export interface Job {
  id: number;
  address: string;
  category: {
    id: number;
    name: string;
    description: string | null;
    file: string | null;
    createdDate: string;
  };
  createdDate: string;
  description: string;
  images: string[]; // Adjust if images have an object structure
  offer: any[]; // Specify type if offer items have a defined structure
  position: any | null; // Define more specifically if known
  status: string;
  type: string;
  user?: UserAccount;
}

interface JobCardProp {
  job: Job;
}

export const JobCard = ({ job }: JobCardProp) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const isMobile = window.innerWidth < 768;
  const userOffer = job.offer.find((o) => o && o.user?.id === auth?.user?.id);

  const [editMode, setEditMode] = useState(!userOffer);

  const direction = isMobile ? "bottom" : "right";
  const [open, setOpen] = useState(false);

  const [offerData, setOfferData] = useState({
    price: userOffer?.price || "",
    includesMaterials:
      userOffer?.description
        ?.toLowerCase()
        .includes("includes materials: yes") || false,
    description:
      userOffer?.description
        ?.replace(/includes materials: yes|no/i, "")
        .trim() || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (
      !offerData.price ||
      !offerData.description ||
      !offerData.includesMaterials
    ) {
      openNotification(
        "topRight",
        "Incomplete",
        "Please fill in all fields",
        "error",
      );
      return;
    }

    try {
      setLoadingText("Sending offer...");
      setLoading(true);

      const payload = {
        price: offerData.price,
        description: `${offerData.description}\n\nIncludes materials: ${offerData.includesMaterials}`,
        servicerequestId: job.id,
      };
      let response;
      if (userOffer) {
        response = await updateOffer(auth.token, userOffer.id, {
          price: offerData.price,
          description: offerData.description,
          accepted: userOffer.accepted,
        });

        openNotification(
          "topRight",
          "Success",
          "Offer Updated successfully",
          "success",
        );
      } else {
        response = await createOffer(auth.token, payload);

        openNotification(
          "topRight",
          "Success",
          "Offer sent successfully",
          "success",
        );
      }
      console.log(editMode ? "Offer created:" : "Offer Updated", response.data);

      setOpen(false); // Optionally close slide-in
    } catch (error: any) {
      console.error("Error creating offer:", error);
      openNotification(
        "topRight",
        "Error",
        error?.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  return (
    <div className="card-shadow rounded-[10px] p-5 py-6 sm:p-6 w-full">
      {/* Slide from Right */}
      <SlideIn from={direction} isOpen={open} toggle={() => setOpen(false)}>
        {userOffer && !editMode ? (
          <div className="bg-white border border-gray-200 rounded-2xl card-shadow transition p-5 mt-14 mb-10">
            <h3 className="text-lg font-semibold text-royalblue-main mb-4">
              You've made an offer for this job 👋
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="flex items-center font-medium text-gray-900">
                  <Briefcase className="w-4 h-4 mr-2 text-royalblue-main" />
                  Job Category:
                </p>
                <p className="ml-6">{job.category?.name ?? "Uncategorized"}</p>
              </div>

              <div>
                <p className="flex items-center font-medium text-gray-900">
                  <MapPin className="w-4 h-4 mr-2 text-royalblue-main" />
                  Location:
                </p>
                <p className="ml-6">
                  {job.user?.address ?? "No address provided"}
                </p>
              </div>

              <div>
                <p className="flex items-center font-medium text-gray-900">
                  <FileText className="w-4 h-4 mr-2 text-royalblue-main" />
                  Description:
                </p>
                <p className="ml-6 whitespace-pre-line">{job.description}</p>
              </div>

              <div>
                <p className="flex items-center font-medium text-gray-900">
                  <Calendar className="w-4 h-4 mr-2 text-royalblue-main" />
                  Offer Made On:
                </p>
                <p className="ml-6">
                  {new Date(userOffer.createdDate).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <p className="flex items-center font-medium text-gray-900">
                  <Calendar className="w-4 h-4 mr-2 text-royalblue-main" />
                  Offer Amount:
                </p>
                <p className="ml-6">
                  <span className="mr-2">₦</span>
                  {userOffer?.price}
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <Button
                className="w-full !h-12 bg-royalblue-main text-white hover:bg-royalblue-dark"
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Offer
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5">
                Send an Offer
              </h2>
              <p className="mt-2 text-royalblue-shade5">
                Let the client know why you're the best professional for this
                job. Highlight your skills and experience to stand out.
              </p>
            </div>
            <div className="border-t my-7 border-gray-200" />
            <div>
              <div>
                <label className="font-medium tracking-tight mb-2 inline-block">
                  Describe everything your solution to the client&apos;s
                  need.{" "}
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Write something..."
                  value={offerData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <div className="border-t my-7 border-gray-200" />
            <div>
              <label className="block font-medium mb-1">Price Amount</label>
              <p className="text-gray-500 mb-2">
                Give the client an estimate figure
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg">₦</span>
                <Input
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={offerData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t my-7 border-gray-200" />
            <div>
              <label className="block tracking-tight font-medium mb-1">
                Does this include materials needed for the job?
              </label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="includesMaterials"
                    value="yes"
                    checked={offerData.includesMaterials === "yes"}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <span>Yes, the amount I gave will cover everything</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="includesMaterials"
                    value="no"
                    checked={offerData.includesMaterials === "no"}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <span>No, the client will get quoted price later on</span>
                </label>
              </div>
              <div className="border-t my-7 border-gray-200" />
              <div className="pt-2 mb-8 flex gap-x-4">
                {userOffer && (
                  <div className="flex-1">
                    <Button
                      className="w-full !h-12 bg-royalblue-main text-white hover:bg-royalblue-dark"
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Cancel Update
                    </Button>
                  </div>
                )}
                <div className="flex-1">
                  <button
                    onClick={handleSubmit}
                    className="w-full !h-12 bg-royalblue-shade6 cursor-pointer text-white py-2 rounded-md font-medium hover:bg-gray-900 transition"
                  >
                    {userOffer ? (
                      <span>
                        Update{" "}
                        <ArrowUpRight className="inline w-6 h-6 relative bottom-0.5" />
                      </span>
                    ) : (
                      "Send Offer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlideIn>

      <div className="flex items-center ">
        <div className="max-w-max">
          <h6 className="font-medium tracking-tight">
            <span className="inline-block w-max p-2 py-1 rounded-full border border-gray-200">
              <User className={"inline-block mx-auto w-4 h-4"} />
            </span>{" "}
            {job.user?.fullName || "Unknown"}
          </h6>
        </div>
        <div className="flex-1"></div>
        <div>
          <p className="text-[13px] text-gray-600 mt-1">
            {moment(job.createdDate).fromNow()}
          </p>
        </div>
      </div>
      <div className="my-2 md:my-3 border-t border-gray-100" />
      <div className="max-w-max text-[14px] mb-3 mt-1.5">
        <p className="text-royalblue-main font-medium cursor-pointer tracking-tight">
          {" "}
          <MapPin className="inline" size={16} />{" "}
          {job.user?.address ?? "No address"}
        </p>
        <p className="text-[14px] text-gray-600 mt-1 font-medium ">
          {job.category?.name ?? "Uncategorized"}
        </p>
      </div>
      <div className="my-2 md:my-3 border-t border-gray-100" />
      <div>
        <p>{job.description}</p>
      </div>
      <div className="mt-6 flex gap-2 text-[14px] bg-gray-100 px-4 py-[8px] rounded">
        <div className="w-max hidden">
          <Eye size={16} className="inline" /> 203
        </div>
        <div className="w-max pl-2 font-medium tracking-tight cursor-pointer">
          {job.offer.length} Offer{job.offer.length > 0 && "s"} Sent
        </div>
        <div className="flex-1"></div>
        <div
          onClick={() => setOpen(true)}
          className="w-max text-royalblue-main font-medium tracking-tight cursor-pointer"
        >
          Send An Offer <ArrowUpRight className="inline" size={16} />
        </div>
      </div>
      <div className="meta"></div>
    </div>
  );
};

export const HomeCatCard: React.FC<CategoryDataItem> = ({
  title,
  tagline,
  img,
}) => {
  return (
    <div className="p-3 rounded border w-min-[120px]  w-max-[150px] mx-1 text-center border-gray-200">
      <div className="rounded-[100px] w-max bg-gray-100 mx-auto mb-3">
        <img className="w-[70px] h-[70px]" src={img} />
      </div>
      <div className=" text-gray-700 text-[15px]">
        <h6 className="font-medium mb-1">{title}</h6>
        <p className="text-gray-700 text-[14px]">{tagline}</p>
      </div>
    </div>
  );
};
