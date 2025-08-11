import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message, Select } from "antd";
import { EnvironmentOutlined, ReloadOutlined } from "@ant-design/icons";
import { State, City } from "country-state-city";
import mapboxgl from "mapbox-gl";
import MapView from "./map";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useUserGeoLocation } from "../../contexts/LocationContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9sYXAyMjIzIiwiYSI6ImNtZDdtdjVnbjBnb2IybHFzY3FzbDZxNWsifQ.7j9U6NZY86YV4oIxdLwb3Q";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (locationData: LocationData) => void;
}

export interface LocationData {
  country: string;
  state: string;
  lga: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

const LocationInput: React.FC<Props> = ({ open, onClose, onApply }) => {
  const { openNotification } = useNotificationContext();
  const defaultCountryCode = "NG";
  const states = State.getStatesOfCountry(defaultCountryCode);

  // plug it into this place
  const userGeoLocation = useUserGeoLocation();
  console.log({ userGeoLocation: userGeoLocation.getLocationData() });

  const [locationForm, setLocationForm] = useState({
    country: "Nigeria",
    state: "",
    lga: "",
    address: "",
  });

  const validateForm = (): boolean => {
    if (!locationForm.state.trim()) {
      openNotification("topRight", "State is required", "", "error");
      return false;
    }

    if (!locationForm.lga.trim()) {
      openNotification("topRight", "LGA is required", "", "error");
      return false;
    }

    if (!locationForm.address.trim()) {
      openNotification("topRight", "Address is required", "", "error");
      return false;
    }

    if (!location) {
      openNotification(
        "topRight",
        "Location coordinates are missing",
        "",
        "error",
      );
      return false;
    }

    return true;
  };
  const [cities, setCities] = useState<any[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  console.log({ locationLoading: loading });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");

  const handleChange = (field: string, value: string) => {
    setLocationForm((prev) => ({ ...prev, [field]: value }));
    if (field === "state") {
      const newCities = City.getCitiesOfState(defaultCountryCode, value);
      setCities(newCities);
      setLocationForm((prev) => ({ ...prev, lga: "" }));
    }
  };

  const handleApply = () => {
    if (activeTab === "manual") {
      if (!validateForm()) return;

      const finalData = {
        ...locationForm,
        coordinates: { lng: -1, lat: -1 },
      };

      userGeoLocation.clearLocationData(); // Clear any previously saved auto location
      userGeoLocation.saveLocationData(finalData);
      onApply(finalData);
      return;
    }

    if (!location && activeTab === "auto") {
      openNotification(
        "topRight",
        "Click the box to auto detect your location.",
        "",
        "error",
      );
      return;
    }

    if (location && activeTab === "auto") {
      const finalData = {
        ...locationForm,
        coordinates: location.coordinates,
      };

      userGeoLocation.saveLocationData(finalData); // Save detected location
      onApply(finalData);
    }
  };

  // add use effect to prefill the form if there is a cached location / form data

  const fetchLocation = () => {
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`,
          );
          const data = await res.json();
          const place = data?.features?.[0];

          if (!place) throw new Error("Location not found.");

          const context = place.context || [];
          const getContext = (id: string) =>
            context.find((c: any) => c.id.includes(id))?.text || "";

          const locationData: LocationData = {
            country: getContext("country"),
            state: getContext("region"),
            lga: getContext("district") || getContext("place"),
            address: place.place_name,
            coordinates: {
              lat: latitude,
              lng: longitude,
            },
          };

          setLocationForm({
            country: locationData.country,
            state: locationData.state,
            lga: locationData.lga,
            address: locationData.address,
          });

          setLocation(locationData);
          message.success("Location retrieved successfully.");
        } catch (err) {
          console.error(err);
          setError("Failed to retrieve location.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const errorMessage = `Code: ${err.code}, Message: ${err.message}`;
        setError(errorMessage || "Permission denied or location unavailable.");
        setLoading(false);
      },
    );
  };
  useEffect(() => {
    if (open) {
      const savedLocation = userGeoLocation.getLocationData();

      if (savedLocation) {
        setLocationForm({
          country: savedLocation.country || "Nigeria",
          state: savedLocation.state || "",
          lga: savedLocation.lga || "",
          address: savedLocation.address || "",
        });

        if (
          savedLocation.coordinates.lat !== -1 &&
          savedLocation.coordinates.lng !== -1
        ) {
          setLocation(savedLocation);
        }

        // Prefill cities based on state
        const citiesInState = City.getCitiesOfState(
          defaultCountryCode,
          savedLocation.state,
        );
        setCities(citiesInState);
      }
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700} // use Tailwind breakpoints via className or rely on default responsiveness
      className="max-w-full sm:max-w-[700px] w-[95%]"
    >
      <div>
        <h1 className="text-center font-semibold my-3 tracking-tight text-[18px]">
          Select Your Location
        </h1>
      </div>

      {/* Tab Switch */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden text-sm font-medium">
          <button
            className={`px-4 py-2 transition ${
              activeTab === "manual"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("manual")}
          >
            Manual Address
          </button>
          <button
            className={`px-4 py-2 transition ${
              activeTab === "auto"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("auto")}
          >
            Use My Location
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        {activeTab === "manual" ? (
          <div className="flex-1 space-y-4">
            <div>
              <label className="block font-medium mb-1">Country</label>
              <Input value={locationForm.country} disabled className="!h-11" />
            </div>

            <div>
              <label className="block font-medium mb-1">State</label>
              <Select
                className="w-full !h-11"
                placeholder="Select a state"
                value={locationForm.state}
                onChange={(value) => handleChange("state", value)}
              >
                {states.map((state) => (
                  <Option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block font-medium mb-1">LGA</label>
              <Select
                className="w-full !h-11"
                placeholder="Select an LGA"
                value={locationForm.lga}
                onChange={(value) => handleChange("lga", value)}
                disabled={!cities.length}
              >
                {cities.map((city) => (
                  <Option key={city.name} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block font-medium mb-1">Address</label>
              <Input.TextArea
                rows={2}
                placeholder="Type your address or use the location button"
                value={locationForm.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex-col items-center">
            {!location ? (
              <div
                onClick={fetchLocation}
                className="w-full h-[150px] border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center flex-col text-center text-sm text-blue-600 cursor-pointer hover:bg-blue-50"
              >
                <EnvironmentOutlined className="text-2xl mb-1" />
                Use my location
              </div>
            ) : (
              <div className="w-full h-[250px] rounded-2xl bg-gray-100">
                <MapView
                  long={location.coordinates.lng}
                  lat={location.coordinates.lat}
                  className="rounded-2xl shadow-sm h-[250px] w-full"
                />
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm mt-3 text-center">
                {error}
                <Button
                  size="small"
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={fetchLocation}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* LOCATION DETAILS */}
            {location && (
              <div className="mt-6 space-y-2">
                <p>
                  <strong>Full Address:</strong> {locationForm.address}
                </p>
                <p>
                  <strong>Coordinates:</strong> {location.coordinates.lat},{" "}
                  {location.coordinates.lng}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-10">
        <Button type="primary" className="w-full !h-11" onClick={handleApply}>
          Apply Location
        </Button>
      </div>
    </Modal>
  );
};

export default LocationInput;
