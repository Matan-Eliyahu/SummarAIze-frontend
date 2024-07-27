import { IUser, PlanType } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class UserService {
  private path = "/users";

  updatePlan(newPlan: PlanType) {
    const controller = new AbortController();
    const request = apiClient.put<IUser>(`${this.path}/update-plan`, { newPlan }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new UserService();
