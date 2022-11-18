import React from "react";
import {CircularProgress} from "@mui/material";

//@TODO WARN make it more general component (move to "components")
const LoadingSpinner: React.FC = () => {
    return <>
        <CircularProgress/>
    </>
}

export default LoadingSpinner;