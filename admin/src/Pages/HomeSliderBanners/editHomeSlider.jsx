import React, { useContext, useEffect, useState } from "react";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { editData } from "../../utils/api";

const EditHomeSlide = () => {
  const context = useContext(MyContext);

  // Slide được truyền từ HomeSliderBanners:
  // context.setIsOpenFullScreenPanel({ open: true, model: "Edit Home Slide", data: slide })
  const slide = context?.isOpenFullScreenPanel?.data;

  const [image, setImage] = useState([]); // [{url, public_id}]
  const [oldImage, setOldImage] = useState(null);

  // Khi mở form → load data từ slide cũ
  useEffect(() => {
    if (slide?.image) {
      setImage([slide.image]); // copy ảnh đang có vào preview
      setOldImage(slide.image); // lưu ảnh cũ để check
    }
  }, [slide]);

  // Xóa ảnh preview
  const removeImage = () => {
    setImage([]);
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!image[0]) {
      return context.alertBox("error", "Please upload a slide image!");
    }

    const isNewImage = !oldImage || oldImage?.public_id !== image[0]?.public_id;

    const body = {
      image: image[0],
      replaceImage: isNewImage, // backend hiện chưa dùng cũng không sao
    };

    // 🔥 PHẢI await và hứng res
    const res = await editData(`/api/homeslider/${slide._id}`, body);

    if (res?.success) {
      context.alertBox("success", "Slide updated successfully!");

      // reload list
      context.reloadProducts();

      // đóng panel
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Failed to update slide");
    }
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8">
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-7 gap-3">
            {/* PREVIEW */}
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

            {/* UPLOAD BOX */}
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
            onClick={handleUpdate}
          >
            <FaCloudUploadAlt className="text-[25px] text-white" />
            Update Slide
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditHomeSlide;
