import React from "react";
const BaseLayout = (): React.ReactNode => {
  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div>Page Name</div>
      </div>
    </section>
  );
};

export default BaseLayout;

export const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("submitting form", { formdata: undefined });
};
