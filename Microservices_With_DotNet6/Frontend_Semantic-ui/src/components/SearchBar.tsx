import styled from "styled-components";
import colors from '../util/Colors';
import { IconEnum as Icons } from './elements/Icons';

const SeacrhBarContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 520px;
    display: flex;
    align-items: center;
    border: 1px solid ${colors.bordercolor};
    padding: 15px 20px;
    border-radius: 10px;
    background-color: ${colors.white};
    @media (max-width:1300px){
        max-width: 440px;
    }
    @media (max-width:767px){
        max-width: 100%;
    }
    input{
        width:100%;
        border: none;
        width: 100%;
        border: none;
        padding-left: 30px;
        font-size: 14px;
        font-family: 'euclid_circular_aregular';
        &:focus-visible{
            outline:none;
            border: none;
        }
    }
    img{
        position: absolute;
        left: 18px;
    }
`;

export default function SearchBar({
   placeholder = "Search"
}) {
   return (
      <SeacrhBarContainer>
         <input type="text" placeholder={placeholder}></input>
         <img src={Icons.SearchIcon} alt=""></img>
      </SeacrhBarContainer>
   );
}