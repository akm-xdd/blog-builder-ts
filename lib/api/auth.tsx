import { LoginPayload, LoginApiResponse, VerifyApiResponse } from "@/types/auth.types";
import api from "../utils/axios";

export function login(payload: LoginPayload) {
  return api.post<LoginApiResponse>("/auth/login", payload);
}

export function verifyToken() {
  return api.get<VerifyApiResponse>("/auth/verify");
}