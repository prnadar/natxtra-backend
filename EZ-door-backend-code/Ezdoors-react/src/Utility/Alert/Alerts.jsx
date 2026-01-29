import React from "react";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { hide } from "../../Redux/Slices/AlertSlice";

export default function Alerts(prop) {
  const dispatch = useDispatch();
  return (
    <div>
      <Alert
        className="z-[9999999] fixed end-[20px] top-[13%]"
        data-aos="fade-left"
        data-aos-duration="500"
        severity={prop.type}
        onClose={() => dispatch(hide())}
      >
        {prop.message}
      </Alert>
    </div>
  );
}
