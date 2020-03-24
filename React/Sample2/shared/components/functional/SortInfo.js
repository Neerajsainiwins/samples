import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from "recompose";
import * as actions from "../../../store/actions";
import { getSortedDevelopersCollection, sortSelector } from "../../../store/selectors";

const SortInfo = ({ sortParams, clearSortParams }) => (
  <StyledSortInfo>
    <p>
      External component, connected to same state (sort table to see result):
    </p>
    {sortParams && sortParams.key
      ? `Sorting By Key: ${sortParams.key} ${sortParams.order}`
      : "Table not sorted"}
    <br />
    <br />
    {sortParams && sortParams.key && (
      <button onClick={() => clearSortParams()}>Clear Sort</button>
    )}
  </StyledSortInfo>
);
const StyledSortInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
  flex-direction: column;
`;

const mapStateToProps = (state, props) => ({
  sortParams: sortSelector(state)
});

const mapDispatchToProps = dispatch => ({
  clearSortParams: bindActionCreators(actions.clearSortParams, dispatch)
});

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default enhance(SortInfo);
