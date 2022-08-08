import styled from "styled-components";
import React from "react";
interface FlexProps {
   width?: string;
   margin?: string;
   xswidth?: string;
   height?: string;
   maxWidth?: string;
   radius?: string;
   padding?: string;
   borderRadius?: string;
   top?: string;
   bottom?: string;
   left?: string;
   right?: string;
   header?: string;
   footer?: string;
   type?: string;
   required?: string;
   minLength?: string;
   justify?: string;
   direction?: string;
   align?: string;
   borderRight?: string;
   flex?: string;
   position?: string;
   flexWrap?: string;
}

export const Flex: React.FunctionComponent<FlexProps> = styled.div<FlexProps>`
   display: flex;
   flex-direction: ${(props) => props.direction};
   justify-content: ${(props) => props.justify};
   align-items: ${(props) => props.align};
   width: ${(props) => props.width};
   flex: ${(props) => props.flex};
   margin: ${(props) => props.margin};
   padding: ${(props) => props.padding};
   height: ${(props) => props.height};
   border-right: ${(props) => props.borderRight};
   flex-wrap: ${(props) => props.flexWrap};
   position: ${(props) => props.position};
   top: ${(props) => props.top};
`;
