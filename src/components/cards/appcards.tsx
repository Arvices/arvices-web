import "./cards.css";
import { Button, Rate } from "antd";

import placeholderUserImg from "../../assets/images/pro-sample-img.png";
import FeatherIcon, {
  ArrowUpRight,
  Check,
  Eye,
  MapPin,
  Plus,
} from "feather-icons-react";
import { UserAccount } from "../../api-services/auth";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

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
  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleFollow = async () => {
    try {
      setLoading(true);
      await followUser(provider.id.toString(), auth.token);
      setIsFollowing(true);
    } catch (error) {
      console.error("Follow error:", error);
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
        <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center overflow-hidden rounded-full">
          <img
            src={placeholderUserImg}
            className="w-full h-full object-cover"
            alt="User"
          />
        </div>
        <div className="mt-8 text-center">
          <h5 className="text-2xl font-medium tracking-tight mb-2">
            {provider.fullName}
          </h5>
          <p className="mb-2">
            <span>Photographer</span>
            <span className="inline-block ml-2">
              <FeatherIcon className="inline" size={18} icon="map-pin" /> Ikeja,
              Lagos
            </span>
          </p>
          <div className="mb-2">
            <Rate style={{ fontSize: "16px" }} allowHalf disabled value={4.5} />{" "}
            4.5 Overall Rating
          </div>
          <p>23 Satisfied Clients</p>
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

export const JobCard: React.FC = () => {
  return (
    <div className="card-shadow rounded-[10px] p-5 py-6 sm:p-6 w-full">
      <div className="flex">
        <div className="max-w-max">
          <h6 className="font-medium tracking-tight">Posted By Ezra Fitz</h6>
          <p className="text-[13px] text-gray-600">
            23mins ago, Plumbing and Pipeworks
          </p>
        </div>
        <div className="flex-1"></div>
        <div className="max-w-max">
          <p className="text-royalblue-main font-medium cursor-pointer tracking-tight">
            {" "}
            <MapPin className="inline" size={16} /> Somewhere in Lagos
          </p>
        </div>
      </div>
      <div className="my-3 border-t border-gray-200" />
      <div>
        <p>I need a plumber to fix a leaking pipe in my kitchen.</p>
      </div>
      <div className="mt-6 flex gap-2 text-[14px] bg-gray-100 px-4 py-[8px] rounded">
        <div className="w-max">
          <Eye size={16} className="inline" /> 203
        </div>
        <div className="w-max pl-2 font-medium tracking-tight cursor-pointer">
          25 Offer Sent
        </div>
        <div className="flex-1"></div>
        <div className="w-max text-royalblue-main font-medium tracking-tight cursor-pointer">
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
