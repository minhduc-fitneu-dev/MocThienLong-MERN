import React, { useContext, useEffect, useState } from "react";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteImages, editData } from "../../utils/api";

const EditCategory = () => {
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const [formFields, setFormFields] = useState({
    name: "",
    images: [], // [{url, public_id}]
  });

  const id = context?.isOpenFullScreenPanel?.id;

  // ✅ Lấy dữ liệu Category ban đầu
  useEffect(() => {
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      const oldImages = res?.category?.images || [];
      setFormFields({
        name: res?.category?.name || "",
        images: oldImages,
      });
      setPreviews(oldImages);
    });
  }, [id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ UploadBox trả về ảnh mới dạng [{url, public_id}]
  const setPreviewsFun = (imagesArr) => {
    setPreviews(imagesArr);
    setFormFields((prev) => ({
      ...prev,
      images: imagesArr,
    }));
  };

  // ✅ XÓA ẢNH TRÊN CLOUDINARY + UI
  const handleRemoveClick = (imgObj, index) => {
    if (!imgObj?.public_id) return;

    deleteImages("/api/category/deleteImage", { public_id: imgObj.public_id })
      .then(() => {
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setFormFields((prev) => ({
          ...prev,
          images: prev.images.filter(
            (img) => img.public_id !== imgObj.public_id
          ),
        }));
        context.alertBox("success", "Image removed successfully!");
      })
      .catch(() => context.alertBox("error", "Failed to remove image"));
  };

  // ✅ Lưu cập nhật Category
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name.trim()) {
      context.alertBox("error", "Please enter category name");
      setIsLoading(false);
      return;
    }

    if (formFields.images.length === 0) {
      context.alertBox("error", "Please select at least one image");
      setIsLoading(false);
      return;
    }

    // Gửi trực tiếp dạng object, không stringify
    editData(`/api/category/${id}`, formFields).then((res) => {
      if (res?.success) {
        if (context.loadCategories) context.loadCategories();
        context.alertBox("success", "Category updated successfully!");

        setTimeout(() => {
          context.setIsOpenFullScreenPanel({ open: false });
        }, 600);
      } else {
        context.alertBox("error", "Failed to update category");
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-1 mb-3">
            <div className="col w-[25%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Category Name
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <br />

          <h3 className="text-[18px] font-[500] mb-1 text-black">
            Category Image
          </h3>

          <div className="grid grid-cols-7 gap-3">
            {previews.map((imgObj, index) => (
              <div className="uploadBoxWrapper relative" key={imgObj.public_id}>
                <button
                  type="button"
                  onClick={() => handleRemoveClick(imgObj, index)}
                  className="absolute -top-[7px] -right-[7px] bg-white text-red-600 border border-red-500 rounded-full w-[22px] h-[22px] flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-md z-[100]"
                >
                  <IoMdClose className="text-[15px]" />
                </button>

                <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100 flex items-center justify-center">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    effect="blur"
                    src={imgObj.url}
                  />
                </div>
              </div>
            ))}

            <UploadBox
              multiple
              name="images"
              url="/api/category/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>

        <br />
        <br />

        <div className="w-[250px]">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" />
                Publish and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditCategory;
