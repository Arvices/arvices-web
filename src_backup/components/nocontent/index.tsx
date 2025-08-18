import React from "react";
import { Result, Button, Spin } from "antd";
import { Inbox } from "feather-icons-react";

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
  minHScreen?: boolean;
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
  <div className="w-full border border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center px-6 py-10">
    <span className="inline-block w-full text-center">
      <span className="mx-auto mb-5 bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center">
        <Inbox className="inline w-10 h-20 text-gray-500" />
      </span>
    </span>
    <p className="text-sm text-gray-500 mb-4">{message}</p>
    {onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {actionText}
      </button>
    )}
  </div>
);

export const ReqErr: React.FC<ReqErrProps> = ({
  errorMessage = "Something went wrong",
  actionText = "Retry",
  onAction,
}) => (
  <div className="w-full border border-gray-300 rounded-2xl  flex flex-col items-center justify-center md:py-10 ">
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

interface LoaderProps {
  minHScreen?: boolean;
  loadingText?: string | React.JSX.Element;
}

export const Loader: React.FC<LoaderProps> = ({ minHScreen, loadingText }) => {
  return (
    <div
      className={`w-full border border-gray-300 rounded-2xl text-center ${
        minHScreen ? "min-h-screen" : "py-20"
      } flex flex-col items-center justify-center`}
    >
      <div>
        <Spin size="small" />
        <p className="mt-4 text-gray-700">{loadingText || "Loading Content"}</p>
      </div>
    </div>
  );
};

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
  minHScreen = true,
  loadingText,
}) => {
  if (loading) {
    return <Loader minHScreen={minHScreen} loadingText={loadingText} />;
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
