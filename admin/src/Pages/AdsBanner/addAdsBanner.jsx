// Pages/AdsBanner/addAdsBanner.jsx
import React, { useContext, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import UploadBox from "../../Components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdClose } from "react-icons/io";
import { postData } from "../../utils/api";

const AddAdsBanner = () => {
  const context = useContext(MyContext);

  const [image, setImage] = useState([]); // [{url, public_id}]
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    price: "",
    buttonText: "Xem ngay",
    categoryId: "",
    position: "slider",
    sortOrder: 0,
    isActive: true,
  });

  // Flatten category tree để chọn link khi click banner
  const categoryOptions = useMemo(() => {
    const list = [];

    (context.categoryData || []).forEach((cat) => {
      list.push({ id: cat._id, label: cat.name });

      (cat.children || []).forEach((sub) => {
        list.push({
          id: sub._id,
          label: `${cat.name} › ${sub.name}`,
        });

        (sub.children || []).forEach((third) => {
          list.push({
            id: third._id,
            label: `${cat.name} › ${sub.name} › ${third.name}`,
          });
        });
      });
    });

    return list;
  }, [context.categoryData]);

  const handleChangeField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeImage = () => {
    setImage([]);
  };

  const handlePublish = async () => {
    if (!image[0]) {
      return context.alertBox("error", "Please upload banner image!");
    }

    const body = {
      image: image[0],
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      price: form.price.trim(),
      buttonText: form.buttonText.trim() || "Xem ngay",
      categoryId: form.categoryId || null,
      position: form.position || "slider",
      sortOrder: Number(form.sortOrder) || 0,
      isActive: !!form.isActive,
    };

    const res = await postData("/api/ads-banner/create", body);

    if (res?.success) {
      context.alertBox("success", "Ads banner created successfully!");
      setImage([]);
      setForm({
        title: "",
        subtitle: "",
        price: "",
        buttonText: "Xem ngay",
        categoryId: "",
        position: "slider",
        sortOrder: 0,
        isActive: true,
      });

      context.reloadProducts();
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Failed to create banner");
    }
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8 bg-white rounded-lg shadow-sm">
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          {/* ========= IMAGE ========= */}
          <h3 className="font-[700] text-[16px] mb-3 text-gray-800">
            Banner Image
          </h3>

          <div className="grid grid-cols-7 gap-3 mb-6">
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
                    alt="banner"
                    effect="blur"
                    src={image[0].url}
                  />
                </div>
              </div>
            )}

            {!image[0] && (
              <UploadBox
                url="/api/ads-banner/uploadImages"
                multiple={false}
                setPreviewsFun={setImage}
              />
            )}
          </div>

          {/* ========= TEXT FIELDS ========= */}
          <div className="grid grid-cols-2 gap-5 mb-4">
            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Title
              </h4>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChangeField}
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Subtitle
              </h4>
              <input
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChangeField}
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-4">
            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Price / Tagline
              </h4>
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChangeField}
                placeholder="VD: Chỉ từ 499.000₫"
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Button Text
              </h4>
              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChangeField}
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Sort Order
              </h4>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChangeField}
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* ========= POSITION & CATEGORY ========= */}
          <div className="grid grid-cols-3 gap-5 mb-4">
            <div>
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Position
              </h4>
              <Select
                size="small"
                name="position"
                value={form.position}
                onChange={handleChangeField}
                className="w-full"
              >
                <MenuItem value="slider">Slider chính</MenuItem>
                <MenuItem value="side">Banner bên cạnh</MenuItem>
                <MenuItem value="both">Cả Slider & Side</MenuItem>
              </Select>
            </div>

            <div className="col-span-2">
              <h4 className="text-[14px] font-[600] mb-1 text-gray-800">
                Target Category (click banner sẽ chuyển tới)
              </h4>
              <Select
                size="small"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChangeField}
                className="w-full"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categoryOptions.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          {/* ========= ACTIVE ========= */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[14px] font-[600] text-gray-800">Active</span>
            <Switch
              size="small"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
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
            Publish Ads Banner
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddAdsBanner;
