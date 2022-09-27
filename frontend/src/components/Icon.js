import React from "react";
import { IconsMap } from "../utils/Icons";

export default function Icon({ size, iconName, color, style = "" }) {
  const SvgElement = IconsMap[iconName];
  return (
    <div className={`${style}`}>
      <SvgElement fill={color} size={size} />
    </div>
  );
}
