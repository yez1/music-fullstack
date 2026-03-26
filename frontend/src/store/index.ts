import { configureStore } from "@reduxjs/toolkit";
import couterReducer from "./modules/counter";
import recommendReducer from "@/views/discover/c-views/recommend/store/remommend";
import { TypedUseSelectorHook, useSelector ,useDispatch,shallowEqual} from "react-redux";
import playerReducer from "@/views/player/store/player";
import aiReducer from "@/views/ai-sidebar/store/ai";

const store = configureStore({
  reducer: {
    counter: couterReducer,
    recommend: recommendReducer,
    player: playerReducer,
    ai: aiReducer,
  },
});

type GetstateFnType= typeof store.getState;
export type IrootState = ReturnType<GetstateFnType>;
type DispatchType = typeof store.dispatch;



// useAppSelector的hooks
export const useAppSelector:TypedUseSelectorHook<IrootState> = useSelector;
export const useAppDispatch:()=>DispatchType = useDispatch;
export const shallowEqualApp = shallowEqual;
export default store;