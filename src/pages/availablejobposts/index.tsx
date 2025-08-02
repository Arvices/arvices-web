import React, { useEffect, useState } from "react";
import { FilterComponent } from "../providers/Filter";
import { CategoryCarousel } from "../providers/CategoryCarousel";
import { categoryData } from "../home";
import { Job, JobCard } from "../../components/cards/appcards";
import { getAllServiceRequests } from "../../api-services/servicerequests.service";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { Pagination } from "../../components/pagination";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { UserAccount } from "../../api-services/auth";
// remove or adjust as needed

const sampleJobs: Job[] = [
  {
    id: 1,
    address: "23 Allen Avenue, Ikeja, Lagos",
    category: {
      id: 1,
      name: "Plumbing",
      description: "Fix leaking pipes, blocked drains, etc.",
      file: null,
      createdDate: "2025-07-01T09:30:00Z",
    },
    createdDate: "2025-07-28T12:00:00Z",
    description:
      "Water is leaking from the bathroom wall. Need urgent assistance.",
    images: [],
    offer: [],
    position: null,
    status: "open",
    type: "one-time",
  },
  {
    id: 2,
    address: "7 Ojuelegba Road, Surulere, Lagos",
    category: {
      id: 2,
      name: "Electrical",
      description: "Fix faulty wiring, sockets, lighting, etc.",
      file: null,
      createdDate: "2025-07-02T10:00:00Z",
    },
    createdDate: "2025-07-29T14:30:00Z",
    description: "Office lights trip whenever turned on. Need troubleshooting.",
    images: ["https://example.com/image1.jpg"],
    offer: [],
    position: null,
    status: "open",
    type: "one-time",
  },
  {
    id: 3,
    address: "Plot 5 Lekki Phase 1, Lagos",
    category: {
      id: 3,
      name: "Cleaning",
      description: "General house or office cleaning services.",
      file: null,
      createdDate: "2025-07-03T15:00:00Z",
    },
    createdDate: "2025-07-25T10:00:00Z",
    description: "End of tenancy cleaning for a 3-bedroom apartment.",
    images: [],
    offer: [],
    position: null,
    status: "open",
    type: "scheduled",
  },
  {
    id: 4,
    address: "12 Tafawa Balewa Crescent, VI, Lagos",
    category: {
      id: 4,
      name: "Painting",
      description: "Interior and exterior painting services.",
      file: null,
      createdDate: "2025-07-04T08:00:00Z",
    },
    createdDate: "2025-07-27T16:00:00Z",
    description: "Need living room repainted before Sunday.",
    images: ["https://example.com/image2.jpg"],
    offer: [],
    position: null,
    status: "pending",
    type: "one-time",
  },
  {
    id: 5,
    address: "35 Herbert Macaulay Way, Yaba, Lagos",
    category: {
      id: 5,
      name: "AC Repair",
      description: "Fix or service air conditioning units.",
      file: null,
      createdDate: "2025-07-05T11:00:00Z",
    },
    createdDate: "2025-07-26T11:00:00Z",
    description: "AC not cooling properly. May need re-gassing.",
    images: [],
    offer: [],
    position: null,
    status: "open",
    type: "emergency",
  },
  {
    id: 6,
    address: "101 Gwarinpa Estate, Abuja",
    category: {
      id: 1,
      name: "Plumbing",
      description: null,
      file: null,
      createdDate: "2025-07-01T09:30:00Z",
    },
    createdDate: "2025-07-30T08:30:00Z",
    description: "Low water pressure across the building.",
    images: [],
    offer: [],
    position: null,
    status: "closed",
    type: "recurring",
  },
  {
    id: 7,
    address: "14 Sabo Market Road, Lagos",
    category: {
      id: 2,
      name: "Electrical",
      description: null,
      file: null,
      createdDate: "2025-07-02T10:00:00Z",
    },
    createdDate: "2025-07-28T13:15:00Z",
    description: "Installation of 3 new ceiling fans.",
    images: ["https://example.com/image3.jpg"],
    offer: [],
    position: null,
    status: "open",
    type: "one-time",
  },
  {
    id: 8,
    address: "25 Gimbiya Street, Area 11, Abuja",
    category: {
      id: 6,
      name: "Carpentry",
      description: "Furniture building, repair, shelves etc.",
      file: null,
      createdDate: "2025-07-06T10:20:00Z",
    },
    createdDate: "2025-07-28T17:45:00Z",
    description: "Need new kitchen cabinets installed.",
    images: [],
    offer: [],
    position: null,
    status: "open",
    type: "scheduled",
  },
  {
    id: 9,
    address: "33 Ikorodu Road, Lagos",
    category: {
      id: 7,
      name: "Generator Repair",
      description: "Small to mid-size generator repair services.",
      file: null,
      createdDate: "2025-07-07T09:45:00Z",
    },
    createdDate: "2025-07-29T09:15:00Z",
    description: "2.5kVA generator won’t start. Suspect carburetor issue.",
    images: [],
    offer: [],
    position: null,
    status: "open",
    type: "emergency",
  },
  {
    id: 10,
    address: "88 Oba Akran Avenue, Ikeja, Lagos",
    category: {
      id: 8,
      name: "IT Support",
      description: "Network setup, printer issues, basic IT help.",
      file: null,
      createdDate: "2025-07-08T14:10:00Z",
    },
    createdDate: "2025-07-30T13:10:00Z",
    description: "Printer not connecting over network. Need help configuring.",
    images: [],
    offer: [],
    position: null,
    status: "pending",
    type: "one-time",
  },
];

const AvailableJobPostings = (): React.ReactNode => {
  const auth = useAuth();

  const [openFromRight, setOpenFromRight] = useState(false);
  const [openFromBottom, setOpenFromBottom] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { openNotification } = useNotificationContext();
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    location: "", // assuming location maps to "user" or another query param
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<any[]>([]); // Replace `any` with your actual type if available

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const loadServiceRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllServiceRequests({
        token: auth.token,
        page: currentPage,
        limit: 10,
        search: filters.searchTerm || undefined,
        category: filters.category ? Number(filters.category) : undefined,
        user: filters.location ? Number(filters.location) : undefined, // adjust if needed
      });

      if (response?.data?.response?.length === 0) {
        openNotification("topRight", "No More Content To Show", "", "info");
        return;
      }
      setJobPostings(response?.data?.response || []);
      console.log({ response });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load service requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadServiceRequest();
    }
    // include currentPage and filters in the dependencies
  }, [auth.token, currentPage, filters]);
  return (
    <section className="min-h-screen pt-13  text-royalblue-shade5 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div className="mt-5">
          <FilterComponent onChange={handleFilterChange} filters={filters} />
        </div>
        <div className="mt-13">
          <h3 className="text-royalblue-shade5 text-2xl font-medium tracking-tight md:text-3xl mb-4">
            Job Categories
          </h3>
          <CategoryCarousel categoryData={categoryData} />
        </div>

        <div className="mt-13">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl mb-2">
            Available Job Posting
          </h3>
          <p className="text-[16px] md:text-[18px] tracking-tight font-medium">
            All Categories
          </p>

          <div className="pt-8">
            {
              <ContentHOC
                loading={loading}
                error={!!error}
                errMessage={error || ""}
                actionFn={loadServiceRequest}
                noContent={jobPostings.length === 0}
                minHScreen={false}
                UIComponent={
                  <div className="flex flex-wrap gap-5">
                    {jobPostings.map((job, index) => {
                      return (
                        <div
                          key={index}
                          className="max-w-[400px] min-w-[300px] flex-1"
                        >
                          <JobCard job={job} />
                        </div>
                      );
                    })}
                  </div>
                }
              />
            }
          </div>
          <div className="w-max mx-auto mt-20">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={(pageNo) => {
                setCurrentPage(pageNo);
                console.log("new Page is", pageNo);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailableJobPostings;
