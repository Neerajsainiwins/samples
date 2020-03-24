import { createSelector } from "reselect";
import get from "lodash/get";
import orderBy from "lodash/orderBy";

const developersSelector = state => state.app && state.app.developersList;

export const sortSelector = state => state.app && state.app.sortParams;

function orderByType(data, type) {
  switch (type) {
    case "date":
      return Date.parse(data);
    case "float":
      return parseFloat(data);
    default:
      return data;
  }
}

export const getSortedDevelopersCollection = createSelector(
  developersSelector,
  sortSelector,
  (developersCollection, sort) => {
    if (sort) {
      return orderBy(
        developersCollection,
        c => orderByType(get(c, sort.key), sort.type),
        [sort.order || "desc"]
      );
    }

    return developersCollection;
  }
);
