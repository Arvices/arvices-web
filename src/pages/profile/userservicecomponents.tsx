import { Edit3, Trash2 } from "lucide-react";
interface Service {
  id: string;
  title: string;
  price: string;
  duration: number;
  timeUnit: string;
  description: string;
}
interface ServiceDetailCardProps {
  service: Service;
  index: number;
  setServiceEditIndex: (index: number) => void;
  setServiceEdit: (service: any) => void;
  handleDeleteService: (id: string) => void;
}
export function ServiceDetailCard({
  service,
  index,
  setServiceEditIndex,
  setServiceEdit,
  handleDeleteService,
}: ServiceDetailCardProps) {
  return (
    <div
      key={service.id || index}
      className="p-6 rounded-lg bg-white relative shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col"
    >
      {}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          className="p-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-150"
          onClick={() => {
            setServiceEditIndex(index);
            setServiceEdit(service);
          }}
          aria-label="Edit service"
        >
          <Edit3 size={16} />
        </button>
        <button
          className="p-2 bg-gray-50 text-red-500 rounded-md hover:bg-gray-100 transition-colors duration-150"
          onClick={() => handleDeleteService(service.id)}
          aria-label="Delete service"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {}
      <div className="pb-4 mb-4 border-b border-gray-100">
        <p className="font-medium uppercase text-gray-500 text-xs mb-1">
          Service Type
        </p>
        <h3 className="text-gray-900 font-bold text-xl leading-snug pr-12 tracking-tight">
          {" "}
          {}
          {service.title}
        </h3>
      </div>

      {}
      <div className="flex flex-col gap-4 mb-6">
        {}
        <div>
          <p className="font-medium text-gray-500 text-[13px]  uppercase mb-1">
            Rate & Duration
          </p>
          <p className="text-gray-900 font-semibold text-lg leading-tight">
            NGN {service.price} / {service.duration} {service.timeUnit}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Cost per single cycle of service.
          </p>
        </div>
      </div>

      {}
      <div className="pt-6 border-t border-gray-100 flex-grow">
        {" "}
        {}
        <p className="font-medium uppercase text-gray-500 text-[13px] mb-1">
          Service Description
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}
export default ServiceDetailCard;
