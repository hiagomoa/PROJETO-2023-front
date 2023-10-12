import api from "@/lib/api";

export const createExercise = async (data) => {
  try {
    const response = await api.post("/exercise", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExerciseById = async (id) => {
  try {
    const response = await api.get(`/exercise/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listExercises = async ({ queryKey }) => {
  const { data } = await api.get("/exercise", {
    params: queryKey[1],
  });
  return data;
};

export const updateExercise = async (data) => {
  try {
    const response = await api.put(`/exercise/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await api.delete(`/exercise/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
