import { ThemeProvider } from "../Context/ThemeContext";
import { render } from "@testing-library/react";
import React from "react";

// custom render to wrap the containers in the contextProvider
export const customRender = (ui: React.ReactElement, { ...renderOptions } = {}) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>, renderOptions);
};