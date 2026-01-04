import http from "../http";

const ENDPOINT = `auth`;

export const authService = {
  register: (payload) => http.post(`${ENDPOINT}/register`, payload),
  login: (payload) => http.post(`${ENDPOINT}/login`, payload),
  me: () => http.get(`${ENDPOINT}/me`),
  verifyOtp: (payload) => http.post(`${ENDPOINT}/verify-otp`, payload),
  changePassword: (payload) => http.post(`${ENDPOINT}/reset-password`, payload),
  updateUserProfile: (payload) =>
    http.put(`admin/users/${payload.id}`, payload),
  updateUserProfileImage: (payload) =>
    http.post(`${ENDPOINT}/profile/uploadImage`, payload),
  getAuthedUser: (id) => http.get(`admin/users/${id}`),
};
