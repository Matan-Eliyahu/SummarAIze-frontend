import { IAccount, IUser, PlanType } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class UserService {
  private path = "/users";

  getUser() {
    const controller = new AbortController();
    const request = apiClient.get<IAccount>(this.path, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateUser(updatedUser: IUser) {
    const controller = new AbortController();
    const request = apiClient.put<IAccount>(this.path, updatedUser, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteUser() {
    const controller = new AbortController();
    const request = apiClient.delete(this.path, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateUserPlan(newPlan: PlanType) {
    const controller = new AbortController();
    const request = apiClient.put<IUser>(`${this.path}/plan`, { newPlan }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new UserService();
