import React from "react";

import RenderConversations from "./renderconversations";
import RenderChats from "./renderchats";

const Conversations = (): React.ReactNode => {

  return (
    <section className="!h-screen">
      <div className="max-w-[1280px] pt-13 mx-auto">
        {/* Page Starts*/}
        <div className="w-full flex">
          {/* Conversations List */}
          <RenderConversations />

          {/* Chat Area */}
          <RenderChats />
        </div>
      </div>
    </section>
  );
};

export default Conversations;
