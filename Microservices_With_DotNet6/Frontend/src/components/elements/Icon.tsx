import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "../../util/Colors";
import { IconEnum } from "./Icons";

export const Icons = IconEnum;

const Icon: React.FC<any> = ({
   icon = Icons.MobileSolid,
   onClick = null,
   size = 25,
   top,
   left,
   right,
   position = "relative",
   zIndex,
   active,
   activeColor = colors.darkblue,
   inactiveColor = colors.grey,
   margin,
}) => {
   const color = active ? activeColor : inactiveColor;
   const cursor = onClick ? "pointer" : "unset";
   return (
      <FontAwesomeIcon
         icon={icon}
         onClick={onClick as any}
         style={{
            color,
            top,
            left,
            right,
            zIndex,
            fontSize: size,
            transition: "all 0.3s",
            margin,
            cursor: cursor,
         }}
      />
   );
};

export default Icon;
