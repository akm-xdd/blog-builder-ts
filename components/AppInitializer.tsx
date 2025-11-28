"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken } from "@/lib/api/auth";
import { getIndustries, getPrimaryTags } from "@/lib/api/tag";
import { useDispatch } from "react-redux";
import { setIndustries, setPrimaryTags } from "@/store/slices/tagSlice";
import { toast } from "sonner";
import LoaderScreen from "./LoaderScreen";
import { getToken, getUsername, clearAuth } from "@/lib/utils/storage";
import { GetPrimaryTagsResponse, GetIndustriesResponse } from "@/types/tag.types";
import { VerifyApiResponse } from "@/types/auth.types";

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initApp() {
      // Skip login page
      if (pathname === "/login") {
        setInitialized(true);
        return;
      }

      const token = getToken();
      const username = getUsername();

      // Not logged in → redirect
      if (!token || !username) {
        setInitialized(true);
        router.replace("/login");
        return;
      }

    //   try {
    //     const result = await verifyToken();
    //     const data: VerifyApiResponse = result.data;

    //     if (!data.success) {
    //       clearAuth();
    //       setInitialized(true);
    //       router.replace("/login");
    //       return;
    //     }
    //   } catch (error: any) {
    //     clearAuth();
    //     setInitialized(true);
    //     router.replace("/login");
    //     return;
    //   }

      try {
        const [primaryRes, industryRes] = await Promise.all([
          getPrimaryTags(),
          getIndustries(),
        ]);

        const primaryData: GetPrimaryTagsResponse = primaryRes.data;
        const industryData: GetIndustriesResponse = industryRes.data;

        if (primaryData.success) {
          dispatch(setPrimaryTags(primaryData.data || []));
        }

        if (industryData.success) {
          dispatch(setIndustries(industryData.data || []));
        }
      } catch (err: any) {
        toast.error("Failed to load tags", {
          description: err?.response?.data?.error || err.message,
        });
      }

      setInitialized(true);
    }

    initApp();
  }, [dispatch, pathname, router]);

  if (!initialized) return <LoaderScreen />;

  return children;
}