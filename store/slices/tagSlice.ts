import { Industry, PrimaryTag, TagsState } from "@/types/tag.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: TagsState = {
  primaryTags: [],
  industries: [],
};

// --------- SLICE ---------

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setPrimaryTags(state: TagsState, action: PayloadAction<PrimaryTag[]>) {
      state.primaryTags = action.payload;
    },
    setIndustries(state : TagsState, action: PayloadAction<Industry[]>) {
      state.industries = action.payload;
    },
  },
});

export const { setPrimaryTags, setIndustries } = tagsSlice.actions;
export default tagsSlice.reducer;
