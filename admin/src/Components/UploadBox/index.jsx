import React, { useContext, useState } from "react";
import { FaRegImages } from "react-icons/fa";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const UploadBox = (props) => {
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);

  const onChangeFile = async (e) => {
    try {
      setUploading(true);

      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      // ✅ Validate định dạng file
      for (let file of files) {
        if (
          !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            file.type
          )
        ) {
          setUploading(false);
          return context.alertBox("error", "Invalid image format!");
        }
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await axios.post(
        import.meta.env.VITE_API_URL + props.url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setUploading(false);

      if (res?.data?.images && props?.setPreviewsFun) {
        // ✅ Cập nhật preview + formFields ở component cha
        props.setPreviewsFun(res.data.images); // now is [{url, public_id}, ...]
      }
    } catch (error) {
      setUploading(false);
      context.alertBox("error", "Upload failed!");
    }
  };

  return (
    <div className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[170px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
      {uploading ? (
        <CircularProgress />
      ) : (
        <>
          <FaRegImages className="text-[40px] opacity-35 pointer-events-none" />
          <h4 className="text-[14px] pointer-events-none">Image Upload</h4>

          <input
            type="file"
            accept="image/*"
            multiple={props.multiple ? true : false}
            className="absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer"
            onChange={onChangeFile}
            name={props.name}
          />
        </>
      )}
    </div>
  );
};

export default UploadBox;
