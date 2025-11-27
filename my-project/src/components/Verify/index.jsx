import React, { useState, useEffect, useContext } from "react";
import OtpBox from "../OtpBox";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [isSending, setIsSending] = useState(true);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // 60s countdown for resend
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Countdown
  useEffect(() => {
    if (timer <= 0) return; // ✅ Không tạo interval nếu timer hết

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // ✅ clear mỗi lần unmount
  }, [timer]);

  // Format mm:ss display
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // Verify OTP
  const verifyOTP = (e) => {
    e.preventDefault();
    const actionType = localStorage.getItem("actionType");
    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email: localStorage.getItem("userEmail"),
        otp,
      }).then((res) => {
        if (res?.error === true) {
          context.openAlertBox("error", res?.message);
        } else {
          context.openAlertBox("success", "Email verified successfully!");

          // ✅ Chờ alert chạy rồi chuyển hướng
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email: localStorage.getItem("userEmail"),
        otp,
      }).then((res) => {
        if (res?.error === true) {
          context.openAlertBox("error", res?.message);
        } else {
          context.openAlertBox("success", "Email verified successfully!");

          // ✅ Chờ alert chạy rồi chuyển hướng
          setTimeout(() => {
            const email = localStorage.getItem("userEmail");
            if (email) localStorage.setItem("userEmail", email);
            localStorage.removeItem("actionType");
            navigate("/forgot-password");
          }, 1500);
        }
      });
    }
  };

  // Resend OTP
  const resendOtp = () => {
    setTimer(60);
    postData("/api/user/resend-otp", {
      email: localStorage.getItem("userEmail"),
    }).then((res) => {
      if (res?.error === true) {
        context.openAlertBox("error", res?.message);
      } else {
        context.openAlertBox("success", "New OTP sent to your email!");
      }
    });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto bg-white p-5 px-12">
          <div className="text-center flex justify-center">
            <img src="/verify1.png" alt="" width="80" />
          </div>

          <h3 className="text-center text-[18px] font-semibold mt-4">
            Verify OTP
          </h3>

          <p className="text-center text-[16px] mb-3">
            OTP sent to{" "}
            <span className="text-[#eb8600] font-[600]">
              {localStorage.getItem("userEmail")}
            </span>
          </p>

          <form onSubmit={verifyOTP}>
            <OtpBox length={6} onChange={setOtp} />

            <div className="flex gap-3 mt-5">
              <Button type="submit" className="btn-org btn-lg w-full">
                Verify OTP
              </Button>
            </div>
          </form>

          <div className="text-center mt-5 text-[14px] text-gray-600">
            {timer > 0 ? (
              <>
                Didn’t receive the code? <br />
                <span className="font-semibold text-[#eb8600]">
                  {timer}s
                </span>{" "}
                left to resend.
              </>
            ) : (
              <Button
                className="text-[#eb8600] font-semibold underline hover:text-orange-500"
                onClick={resendOtp}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;
