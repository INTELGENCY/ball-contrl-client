import { BaseUrl } from "../keys";

export const getOneSession = async (id) => {
  try {
    setLoading(true);
    const response = await axios.get(`${BaseUrl}/session/session/${id}`);
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};
