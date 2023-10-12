import api from "@/lib/api";

export const createProf = async (data) => {
  try {
    const response = await api.post("/prof", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfById = async (id) => {
  try {
    const response = await api.get(`/prof/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listProfs = async ({ queryKey }) => {
  const { data } = await api.get("/prof", {
    params: queryKey[1],
  });
  return data;
};

export const updateProf = async (data) => {
  try {
    const response = await api.put(`/prof/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProf = async (id) => {
  try {
    const response = await api.delete(`/prof/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
