import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// POST
export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { status: false, message: "Something went wrong!" };
  }
};

// GET (SỬA Ở ĐÂY)
export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.log("❌ API ERROR:", error);
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

export const editData = async (url, updatedData, isFormData = false) => {
  try {
    const response = await axios.put(apiUrl + url, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log("❌ API ERROR:", error);
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

export const deleteImages = async (url, body) => {
  const res = await axios.delete(import.meta.env.VITE_API_URL + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    data: body,
  });
  return res.data;
};

export const deleteMultipleData = async (url, body) => {
  try {
    const res = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      data: body, // bắt buộc phải gửi data trong axios.delete
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return error.response?.data || { error: true, message: "Request failed" };
  }
};

export const adminGetUsers = async (search = "") => {
  return await fetchDataFromApi(`/api/admin/users?search=${search}`);
};

export const editPATCH = async (url, updatedData) => {
  try {
    const response = await axios.patch(apiUrl + url, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: true, message: "Request failed" };
  }
};
