import React, { useState } from "react";
import { Input } from "../../components/input";
import { MapPin, Image, X } from "feather-icons-react";
import { getImagePreview } from "../util/getImagePreview";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { createShowcase } from "../../api-services/showcase.service";

const PostShowcase = (): React.ReactNode => {
  // utilities
  const { setLoading, setLoadingText } = useLoading();
  const auth = useAuth();
  const notify = useNotificationContext();
  const navigate = useNavigate();

  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  console.log({ files });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files); // convert FileList to File[]
      setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setLoadingText("Uploading your showcase...");

      // Create FormData and append payload values
      const formData = new FormData();

      // Append each file under the same field name "attachment"
      files.forEach((file) => {
        formData.append("attachment", file);
      });

      formData.append("post", experience);
      formData.append("location", location);

      const response = await createShowcase(formData, auth.token);
      console.log({ response });

      notify.openNotification(
        "topRight",
        "Success",
        "Successfully Uploaded Showcase",
        "success",
      );
    } catch (error) {
      console.error("Error uploading showcase:", error);
      notify.openNotification(
        "topRight",
        "Error",
        "Failed to upload showcase. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <section className="min-h-screen pt-13 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mt-15">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl mb-2">
            Post a Showcase
          </h1>
          <p className="text-gray-600">
            Share an update from your past or ongoing work so people can follow
            and see your works. Let’s build your brand here together.
          </p>
        </div>

        <div className="my-8 border-t border-gray-200" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Experience Field */}
          <div className="mb-4">
            <label className="text-gray-700 block mb-1">
              Share the experience
            </label>
            <textarea
              placeholder="Write something about your work"
              value={experience}
              required
              onChange={(e) => setExperience(e.target.value)}
              className="px-4 py-2 w-full border border-gray-200 rounded-md resize-none focus:outline-none focus:border-gray-300"
              rows={4}
            />
          </div>

          {/* Location Input */}
          <div className="mb-9 relative">
            <label className="text-gray-700 block mb-1">
              Location (optional)
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
            <div className="hidden w-max absolute top-[40px] right-4">
              <button className="w-max font-medium cursor-pointer text-gray-600 hover:text-black">
                <span>Add Location </span>
                <MapPin className="inline ml-1" size={16} />
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div className="mb-5">
            <label className="text-gray-700 block mb-1">
              Add Image / Video
            </label>
            <div className="border border-dashed border-gray-300 rounded bg-white p-4 text-center">
              <label className="cursor-pointer w-full text-gray-600 hover:text-black inline-block">
                <div className="flex max-w-full border border-gray-100 rounded py-2 flex-col items-center justify-center gap-1">
                  <Image size={20} />
                  <span>
                    {files.length > 0 ? "Add More Files" : "Click to upload"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  name="images"
                  required
                  multiple
                  className=""
                  style={{ opacity: 0 }}
                  onChange={handleFileChange}
                />
              </label>
              {files.length > 0 && (
                <div className="mt-3 text-sm text-gray-500 flex justify-center flex-wrap gap-3 gap-x-4">
                  {files.map((file, idx) => {
                    const previewUrl = getImagePreview(file);
                    const isVideo = file.type.startsWith("video/");
                    return (
                      <div key={idx} className="relative z-10">
                        <span
                          onClick={() => removeFile(idx)}
                          className="px-[7px] py-[5px] absolute cursor-pointer z-10 right-[-10px] top-[-10px] bg-white border border-red-200 text-red-500 rounded-full p-1 hover:bg-red-50 transition"
                        >
                          <X className="inline w-4 h-4" />
                        </span>
                        <div className="max-w-[150px] relative border border-gray-200 aspect-[5/3] overflow-hidden rounded bg-black">
                          {isVideo ? (
                            <video
                              src={previewUrl}
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                            />
                          ) : (
                            <img
                              src={previewUrl}
                              className="w-full h-full object-cover"
                              alt={`preview-${idx}`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Post Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="border rounded bg-royalblue-shade2 text-white w-full h-13 cursor-pointer"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PostShowcase;
