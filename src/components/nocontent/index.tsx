import React from "react";
import { Empty, Result, Button, Spin } from "antd";

interface ContentHOCProps {
  loading: boolean;
  error: boolean;
  errorBtnText?: string;
  errMessage?: string;
  noContent: boolean;
  noContentMessage?: string;
  noContentBtnText?: string;
  actionFn?: () => void;
  UIComponent: React.ReactNode;
  loadingText?: string | React.JSX.Element;
}

interface NoContentPropType {
  message?: string;
  onAction?: () => void;
  actionText?: string;
}

interface ReqErrProps {
  errorMessage?: string;
  actionText?: string;
  onAction?: () => void;
}

export const NoContent: React.FC<NoContentPropType> = ({
  message = "No content available",
  onAction,
  actionText = "Refresh",
}) => (
  <Empty description={message} image={Empty.PRESENTED_IMAGE_SIMPLE}>
    {onAction && (
      <Button type="primary" onClick={onAction}>
        {actionText}
      </Button>
    )}
  </Empty>
);

export const ReqErr: React.FC<ReqErrProps> = ({
  errorMessage = "Something went wrong",
  actionText = "Retry",
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Result
      status="error"
      title="Request Failed"
      subTitle={errorMessage}
      extra={
        onAction && (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        )
      }
    />
  </div>
);

export const ContentHOC: React.FC<ContentHOCProps> = ({
  loading,
  error,
  errorBtnText = "Retry",
  errMessage = "Something went wrong while fetching content.",
  noContent,
  noContentMessage = "No content found.",
  noContentBtnText = "Refresh",
  actionFn,
  UIComponent,
  loadingText,
}) => {
  if (loading) {
    return (
      <div className="text-center min-h-screen flex flex-col item-center justify-center">
        <div>
          <Spin size="small" />
          <p className="mt-4 text-gray-700">
            {loadingText || "Loading Content"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ReqErr
        errorMessage={errMessage}
        actionText={errorBtnText}
        onAction={actionFn}
      />
    );
  }

  if (noContent) {
    return (
      <NoContent
        message={noContentMessage}
        actionText={noContentBtnText}
        onAction={actionFn}
      />
    );
  }

  return <>{UIComponent}</>;
};
