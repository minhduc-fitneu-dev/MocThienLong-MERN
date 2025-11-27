import React, { useState, useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import axios from "axios";
import { useEffect } from "react";

const EditProduct = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    if (!context.editProductData) return;

    const p = context.editProductData;

    setFormFields({
      name: p.name || "",
      description: p.description || "",
      images: p.images || [],
      brand: p.brand || "Mộc Thiên Long",
      catId: p.catId || "",
      subCatId: p.subCatId || "",
      thirdSubCatId: p.thirdSubCatId || "",
      price: p.price || "",
      oldPrice: p.oldPrice || "",
      discount: p.discount || "",
      countInStock: p.countInStock || "",
      sales: p.sales || "",
      rating: p.rating || 0,
      isFeatured: p.isFeatured || false,
      size: p.size || "",
      productWeight: p.productWeight || "",
      material: p.material || "",
      color: p.color || "",
    });

    setProductCat(p.catId || "");
    setProductSubCat(p.subCatId || "");
    // Tự đổ danh sách third-level vào select khi mở Edit
    const parentSub = context.categoryData
      ?.flatMap((c) => c.children || [])
      ?.find((s) => s._id === p.subCatId);

    if (parentSub?.children?.length > 0) {
      setAvailableThirdCats(parentSub.children);
    } else {
      setAvailableThirdCats([]);
    }
  }, [context.editProductData]);

  // ================== STATE ==================
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    brand: "Mộc Thiên Long",
    catId: "",
    subCatId: "",
    thirdSubCatId: "",
    price: "",
    oldPrice: "",
    discount: "",
    countInStock: "",
    sales: "",
    rating: 0,
    isFeatured: false,
    size: "",
    productWeight: "",
    material: "",
    color: "",
  });
  const [availableThirdCats, setAvailableThirdCats] = useState([]); // ✅ new

  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]); // file ảnh
  const [previewUrls, setPreviewUrls] = useState([]); // ảnh preview
  const [isUploading, setIsUploading] = useState(false);
  const handleRemoveImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };
  // ================== HANDLERS ==================
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    setFormFields((prev) => ({ ...prev, catId: value }));
  };

  const handleChangeProductSubCat = (event) => {
    const value = event.target.value;
    setProductSubCat(value);
    setFormFields((prev) => ({ ...prev, subCatId: value }));
  };

  const handleChangeProductThirdLevelCat = (event) => {
    const value = event.target.value;
    setFormFields((prev) => ({ ...prev, thirdSubCatId: value }));
  };

  const handleChangeProductFeatured = (event) => {
    const val = event.target.value === "true";
    setProductFeatured(val);
    setFormFields((prev) => ({ ...prev, isFeatured: val }));
  };

  const handleChangeProductWeight = (event) => {
    const value = event.target.value;
    setProductWeight(value);
    setFormFields((prev) => ({ ...prev, productWeight: value }));
  };

  const handleChangeProductSize = (event) => {
    const value = event.target.value;
    setProductSize(value);
    setFormFields((prev) => ({ ...prev, size: value }));
  };

  // ================== RATING ==================
  const handleChangeRating = (event, newValue) => {
    setFormFields((prev) => ({ ...prev, rating: newValue }));
  };

  // ================== UPLOAD IMAGE ==================
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // cộng dồn file cũ + file mới
    setUploadFiles((prev) => [...prev, ...files]);

    // tạo preview cộng dồn
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleUploadImages = async () => {
    if (!uploadFiles.length) return [];

    setIsUploading(true);
    const formData = new FormData();
    uploadFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/uploadImages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success && Array.isArray(res.data.images)) {
        context.alertBox("success", "Images uploaded successfully!");
        return res.data.images;
      } else {
        context.alertBox("error", "Image upload failed");
        return [];
      }
    } catch (err) {
      console.error("Upload error:", err);
      context.alertBox("error", "Server upload error");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Nếu có ảnh mới → upload
    let newUploadedImages = [];
    if (uploadFiles.length > 0) {
      newUploadedImages = await handleUploadImages();
    }

    // Gộp ảnh cũ + ảnh mới
    const finalImages = [...formFields.images, ...newUploadedImages];

    const payload = {
      ...formFields,
      price: Number(formFields.price),
      oldPrice: Number(formFields.oldPrice),
      discount: Number(formFields.discount),
      countInStock: Number(formFields.countInStock),
      sales: Number(formFields.sales),
      rating: Number(formFields.rating),
      images: finalImages,
    };

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/product/updateProduct/${
        context.editProductId
      }`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setIsUploading(false);

    if (res?.data?.success) {
      context.alertBox("success", "✅ Product updated successfully!");
      context.reloadProducts(); // ⭐ reload danh sách không cần F5
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.data?.message || "Update failed");
    }
  };

  return (
    <section className="p-5 bg-gray-50 min-h-[90vh]">
      <form
        className="form py-3 p-8 bg-white rounded-lg shadow-sm border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4">
          {/* ========= TÊN & MÔ TẢ ========= */}
          <div className="grid grid-cols-1 mb-3">
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Product Name
              </h3>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-3">
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Product Description
              </h3>
              <textarea
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
                className="w-full h-[100px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          {/* ========= DANH MỤC ========= */}
          <div className="grid grid-cols-4 mb-3 gap-4">
            {/* ========== CATEGORY ========== */}
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Product Category
              </h3>
              <Select
                size="small"
                className="w-full"
                value={productCat || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductCat(value);
                  setFormFields((prev) => ({ ...prev, catId: value }));

                  // Reset sub & third khi đổi category
                  setProductSubCat("");
                  setFormFields((prev) => ({
                    ...prev,
                    subCatId: "",
                    thirdSubCatId: "",
                  }));
                }}
              >
                <MenuItem value="">None</MenuItem>
                {context.categoryData?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* ========== SUB CATEGORY ========== */}
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Sub Category
              </h3>
              <Select
                size="small"
                className="w-full"
                value={productSubCat || ""}
                onChange={(e) => {
                  const subId = e.target.value;
                  setProductSubCat(subId);
                  setFormFields((prev) => ({ ...prev, subCatId: subId }));

                  // ✅ Tìm và lưu danh sách third-level là con của sub này
                  const parentCat = context.categoryData
                    ?.flatMap((cat) => cat.children || [])
                    ?.find((sub) => sub._id === subId);

                  if (parentCat?.children?.length > 0) {
                    setAvailableThirdCats(parentCat.children);
                  } else {
                    setAvailableThirdCats([]);
                  }

                  // reset third khi đổi sub
                  setFormFields((prev) => ({ ...prev, thirdSubCatId: "" }));
                }}
              >
                <MenuItem value="">None</MenuItem>
                {context.categoryData
                  ?.find((cat) => cat._id === productCat)
                  ?.children?.map((subCat) => (
                    <MenuItem key={subCat._id} value={subCat._id}>
                      {subCat.name}
                    </MenuItem>
                  ))}
              </Select>
            </div>

            {/* ========== THIRD LEVEL CATEGORY ========== */}
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Third Level Category
              </h3>
              <Select
                size="small"
                className="w-full"
                value={formFields.thirdSubCatId || ""}
                onChange={(e) =>
                  setFormFields((prev) => ({
                    ...prev,
                    thirdSubCatId: e.target.value,
                  }))
                }
              >
                <MenuItem value="">None</MenuItem>
                {availableThirdCats?.map((third) => (
                  <MenuItem key={third._id} value={third._id}>
                    {third.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* ========== PRICE ========== */}
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Product Price
              </h3>
              <input
                type="number"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          {/* ========= GIÁ / FEATURED / RATING ========= */}
          <div className="grid grid-cols-5 mb-3 gap-4">
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Old Price
              </h3>
              <input
                type="number"
                name="oldPrice"
                value={formFields.oldPrice}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Discount (%)
              </h3>
              <input
                type="number"
                name="discount"
                value={formFields.discount}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                In Stock
              </h3>
              <input
                type="number"
                name="countInStock"
                min="0"
                value={formFields.countInStock}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Sales
              </h3>
              <input
                type="number"
                name="sales"
                min="0"
                value={formFields.sales}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Is Featured?
              </h3>
              <Select
                size="small"
                className="w-full"
                value={formFields.isFeatured ? "true" : "false"}
                onChange={(e) =>
                  setFormFields((prev) => ({
                    ...prev,
                    isFeatured: e.target.value === "true",
                  }))
                }
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Rating
              </h3>
              <Rating
                name="rating"
                precision={0.5}
                value={formFields.rating}
                onChange={handleChangeRating}
              />
            </div>
          </div>

          {/* ========= SIZE - WEIGHT - MATERIAL ========= */}
          <div className="grid grid-cols-4 mb-3 gap-4">
            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Weight
              </h3>
              <input
                type="text"
                name="productWeight"
                value={formFields.productWeight}
                onChange={onChangeInput}
                placeholder="VD: 12kg"
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Size
              </h3>
              <input
                type="text"
                name="size"
                value={formFields.size}
                onChange={onChangeInput}
                placeholder="VD: 180x80x75cm"
                className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Material
              </h3>
              <input
                type="text"
                name="material"
                value={formFields.material}
                onChange={onChangeInput}
                placeholder="VD: Gỗ sồi, MDF phủ melamine..."
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[600] mb-1 text-gray-800">
                Color
              </h3>
              <input
                type="text"
                name="color"
                value={formFields.color}
                onChange={onChangeInput}
                placeholder="VD: Nâu gỗ, Tự nhiên..."
                className="w-full h-[40px] border border-gray-300 focus:outline-none focus:border-primary rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          {/* ========= HÌNH ẢNH ========= */}
          <div className="col w-full p-5 px-0">
            <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>

            {/* ẢNH ĐANG CÓ (CŨ) */}
            {formFields.images?.length > 0 && (
              <>
                <h4 className="text-[14px] font-[600] mb-2 text-gray-700">
                  Existing Images
                </h4>
                <div className="grid grid-cols-7 gap-3 mb-4">
                  {formFields.images?.map((imageObj, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border"
                    >
                      <LazyLoadImage
                        src={imageObj.url}
                        className="w-full h-[150px] object-cover"
                      />

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await axios.delete(
                              `${
                                import.meta.env.VITE_API_URL
                              }/api/product/removeImage`,
                              {
                                params: { public_id: imageObj.public_id },
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "accessToken"
                                  )}`,
                                },
                              }
                            );

                            if (res.data.success) {
                              context.alertBox(
                                "success",
                                "Ảnh đã xóa thành công!"
                              );

                              setFormFields((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (img) => img.public_id !== imageObj.public_id
                                ),
                              }));
                            }
                          } catch (err) {
                            console.log(err);
                            context.alertBox("error", "Lỗi xóa ảnh!");
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white 
             text-[11px] px-2 py-[3px] rounded-md 
             opacity-80 hover:opacity-100 hover:scale-105 
             transition-all duration-150 shadow-sm"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-7 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="uploadBoxWrapper relative">
                  <span
                    className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <IoMdClose className="text-white text-[17px]" />
                  </span>
                  <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-gray-400 h-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                    <LazyLoadImage
                      className="w-full h-full object-cover"
                      alt="preview"
                      effect="blur"
                      src={url}
                    />
                  </div>
                </div>
              ))}

              <label className="uploadBox rounded-md overflow-hidden border border-dashed border-gray-400 h-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col">
                <FaCloudUploadAlt className="text-gray-500 text-[28px]" />
                <p className="text-[12px] mt-2 text-gray-600">Upload Images</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <Button
          type="submit"
          className="btn-blue btn-lg w-full flex gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3"
          disabled={isUploading}
        >
          <FaCloudUploadAlt className="text-[22px]" />
          {isUploading ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </section>
  );
};

export default EditProduct;
