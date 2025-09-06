import api from "./middleware";

export const checkUserExists = async (identifier: string) => {
  try {
    const { data } = await api.post("/auth/check-user-exists", { identifier });
    console.log("API_RESPONSE: ", data);
    if (data && data.success) {
      return { success: true, response: data.data };
    } else {
      return {
        success: false,
        response: data?.message || "Something went wrong",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};
