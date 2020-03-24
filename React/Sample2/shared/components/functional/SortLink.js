import React from "react";
import styled from "styled-components";

const SortLink = ({
  label,
  sortKey,
  type,
  sort, 
  onSort,
  onSortClear,
  textRight
}) => (
  <StyledSortHeader textRight={textRight}>
    <StyledSortLink
      textRight={textRight}
      onClick={() => onSort(sortKey, type)}
      dir={(sort && sort.key === sortKey && sort.order) || undefined}
    >
      {label}{" "}
      {sort && sort.key === sortKey ? (
        <StyledSortLinkCarets>
          <StyledCaretUp active={sort.order === "asc"} />
          <StyledCaretDown active={sort.order === "desc"} />
        </StyledSortLinkCarets>
      ) : (
        <StyledSortLinkCarets>
          <StyledCaretUp />
          <StyledCaretDown />
        </StyledSortLinkCarets>
      )}
    </StyledSortLink>
    {sort && sort.key === sortKey && (
      <StyledClearSortLink onClick={() => onSortClear()}>
        &times;
      </StyledClearSortLink>
    )}
  </StyledSortHeader>
);

const StyledSortHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  ${props =>
    props.textRight
      ? "justify-content: flex-end;"
      : "justify-content: flex-start;"}
`;

const StyledSortLink = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  ${props =>
    props.textRight
      ? "justify-content: flex-end;"
      : "justify-content: flex-start;"}
`;

const StyledSortLinkCarets = styled.span`
  display: flex;
  flex-direction: column;
  height: 11px;
  align-items: flex-start;
  justify-content: space-between;
  margin-left: 3px;
`;

const StyledCaretDown = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  color: ${props => (props.active ? " #f6554f" : "initial")};
  opacity: ${props => (props.active ? "1" : "0.4")};
`;

const StyledCaretUp = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  transform: rotate(180deg);
  color: ${props => (props.active ? " #f6554f" : "initial")};
  opacity: ${props => (props.active ? "1" : "0.4")};
`;

const StyledClearSortLink = styled.a`
  & i {
    color: #9797ac;
  }
  margin-left: 6px;
  cursor: pointer;
`;

export default SortLink;
