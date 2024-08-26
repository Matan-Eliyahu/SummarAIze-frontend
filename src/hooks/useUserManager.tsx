import { useState } from "react";
import { useAlert } from "./useAlert";
import UserService, { AxiosError } from "../services/UserService";
import { IUser, IUserSearchResult, PlanType } from "../common/types";
import { useStore } from "./useStore";

export default function useUserManager() {
  const { setAlert } = useAlert();
  const {refreshStore} = useStore()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function searchUsers(query: string) {
    const { request } = UserService.searchUsers(query);
    try {
      const response = await request;
      const users: IUserSearchResult[] = response.data;
      return users;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return [];
    }
  }

    async function updateUser(updatedUser: IUser) {
      setIsLoading(true);
      try {
        const { request } = UserService.updateUser(updatedUser);
        await request;
        await refreshStore();
      } catch (error) {
        if (error instanceof AxiosError) setAlert({ error });
      } finally {
        setIsLoading(false);
      }
    }

    async function updateUserPlan(newPlan: PlanType) {
      setIsLoading(true);
      try {
        const { request } = UserService.updateUserPlan(newPlan);
        await request;
        await refreshStore();
      } catch (error) {
        if (error instanceof AxiosError) setAlert({ error });
      } finally {
        setIsLoading(false);
      }
    }

  return {
    isLoading,
    searchUsers,
    updateUser,
    updateUserPlan,
  };
}
