import React, { useContext, useState } from "react";
import { TextField, Select, MenuItem, Button } from "@mui/material";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddCategoryUnified = () => {
  const { categoryData, alertBox, loadCategories, setIsOpenFullScreenPanel } =
    useContext(MyContext);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);

  const flatten = (list, depth = 0) =>
    list.flatMap((item) => [
      { _id: item._id, name: `${"— ".repeat(depth)}${item.name}` },
      ...flatten(item.children || [], depth + 1),
    ]);

  const flatList = flatten(categoryData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      parentId: parentId || null,
      parentCatName:
        flatList
          .find((c) => c._id === parentId)
          ?.name.replace(/—/g, "")
          .trim() || null,
      images: [], // ảnh tùy sau bổ sung
    };

    const res = await postData("/api/category/create", payload);

    if (res?.success) {
      alertBox("success", "Category Saved!");
      loadCategories();
      setIsOpenFullScreenPanel({ open: false });
    } else alertBox("error", res?.message || "Failed");

    setLoading(false);
  };

  return (
    <section className="p-6 bg-gray-50">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Add Category</h2>

        <TextField
          fullWidth
          size="small"
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          fullWidth
          size="small"
          value={parentId}
          displayEmpty
          onChange={(e) => setParentId(e.target.value)}
        >
          <MenuItem value="">
            <em>Không có (Tạo Root)</em>
          </MenuItem>

          {flatList.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          type="submit"
          className="btn-blue w-[260px] flex gap-2"
          disabled={loading}
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FaCloudUploadAlt /> SAVE
            </>
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddCategoryUnified;
