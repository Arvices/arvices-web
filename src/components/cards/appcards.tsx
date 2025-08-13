import React from "react";
import "./cards.css";
import { Button, Rate } from "antd";
import { Modal } from "antd";
import placeholderUserImg from "../../assets/images/pro-sample-img.png";
import FeatherIcon, {
  ArrowUpRight,
  Briefcase,
  Calendar,
  Check,
  Edit,
  Eye,
  FileText,
  Layers,
  MapPin,
  Plus,
  User,
  XCircle,
} from "feather-icons-react";
import { UserAccount } from "../../api-services/auth";
import { Link, useNavigate } from "react-router-dom";
import { followUser, rateUser, unfollowUser } from "../../api-services/auth-re";
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
import { Lightbulb, Snowflake } from "lucide-react";
import { Offer } from "../../types/main.types";
import ActionButtons, {
  buttonClasses,
  jobActions,
} from "../../pages/jobs&negotiations/jobsaction";
import EditJob from "../../pages/jobs&negotiations/client_components/editjob";
import {
  getServiceRequest,
  updateServiceRequest,
} from "../../api-services/servicerequests.service";
import { GenericTag } from "../../pages/jobs&negotiations/statustag";
import { initializeServiceRequestTransaction } from "../../api-services/wallet.services";
import RateUserModal from "./rateusermodal";

export function findAcceptedObject(arr: Offer[]) {
  return arr.find((item) => item.accepted === true) || null;
}

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
  Ongoing: "Ongoing",
  Completed: "Completed",
  Closed: "Closed",
} as const;

export type JobStatus = keyof typeof JobStatus; // Optional: if you want keys, or use `typeof JobStatus[keyof typeof JobStatus]` for values

export const OfferStatus = {
  Pending: "Pending",
  Negotiating: "Negotiating",
  Ongoing: "Ongoing",
  Completed: "Completed",
} as const;

export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export function getOfferStatusStyle(
  status: OfferStatus,
): keyof typeof buttonClasses {
  const statusMap: Record<OfferStatus, keyof typeof buttonClasses> = {
    [OfferStatus.Pending]: "mutedYellow",
    [OfferStatus.Negotiating]: "primary",
    [OfferStatus.Ongoing]: "mutedBlue",
    [OfferStatus.Completed]: "mutedGreen",
  };

  return statusMap[status] || "neutral";
}

export function getJobStatusStyle(
  status: JobStatus,
): keyof typeof buttonClasses {
  const statusMap: Record<JobStatus, keyof typeof buttonClasses> = {
    [JobStatus.Open]: "mutedYellow",
    [JobStatus.Negotiating]: "primary",
    [JobStatus.Ongoing]: "mutedBlue",
    [JobStatus.Completed]: "mutedGreen",
    [JobStatus.Closed]: "danger",
  };

  return statusMap[status] || "neutral";
}

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

  const userOffer = job?.offer.find((o) => o && o.user?.id === auth?.user?.id);
  const [editMode, setEditMode] = useState(!userOffer);

  const direction = isMobile ? "bottom" : "right";
  const [open, setOpen] = useState(false);

  const [offerData, setOfferData] = useState({
    price: userOffer?.price || "",
    includesMaterials:
      userOffer?.description
        ?.toLowerCase()
        .includes("includes materials: yes") || true,
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
        servicerequestId: job?.id,
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
        handleOfferAction("update", job?.id, response.data.response);
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
          jobId: job?.id,
          response: response.data.response,
        });
        handleOfferAction("add", job?.id, response.data.response);
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
      handleOfferAction("delete", job?.id, userOffer);
    } catch (error: any) {
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
    // View for existing offer
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition p-6 mt-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        You've made an offer for this job
      </h3>

<div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 my-5 space-y-4">
        <div>
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <Briefcase className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
            Job Category:
          </p>
          <p className="ml-6">{job?.category?.name ?? "Uncategorized"}</p>
        </div>

        <div>
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <MapPin className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
            Location:
          </p>
          <p className="ml-6">
            {job?.user?.address ?? "No address provided"}
          </p>
        </div>

        <div>
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <FileText className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
            Description:
          </p>
          <p className="ml-6 whitespace-pre-line">{job?.description}</p>
        </div>
</div>

<div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 my-5 space-y-4">

        <div>
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <Lightbulb className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
            Proposed Solution
          </p>
          <p className="ml-6">{userOffer?.description}</p>
        </div>
        <div>
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <Calendar className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
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
          <p className="flex items-center font-medium text-slate-900 dark:text-slate-100">
            <Calendar className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
            Offer Amount:
          </p>
          <p className="ml-6">
            <span className="mr-2">₦</span>
            {userOffer?.price}
          </p>
        </div>
</div>

      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">


      </div>

      <div className="mt-6 sm:flex sm:gap-4 sm:space-y-0 space-y-4">
        <div className="flex-1">
          <button
            onClick={handleCancelOffer}
            className="w-full flex items-center justify-center h-12 bg-transparent border border-red-500 text-red-500 rounded-lg font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Offer
          </button>
        </div>

        <div className="flex-1">
          <Link to={`/provider/manage-jobs/${job.id}/${userOffer.id}`} >
          <button
            className="w-full flex items-center justify-center h-12 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Edit className="w-4 h-4 mr-2" />
            Manage Offer
          </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    // View for making a new offer
    <div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Send an Offer
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Let the client know why you're the best professional for this
          job. Highlight your skills and experience to stand out.
        </p>
      </div>
      <div className="border-t my-7 border-slate-200 dark:border-slate-700" />
      <div>
        <div>
          <label className="font-medium tracking-tight mb-2 inline-block text-slate-900 dark:text-slate-100">
            Describe everything your solution to the client&apos;s
            need.
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Write something..."
            value={offerData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
          />
        </div>
      </div>
      <div className="border-t my-7 border-slate-200 dark:border-slate-700" />
      <div>
        <label className="block font-medium mb-1 text-slate-900 dark:text-slate-100">Price Amount</label>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          Give the client an estimate figure
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg text-slate-900 dark:text-slate-100">₦</span>
          <Input
            name="price"
            type="number"
            placeholder="0.00"
            value={offerData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>
      <div className="border-t my-7 border-slate-200 dark:border-slate-700" />
    </div>
  )}

  {/* Footer buttons */}
  <div className="border-t pt-7 mb-8 flex gap-x-4 border-slate-200 dark:border-slate-700">
    {!userOffer && (
      <div className="flex-1">
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center h-12 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium transition-colors hover:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          <span>
            Send Offer
            <ArrowUpRight className="inline w-6 h-6 relative bottom-0.5" />
          </span>
        </button>
      </div>
    )}
  </div>
</SlideIn>

      <div className="flex items-center ">
        <div className="max-w-max">
          <h6 className="font-medium tracking-tight">
            <span className="inline-block w-max p-2 py-1 rounded-full border border-gray-200">
              <User className={"inline-block mx-auto w-4 h-4"} />
            </span>{" "}
            {job?.user?.fullName || "Unknown"}
          </h6>
        </div>
        <div className="flex-1"></div>
        <div>
          <p className="text-[13px] text-gray-600 mt-1">
            {moment(job?.createdDate).fromNow()}
          </p>
        </div>
      </div>
      <div className="my-2 md:my-3 border-t border-gray-100" />
      <div className="max-w-max text-[14px] mb-3 mt-1.5">
        <p className="text-royalblue-main font-medium cursor-pointer tracking-tight">
          {" "}
          <MapPin className="inline" size={16} />{" "}
          {job?.user?.address ?? "No address"}
        </p>
        <p className="text-[14px] text-gray-600 mt-1 font-medium ">
          {job?.category?.name ?? "Uncategorized"}
        </p>
      </div>
      <div className="my-2 md:my-3 border-t border-gray-100" />
      <div>
        <p>{job?.description}</p>
      </div>
      <div className="mt-6 flex gap-2 text-[14px] bg-gray-100 px-4 py-[8px] rounded">
        <div className="w-max hidden">
          <Eye size={16} className="inline" /> 203
        </div>
        <div className="w-max pl-2 font-medium tracking-tight cursor-pointer">
          {job?.offer.length} Offer{job?.offer.length > 0 && "s"} Sent
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
      title="Close Job"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          No, go back
        </Button>,
        <Button key="submit" type="primary" danger onClick={onConfirm}>
          Yes, close job
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to close this job? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default CancelJobModal;

interface JobCardViewProp {
  job: Job | null;
  onJobChange: (data: any) => void;
  onOfferChange?: (data: any) => void;
  load: () => void;
}

export const JobCardView = ({ job, onJobChange, load }: JobCardViewProp) => {
  const auth = useAuth();

  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  let actions = jobActions[job?.status || "Open"];

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  const toggleCancelModal = () => setShowCancelModal((prev) => !prev);
  const toggleEditView = () => setShowEditView((prev) => !prev);
  console.log({ jobCardView: job });

  const handleEditSubmit = async (data: any) => {
    console.log("Edited offer submitted:", data);
    setLoading(true);
    setLoadingText("Updating service request...");

    try {
      let response = await updateServiceRequest(
        String(job?.id),
        data,
        auth.token,
      );
      onJobChange(response.data.response);

      openNotification("topRight", "Service Request Updated", "", "success");
      toggleEditView();
    } catch (error) {
      openNotification(
        "topRight",
        "Failed to Update Request",
        "Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setLoadingText("Initializing payment...");

    try {
      const response = await initializeServiceRequestTransaction(
        { servicerequestId: job?.id || -1, method: "Non Wallet" },
        { token: auth.token },
      );

      const { authorization_url } = response.data.response.data;

      if (authorization_url) {
        setPaymentUrl(authorization_url);
        setShowPaymentModal(true);
      } else {
        openNotification(
          "topRight",
          "Payment initialization failed",
          "No checkout URL was returned.",
          "error",
        );
      }
    } catch (error) {
      openNotification(
        "topRight",
        "Failed to initialize payment",
        "Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setLoadingText("Verifying payment...");

    try {
      const response = await getServiceRequest(
        job?.id ? String(job.id) : String(-1),
        auth.token,
      );

      onJobChange(response.data.response);

      if (response?.data?.response?.status === "Completed") {
        load();
      }
      openNotification(
        "topRight",
        "Payment verified",
        "Your payment has been confirmed successfully.",
        "success",
      );

      setShowPaymentModal(false);
    } catch (error) {
      openNotification(
        "topRight",
        "Verification failed",
        "Unable to verify payment. Please try again later.",
        "error",
      );
      console.log({ error });
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleEditCancel = () => {
    toggleEditView();
  };

  const handleCloseJob = async () => {
    try {
      setLoading(true);
      setLoadingText("Cancelling...");

      const response = await updateServiceRequest(
        String(job?.id),
        { status: "Closed" },
        auth.token,
      );
      onJobChange(response.data.response);

      toggleCancelModal();
      openNotification("topRight", "Service Request Updated", "", "success");
    } catch (error) {
      openNotification(
        "topRight",
        "Update Failed",
        "Failed to cancel the request. Please try again.",
        "error",
      );
      toggleCancelModal();
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleOpenJob = async () => {
    try {
      setLoading(true);
      setLoadingText("Reopening...");

      const response = await updateServiceRequest(
        String(job?.id),
        { status: "Open" },
        auth.token,
      );

      onJobChange(response.data.response);

      openNotification("topRight", "Service Request Reopened", "", "success");
    } catch (error) {
      console.error("Error reopening request:", error);
      openNotification(
        "topRight",
        "Update Failed",
        "Failed to reopen the request. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleRateUser = async (rating: number, reviewComment: string) => {
    const acceptedOffer = findAcceptedObject(job?.offer ? job.offer : []);

    try {
      setLoading(true);
      setLoadingText("Submitting your review...");

      await rateUser(
        acceptedOffer?.user?.id || -1,
        rating,
        reviewComment,
        auth.token,
      );

      openNotification(
        "topRight",
        "Review Submitted",
        "Your rating has been recorded successfully.",
        "success",
      );
    } catch (error) {
      console.error("Error rating user:", error);
      openNotification(
        "topRight",
        "Submission Failed",
        "We couldn’t submit your review. Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // SET NEW ACTION FUNCTIONS FOR ALL THE BUTTONS.
  if (job?.status === "Open") {
    actions = actions.map((action) => {
      if (action.label === "Edit Job") {
        action.action = () => setShowEditView(true);
      } else if (action.label === "Close Job") {
        action.action = () => setShowCancelModal(true);
      }
      return action;
    });
  } else if (job?.status === "Closed") {
    actions = actions.map((action) => {
      if (action.label === "Re-Open This Job") {
        action.action = handleOpenJob;
      }
      return action;
    });
  } else if (job?.status === "Ongoing") {
    actions.map((action) => {
      if (action.label === "Pay For This Job") {
        action.action = handlePayment;
      }
      return action;
    });
  } else if (job?.status === "Negotiating") {
    actions = actions.map((action) => {
      if (action.label === "Close Job") {
        action.action = () => setShowCancelModal(true);
      }
      return action;
    });
  } else if (job?.status === "Completed") {
    actions = actions.map((action) => {
      if (action.label === "Rate Provider") {
        action.action = () => setShowRateModal(true);
      }
      return action;
    });
  }
  if (showEditView) {
    return (
      <div className="w-full rounded-xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
        <EditJob
          initialData={{
            description: job?.description || "",
            address: job?.address || "",
          }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }
  return (
    <div className="w-full rounded-lg bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
      <CancelJobModal
        open={showCancelModal}
        onClose={toggleCancelModal}
        onConfirm={handleCloseJob}
      />

      <RateUserModal
        open={showRateModal}
        onCancel={() => setShowRateModal(false)}
        onSubmit={(rating, comment) => {
          handleRateUser(rating, comment);
          console.log({ rating, comment });
          setShowRateModal(false);
        }}
      />

      <Modal
        title="Complete Your Payment"
        open={showPaymentModal}
        onCancel={handleCancel}
        footer={null}
        width={400} // match iframe max-width
        bodyStyle={{ padding: 0 }}
        centered
      >
        {paymentUrl ? (
          <iframe
            src={paymentUrl}
            className="w-full max-w-[400px] h-[600px] border-0 rounded-lg"
            allow="payment"
          />
        ) : (
          <div className="w-full max-w-[400px] h-[600px] flex items-center justify-center">
            Loading payment...
          </div>
        )}
      </Modal>
      {/* Top Row: User + Timestamp */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-neutral-100 rounded-full">
            <User className="w-4 h-4 text-neutral-600" />
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-900">
              {auth.isClient
                ? "You Posted"
                : job?.user?.fullName || "Unknown User"}
            </span>
            <p className="text-xs text-neutral-500">
              Job Posted {moment(job?.createdDate).fromNow()}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-5 w-max">
          <GenericTag
            buttonStyle={getJobStatusStyle(job?.status || "Open")}
            label={`${job?.status}`}
          />
        </div>
      </div>

      {/* Address and Category */}
      <div className="p-3 bg-gray-100 rounded-[10px]">
        <div className="mb-5 space-y-1">
          <p className="text-sm font-medium tracking-tight text-neutral-800 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-neutral-500" />
            Location:{" "}
            {job?.address || job?.user?.address || "No address provided"}
          </p>
          <p className="text-sm text-neutral-600">
            {job?.category?.name || "Uncategorized"}
          </p>
        </div>

        {/* Description */}
        <div className="mb-0">
          <p className="text-sm text-neutral-800 leading-relaxed">
            <p className="text-sm font-medium tracking-tight text-neutral-800 flex items-center gap-1">
              <Snowflake className="w-4 h-4 text-neutral-500" />
              Job Description{" "}
            </p>
            {job?.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Actions (Client Only) */}
      {auth.isClient && (
        <div className="pt-4 border-t border-neutral-100">
          <ActionButtons actions={actions} />
        </div>
      )}
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
