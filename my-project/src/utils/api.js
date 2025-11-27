import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

/** ==========================
 *   POST REQUEST
 *  - Tự gắn Authorization token nếu có
 * ========================== */
export const postData = async (url, formData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      withCredentials: true,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(apiUrl + url, formData, config);
    return response.data;
  } catch (error) {
    console.error("❌ POST ERROR:", error);
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

/** ==========================
 *   GET REQUEST
 * ========================== */
export const fetchDataFromApi = async (url) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      withCredentials: true,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const { data } = await axios.get(apiUrl + url, config);
    return data;
  } catch (error) {
    console.log("❌ API ERROR:", error);
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

/** ==========================
 *   PUT REQUEST
 * ========================== */
export const editData = async (url, updatedData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      withCredentials: true,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(apiUrl + url, updatedData, config);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: true };
  }
};

/** ==========================
 *   DELETE REQUEST (có body)
 * ========================== */
export const deleteData = async (url, body = {}) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      withCredentials: true,
      headers: {},
      data: body, // ⭐ Gửi body theo chuẩn Axios DELETE
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.delete(apiUrl + url, config);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: true };
  }
};
