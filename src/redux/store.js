import { configureStore } from "@reduxjs/toolkit";
import mapsReducer from "./feature/map/MapSlice";

const store = configureStore({
  reducer: { maps: mapsReducer },
});

export default store;
