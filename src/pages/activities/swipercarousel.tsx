import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper.css";

interface Attachment {
  id: number;
  name: string;
  url: string;
  createdDate: string;
}

interface Props {
  attachments: Attachment[];
}

export default function AttachmentCarousel({ attachments }: Props) {
  if (!attachments || attachments.length === 0) return null;

  const isVideo = (url: string) => url.match(/\.(mp4|mov|avi|mkv|webm)$/i);

  return (
    <div className="flex items-center justify-center bg-blue-50 min-h-[250px] max-h-[400px] w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        className="rounded-lg w-full"
      >
        {attachments.map((att) => {
          return (
            <SwiperSlide key={att.id}>
              <div className="h-[400px] w-full">
                {isVideo(att.url) ? (
                  <video
                    src={att.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
