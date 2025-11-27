import React, { useEffect } from "react";

const FacebookChat = () => {
  const pageId = "107833305641886"; // PAGE ID MỘC THIÊN LONG

  useEffect(() => {
    if (!document.getElementById("fb-root")) {
      const fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }

    if (!document.getElementById("fb-customer-chat")) {
      const chatbox = document.createElement("div");
      chatbox.id = "fb-customer-chat";
      chatbox.className = "fb-customerchat";
      document.body.appendChild(chatbox);
    }

    const chatbox = document.getElementById("fb-customer-chat");
    chatbox.setAttribute("page_id", pageId);
    chatbox.setAttribute("attribution", "biz_inbox");

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
    document.body.appendChild(script);

    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    };
  }, []);

  return null;
};

export default FacebookChat;
