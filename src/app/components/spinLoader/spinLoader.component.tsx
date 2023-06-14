import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 70, color: "white" }} spin />
);

export default function SpinLoader() {
  return (
    <div className="absolute inset-0 bg-overlay z-10 flex justify-center items-center">
      <Spin indicator={antIcon} />
    </div>
  );
}
