import styled from "styled-components";


import Icon from "./elements/Icon";
import { IconEnum as Icons } from "./elements/Icons"




const PageTille = styled.h1`
margin:0;
display: flex;
align-items: center;
font-family: 'euclid_circular_asemibold';
font-size: 32px;
@media (max-width:767px){  
    font-size: 18px !important;
}
svg{
    margin-right: 15px; 
    @media (max-width:767px){
        font-size: 22px !important; 
}
`;

interface IBackButton {
    onClick?: (() => void) | undefined;
    Text?: string | undefined;
    icon?: any;
    className?:string
}

export default function PageTilleBack({
    onClick = () => {},
    Text = "David Mrejen", 
    icon=Icons.Back,
    className="Link"
 }: IBackButton) {
    return <PageTille  className="" onClick={onClick}><Icon icon={Icons.Back} />{Text}</PageTille>;
 }