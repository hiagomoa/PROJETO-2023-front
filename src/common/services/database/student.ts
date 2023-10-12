import api from "@/lib/api";

export const createStudent = async (data) => {
  try {
    const response = await api.post("/student", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/student/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listStudents = async ({ queryKey }) => {
  const { data } = await api.get("/student", {
    params: queryKey[1],
  });
  return data;
};

export const updateStudent = async (data) => {
  try {
    const response = await api.put(`/student/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/student/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
