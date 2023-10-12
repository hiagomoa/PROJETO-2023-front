import api from "@/lib/api";

export const createClass = async (data) => {
  try {
    const response = await api.post("/class", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (id) => {
  try {
    const response = await api.get(`/class/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listClass = async ({ queryKey }) => {
  const { data } = await api.get("/class", {
    params: queryKey[1],
  });
  return data;
};

export const updateClass = async (data) => {
  try {
    const response = await api.put(`/class/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
