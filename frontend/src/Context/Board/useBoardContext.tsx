import { useContext } from "react";
import { BoardContext } from "./BoardContext";



export const useBoard = () => useContext(BoardContext);
