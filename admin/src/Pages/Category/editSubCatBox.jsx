import React, { useContext, useEffect, useMemo, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, editData } from "../../utils/api";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";

const EditSubCategory = () => {
  const context = useContext(MyContext);
  const id = context.isOpenFullScreenPanel?.id;

  const [loading, setLoading] = useState(true);
  const [rootId, setRootId] = useState("");
  const [parentSubId, setParentSubId] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({});

  // Lấy category hiện tại
  useEffect(() => {
    if (!id) return;

    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      if (res?.success) {
        const cat = res.category;
        setName(cat.name);
        setParentSubId(cat.parentId || "");

        // Xác định Root cấp cha:
        let foundRoot = null;

        context.categoryData.forEach((root) => {
          if (root._id === cat.parentId) {
            // Đây là sub level
            foundRoot = root._id;
          }

          root.children?.forEach((child) => {
            if (child._id === cat.parentId) {
              // Đây là third level → root là cấp trên của child
              foundRoot = root._id;
            }
          });
        });

        setRootId(foundRoot || "");
      }

      setLoading(false);
    });
  }, [id]);

  // List sub thuộc root
  const subOfSelectedRoot = useMemo(() => {
    const root = context.categoryData.find((r) => r._id === rootId);
    return root?.children || [];
  }, [rootId, context.categoryData]);

  const handleSave = async () => {
    setTouched({ name: true, root: true });
    if (!name.trim()) return;
    if (!rootId) return;

    const parentId = parentSubId || rootId;
    const parentName =
      (parentSubId
        ? subOfSelectedRoot.find((s) => s._id === parentSubId)?.name
        : context.categoryData.find((r) => r._id === rootId)?.name) || null;

    const payload = {
      name: name.trim(),
      parentId,
      parentCatName: parentName,
      images: [], // giữ nguyên vì sub ko dùng ảnh
    };

    const res = await editData(`/api/category/${id}`, payload);

    if (res?.success) {
      context.alertBox("success", "Updated successfully!");
      context.loadCategories();
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", "Update failed");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <section className="p-6 bg-gray-50">
      <h3 className="font-[600] text-[18px] mb-5">Edit Sub / Third Category</h3>

      <div className="grid grid-cols-2 gap-5">
        {/* Root */}
        <div>
          <p className="text-sm font-medium mb-1">Parent Root Category</p>
          <Select
            size="small"
            fullWidth
            value={rootId}
            onChange={(e) => {
              setRootId(e.target.value);
              setParentSubId("");
            }}
            onBlur={() => setTouched((t) => ({ ...t, root: true }))}
          >
            <MenuItem value="">
              <em>Select Root</em>
            </MenuItem>

            {context.categoryData.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
          {touched.root && !rootId && (
            <FormHelperText error>Please select a root</FormHelperText>
          )}
        </div>

        {/* Sub optional */}
        <div>
          <p className="text-sm font-medium mb-1">
            Parent Sub Category (optional)
          </p>
          <Select
            size="small"
            fullWidth
            disabled={!rootId}
            value={parentSubId}
            onChange={(e) => setParentSubId(e.target.value)}
          >
            <MenuItem value="">
              <em>No Parent (This will be SUB)</em>
            </MenuItem>

            {subOfSelectedRoot.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                — {s.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Name */}
        <div className="col-span-2">
          <p className="text-sm font-medium mb-1">Category Name</p>
          <TextField
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={touched.name && !name.trim()}
            helperText={touched.name && !name.trim() ? "Name is required" : ""}
          />
        </div>
      </div>

      <div className="w-[200px] mt-6">
        <Button
          variant="contained"
          className="btn-blue w-full flex gap-2 !text-white"
          onClick={handleSave}
        >
          <FaCloudUploadAlt /> SAVE CHANGES
        </Button>
      </div>
    </section>
  );
};

export default EditSubCategory;
