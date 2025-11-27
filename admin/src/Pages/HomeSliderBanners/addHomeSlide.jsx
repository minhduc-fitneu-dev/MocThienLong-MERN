import React, { useContext, useState } from "react";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const AddHomeSlide = () => {
  const context = useContext(MyContext);

  // Lưu ảnh upload từ UploadBox
  const [image, setImage] = useState([]); // [{url, public_id}]

  // Xóa ảnh preview
  const removeImage = () => {
    setImage([]);
  };

  // Gửi API tạo slide
  const handlePublish = async () => {
    if (!image[0]) {
      return context.alertBox("error", "Please upload a slide image!");
    }

    const body = {
      image: image[0], // Slider chỉ có 1 ảnh duy nhất
      title: "",
      subtitle: "",
      redirectUrl: "",
      sortOrder: 0,
      isActive: true,
    };

    const res = await postData("/api/homeslider/create", body);

    if (res?.success) {
      context.alertBox("success", "Slide created successfully!");

      // Reset form
      setImage([]);
      // 🔥 TRIGGER reload list
      context.reloadProducts();

      // Đóng fullscreen panel
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Failed to create slide");
    }
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8">
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-7 gap-3">
            {/* ========== PREVIEW ========== */}
            {image[0] && (
              <div className="uploadBoxWrapper relative">
                <span
                  className="absolute w-[20px] h-[20px] rounded-full bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center cursor-pointer z-50"
                  onClick={removeImage}
                >
                  <IoMdClose className="text-white text-[15px]" />
                </span>

                <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed h-[150px] w-full bg-gray-100">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    alt="image"
                    effect="blur"
                    src={image[0].url}
                  />
                </div>
              </div>
            )}

            {/* ========== UPLOAD BOX ========== */}
            {!image[0] && (
              <UploadBox
                url="/api/homeslider/uploadImages"
                multiple={false}
                setPreviewsFun={setImage}
              />
            )}
          </div>
        </div>

        <br />

        <div className="w-[250px]">
          <Button
            type="button"
            className="btn-blue btn-lg w-full flex gap-2"
            onClick={handlePublish}
          >
            <FaCloudUploadAlt className="text-[25px] text-white" />
            Publish Slide
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddHomeSlide;
