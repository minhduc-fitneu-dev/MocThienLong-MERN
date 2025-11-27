import React, { useState, useEffect } from "react";
import "../Sidebar/style.css";
import { Collapse } from "react-collapse";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const formatPrice = (value) => value.toLocaleString("vi-VN") + " đ";

const Sidebar = ({ onFilterChange }) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const navigate = useNavigate();
  const { id: currentCategoryId } = useParams();

  const [categories, setCategories] = useState([]);

  // Checked state
  const [checkedRoot, setCheckedRoot] = useState(null);
  const [checkedSub, setCheckedSub] = useState(null);
  const [checkedThird, setCheckedThird] = useState(null);

  // Price
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [price, setPrice] = useState([0, 0]);

  // Rating
  const [rating, setRating] = useState(null);

  // ========================= LOAD CATEGORY TREE =========================
  useEffect(() => {
    const loadCats = async () => {
      const res = await fetchDataFromApi("/api/category");
      if (!res.error && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    };
    loadCats();
  }, []);

  // ========================= LOAD MIN/MAX PRICE =========================
  useEffect(() => {
    const loadPriceRange = async () => {
      const res = await fetchDataFromApi("/api/product/getMinMaxPrice");
      if (!res.error) {
        setPriceRange([0, res.maxPrice]);
        setPrice([0, res.maxPrice]);
      }
    };
    loadPriceRange();
  }, []);

  // ============================================
  //  FIXED DFS TÌM ĐÚNG ROOT - SUB - THIRD
  // ============================================
  const findCategoryLevel = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      const newPath = [...path, node];

      if (node._id === targetId) {
        return newPath; // path đúng cấp
      }

      if (node.children?.length > 0) {
        const result = findCategoryLevel(node.children, targetId, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  // ============================================
  //  AUTO TICK KHI CHUYỂN URL
  // ============================================
  useEffect(() => {
    if (!currentCategoryId || categories.length === 0) return;

    const path = findCategoryLevel(categories, currentCategoryId) || [];

    let root = null,
      sub = null,
      third = null;

    if (path.length === 1) {
      root = path[0]._id;
    } else if (path.length === 2) {
      root = path[0]._id;
      sub = path[1]._id;
    } else if (path.length === 3) {
      root = path[0]._id;
      sub = path[1]._id;
      third = path[2]._id;
    }

    setCheckedRoot(root);
    setCheckedSub(sub);
    setCheckedThird(third);

    // GỬI FILTER CHUẨN — không gửi sai nữa
    onFilterChange({
      catId: root,
      subCatId: sub,
      thirdSubCatId: third,
    });
  }, [currentCategoryId, categories]);

  // =================================================================================
  // HANDLE CATEGORY CLICK (CHUẨN)
  // =================================================================================
  const toggleTick = (level, id) => {
    if (level === "root") {
      setCheckedRoot(id);
      setCheckedSub(null);
      setCheckedThird(null);

      onFilterChange({
        catId: id,
        subCatId: null,
        thirdSubCatId: null,
      });

      navigate(`/category/${id}`);
    }

    if (level === "sub") {
      setCheckedSub(id);
      setCheckedThird(null);

      onFilterChange((prev) => ({
        ...prev,
        subCatId: id,
        thirdSubCatId: null,
      }));

      navigate(`/category/${id}`);
    }

    if (level === "third") {
      setCheckedThird(id);

      onFilterChange((prev) => ({
        ...prev,
        thirdSubCatId: id,
      }));

      navigate(`/category/${id}`);
    }
  };

  // ========================= PRICE FILTER =========================
  const handlePrice = (val) => {
    setPrice(val);
    onFilterChange((prev) => ({
      ...prev,
      price: { min: val[0], max: val[1] },
    }));
  };

  // ========================= RATING =========================
  const chooseRating = (r) => {
    setRating(r);
    onFilterChange((prev) => ({
      ...prev,
      rating: { min: r, max: r + 1 },
    }));
  };

  return (
    <aside className="sidebar py-5">
      {/* CATEGORY FILTER */}
      <div className="box">
        <h3 className="w-full mb-3 text-[18px] font-[600] flex items-center pr-5">
          Mua theo sản phẩm
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>

        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="scroll px-4 relative -left-[13px]">
            {categories.map((root) => (
              <div key={root._id} className="mb-1">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={checkedRoot === root._id}
                      onChange={() => toggleTick("root", root._id)}
                    />
                  }
                  label={root.name}
                />

                {checkedRoot === root._id &&
                  root.children?.map((sub) => (
                    <div key={sub._id} className="ml-5">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={checkedSub === sub._id}
                            onChange={() => toggleTick("sub", sub._id)}
                          />
                        }
                        label={sub.name}
                      />

                      {checkedSub === sub._id &&
                        sub.children?.map((third) => (
                          <div key={third._id} className="ml-6">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={checkedThird === third._id}
                                  onChange={() =>
                                    toggleTick("third", third._id)
                                  }
                                />
                              }
                              label={third.name}
                            />
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      {/* PRICE */}
      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[18px] font-[600]">Lọc Theo Giá</h3>

        <RangeSlider
          min={priceRange[0]}
          max={priceRange[1]}
          value={price}
          onInput={handlePrice}
        />

        <div className="flex pt-4 pb-2 priceRange">
          <span className="text-[13px]">
            From: <strong>{formatPrice(price[0])}</strong>
          </span>
          <span className="ml-auto text-[13px]">
            To: <strong>{formatPrice(price[1])}</strong>
          </span>
        </div>
      </div>

      {/* RATING */}
      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[18px] font-[600]">Đánh giá</h3>

        {[5, 4, 3, 2, 1].map((r) => (
          <div
            key={r}
            className="w-full cursor-pointer flex items-center gap-2 py-1"
            onClick={() => chooseRating(r)}
          >
            <Rating value={r} size="small" readOnly />
            <span
              className={`text-[13px] ${
                rating === r ? "text-[#d29141] font-bold" : ""
              }`}
            >
              {r} sao
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
