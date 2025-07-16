import "./cards.css";
import { Rate } from "antd";

import placeholderUserImg from "../../assets/images/pro-sample-img.png";
import FeatherIcon from "feather-icons-react";

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

export const ProviderCard: React.FC = () => {
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
        {/* Image Container */}
        <div className="w-[150px] h-[150px] mx-auto flex items-center justify-center overflow-hidden rounded-full">
          <img
            src={placeholderUserImg}
            className="w-full h-full object-cover"
            alt="User"
          />
        </div>
        <div className="mt-8 text-center">
          <h5 className="text-2xl font-medium tracking-tight mb-2">Idrissa Gueye</h5>
          <p  className="mb-2">
            <span>Photographer</span>
            <span className="inline-block ml-2">
              <FeatherIcon className="inline" size={18} icon="map-pin" /> Ikeja,
              Lagos
            </span>
          </p>
          <p className="mb-2">
            <Rate style={{ fontSize: "16px" }} allowHalf disabled value={4.5} />{" "}
            4.5 Overall Rating
          </p>
          <p className="">23 Satisfied Clients</p>
        </div>
      </div>
      {/* Card Buttons */}
      <div className="flex gap-x-3 mt-10">
        <div className="flex-1">
          <button className="py-4 w-full rounded bg-royalblue-main text-white cursor-pointer">
            Chat{" "}
            <FeatherIcon className="inline" size={18} icon="message-square" />
          </button>
        </div>
        <div className="flex-1">
          <button className="py-4 w-full border border-royalblue-main rounded text-royalblue-shade3 cursor-pointer">
            View Profile{" "}
            <FeatherIcon className="inline" size={18} icon="arrow-up-right" />
          </button>
        </div>
      </div>
    </div>
  );
};
