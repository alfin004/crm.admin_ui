import { apiRequest } from "./api";

export const attendanceApi = {
  punchIn: () => apiRequest("/attendance/punch-in", { method: "POST" }),
  punchOut: () => apiRequest("/attendance/punch-out", { method: "POST" }),
  today: () => apiRequest("/attendance/today"),
  history: ({ month, year, page, pageSize }) => {
    const params = new URLSearchParams();
    params.set("month", month);
    params.set("year", year);
    params.set("page", page);
    params.set("page_size", pageSize);
    return apiRequest(`/attendance/history?${params.toString()}`);
  },
};
