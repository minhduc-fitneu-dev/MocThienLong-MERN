// utils/slugify.js
// Hàm tạo slug không dấu, chuẩn SEO
export function slugify(str = "") {
  return (
    str
      .toString()
      .trim()
      // bỏ dấu tiếng Việt
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // về chữ thường
      .toLowerCase()
      // thay khoảng trắng & _ thành -
      .replace(/[\s_]+/g, "-")
      // bỏ ký tự đặc biệt
      .replace(/[^a-z0-9-]/g, "")
      // bỏ bớt dấu -
      .replace(/-+/g, "-")
      // bỏ - ở đầu/cuối
      .replace(/^-+|-+$/g, "")
  );
}
