import React from "react";
import "./loader.css";
export default function Loader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
