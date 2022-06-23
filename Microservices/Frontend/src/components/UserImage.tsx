import styled from "styled-components";
import colors from "../util/Colors";
import { IconEnum as Icons } from "../components/elements/Icons";

interface IUserProfileProps {
    height?: number;
    width?: string;
}

const UserProfile: React.FC<IUserProfileProps> = styled.div<IUserProfileProps>`
      width: ${(props) => props.width ? props.width : "34px"};
height: ${(props) => props.height ? props.height : "34px"};
overflow: hidden;
border-radius: 50%;
object-fit: cover;
&.overalpImage{
    margin-left: -20px;
    position: relative;
    z-index: 9;
    border: 1px solid ${colors.white};
}
img{
    width: 40px;
    height: 40px;
    object-fit: cover;
}
`;
export default function UserImage({
    height = "",
    width = "",
    src = Icons.PortfolioIcon
}) {
    return (
        <UserProfile><img src={src} height={height} width={width} alt=""></img></UserProfile>
    );
}   