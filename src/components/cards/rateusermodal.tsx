import React, { useState } from "react";
import { Modal, Rate, Input, Button } from "antd";
interface RateUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
}
const RateUserModal: React.FC<RateUserModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialRating = 0,
  initialComment = "",
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(rating, comment);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      bodyStyle={{
        padding: "1.5rem",
      }}
      title={<span className="text-lg font-semibold">Rate this User</span>}
    >
      <div className="flex flex-col gap-4">
        {}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Your Rating
          </label>
          <Rate value={rating} onChange={setRating} />
        </div>

        {}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Your Review
          </label>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience..."
            className="rounded-md"
          />
        </div>

        {}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={rating === 0 || comment.trim() === ""}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RateUserModal;
