import { GetIndustriesResponse, GetPrimaryTagsResponse } from "@/types/tag.types";
import api from "../utils/axios";

export function getPrimaryTags() {
  return api.get<GetPrimaryTagsResponse>("/tags/primary");
}

export function getIndustries() {
  return api.get<GetIndustriesResponse>(`/tags/industries?page_size=100`);
}

