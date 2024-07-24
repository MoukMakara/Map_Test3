import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  maps: [],
  status: "idle",
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const endPoint = import.meta.env.VITE_ALLMAP_URL;
const apiUrl = `${baseUrl}${endPoint}`;

export const fetchMaps = createAsyncThunk("maps/fetchMaps", async () => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results;
});

export const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaps.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchMaps.fulfilled, (state, action) => {
        state.status = "success";
        state.maps = action.payload;
      })
      .addCase(fetchMaps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default mapsSlice.reducer;
export const selectAllMaps = (state) => state.maps.maps;
