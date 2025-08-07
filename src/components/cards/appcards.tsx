
import React from "react";
import "./cards.css";
import { Button, Rate } from "antd";
import { Modal} from "antd";
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
import { Link, useNavigate } from "react-router-dom";
import { followUser, unfollowUser } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { getInitials } from "../../util/getInitials";
import moment from "moment";
import { SlideIn } from "../slideupUI";
import { Input } from "../input";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useLoading } from "../../contexts/LoadingContext";
import {
  createOffer,
  deleteOffer,
  updateOffer,
} from "../../api-services/offer.service";
import { Lightbulb } from "lucide-react";
import { Offer } from "../../types/main.types";
import ActionButtons, {
  buttonClasses,
  clientJobActions,
  ClientJobState,
} from "../../pages/jobs&negotiations/jobsaction";
import EditJob from "../../pages/jobs&negotiations/client_components/editjob";

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
  const { openNotification } = useNotificationContext();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = auth?.user?.id ?? -1;
  const isUserFollowing =
    Array.isArray(provider.followers) &&
    provider.followers.includes(currentUserId);

  const [isFollowing, setIsFollowing] = useState(isUserFollowing);

  const handleFollowToggle = async () => {
    if (!auth.isAuthenticated) {
      openNotification(
        "topRight",
        "Logging before you can follow this user, you must sign in.",
        "You will be redirected to the login page",
        "info",
      );
      setTimeout(() => {
        navigate("/login");
      }, 200);
      return;
    }
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
              <Layers className="inline w-4 h-4" />{" "}
              {(provider?.category &&
                provider.category[0] &&
                provider?.category[0]?.name) ||
                "Uncategorized"}
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
export const JobStatus = {
  Open: "Open",
  Negotiating: "Negotiating",
  Assigned: "Assigned",
  Ongoing: "Ongoing",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type JobStatusType = keyof typeof JobStatus;

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
  offer: Offer[]; // Specify type if offer items have a defined structure
  position: any | null; // Define more specifically if known
  status: JobStatusType;
  type: string;
  user?: UserAccount;
}

interface JobCardProp {
  job: Job;
  handleOfferAction: (
    action: "add" | "delete" | "update",
    id: number,
    updatedJob?: any,
  ) => void;
}

export const JobCard = ({ job, handleOfferAction }: JobCardProp) => {
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
        console.log({ userOffer });
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
        handleOfferAction("update", job.id, response.data.response);
        setEditMode(false);
      } else {
        response = await createOffer(auth.token, payload);
        openNotification(
          "topRight",
          "Success",
          "Offer sent successfully",
          "success",
        );

        setEditMode(false);
        console.log({
          add: "add",
          jobId: job.id,
          response: response.data.response,
        });
        handleOfferAction("add", job.id, response.data.response);
      }
      console.log(
        userOffer ? "Offer created:" : "Offer Updated",
        response.data,
      );
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

  const handleCancelOffer = async () => {
    try {
      setLoadingText("Cancelling offer...");
      setLoading(true);

      await deleteOffer(auth.token, userOffer?.id || 0);

      openNotification(
        "topRight",
        "Success",
        "Offer cancelled successfully",
        "success",
      );

      setOpen(false); // Optionally close slide-in
      handleOfferAction("delete", job.id, userOffer);
      const [offerData, setOfferData] = useState({
        price: "",
        includesMaterials: false,
        description: "",
      });
    } catch (error: any) {
      console.error("Error cancelling offer:", error);
      openNotification(
        "topRight",
        "Error",
        error?.response?.data?.message || "Failed to cancel offer",
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
                  <Lightbulb className="w-4 h-4 mr-2 text-royalblue-main" />
                  Proposed Solution
                </p>
                <p className="ml-6">{userOffer?.description}</p>
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

            <div className="mt-6 sm:flex sm:gap-4 sm:space-y-0 space-y-4">
              <div className="flex-1">
                <Button
                  type="default"
                  danger
                  className="w-full !h-12 !border-red-500 !text-red-600 hover:!border-red-600 hover:!text-red-700"
                  onClick={handleCancelOffer}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Cancel Offer
                </Button>
              </div>

              <div className="flex-1">
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
            {/*
              
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
              */}
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

interface CancelJobModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelJobModal: React.FC<CancelJobModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      title="Cancel Job"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          No, go back
        </Button>,
        <Button key="submit" type="primary" danger onClick={onConfirm}>
          Yes, cancel job
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to cancel this job? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default CancelJobModal;

export const JobCardView = ({ job }: { job: Job }) => {
  const auth = useAuth();
  const open = job.status === JobStatus.Open;
  let action: ClientJobState = "open"; // This would typically come from business logic
  let actions = clientJobActions[action];

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditView, setShowEditView] = useState(false);

  const toggleCancelModal = () => setShowCancelModal((prev) => !prev);
  const toggleEditView = () => setShowEditView((prev) => !prev);

  if (action === "open") {
    actions = actions.map((action, index) => {
      if (action.label === "Edit Job") {
        action.action = () => setShowEditView(true);
      } else if (action.label === "Close Job") {
        action.action = () => setShowCancelModal(true);
      }
      return action;
    });
  }
  
  const handleCancelJob = () => {
    // Add actual cancel logic here
    console.log("Job cancelled");
    setShowCancelModal(false);
  };

  const handleEditSubmit = (data: any) => {
    console.log("Edited offer submitted:", data);
    toggleEditView();
  };

  const handleEditCancel = () => {
    console.log("Edit cancelled");
    toggleEditView();
  };

   if (showEditView) {
    return (
      <div className="w-full rounded-xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
        <EditJob
          initialData={{
            description: job.description,
            address: job.address,
          }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
      
      <CancelJobModal
        open={showCancelModal}
        onClose={toggleCancelModal}
        onConfirm={handleCancelJob}
      />
      {/* Top Row: User + Timestamp */}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-full">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            {job.user?.fullName || "Unknown User"}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Job Posted {moment(job.createdDate).fromNow()}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Address and Category */}
      <div className="mb-4 space-y-1">
        <p className="text-sm text-royalblue-main font-semibold flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.address || job.user?.address || "No address provided"}
        </p>
        <p className="text-sm text-gray-600 font-medium">
          {job.category?.name || "Uncategorized"}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Description */}
      <div className="text-sm text-gray-800 leading-relaxed ">
        {job.description || "No description provided."}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />
      {
        open && <ActionButtons actions={actions} />
      }
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
