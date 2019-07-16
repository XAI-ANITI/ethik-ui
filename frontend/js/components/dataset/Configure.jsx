import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Select from "react-select"; // TODO
import { OrderedSet, Map } from "immutable";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Dustbin from "./Dustbin";
import Box from "./Box";
import API from "../../api";
import { configure } from "../../redux/dataset/reducer";
import { getColumns } from "../../redux/dataset/selectors";

function Configure(props) {
  const [isChecking, setIsChecking] = useState(false);
  const [columns, setColumns] = useState(new Map({
    "excluded": new OrderedSet(),
    "qualitative X": new OrderedSet(),
    "quantitative X": new OrderedSet(props.columns.butLast()),
    "predicted Y": new OrderedSet([props.columns.last()]),
    "true Y": null,
  }));

  const configure = () => {
    setIsChecking(true);
    const cols = {
      quantitative_x_cols: columns.get("quantitative X").toJS(),
      qualitative_x_cols: columns.get("qualitative X").toJS(),
      pred_y_cols: columns.get("predicted Y").toJS(),
      true_y_col: columns.get("true Y"),
    };

    API.post(props.checkEndpoint, cols)
    .then(function (res) {
      setIsChecking(false);

      const errors = res.data.errors;
      if (errors.length) {
        alert(errors); // TODO
        return;
      }

      props.configure({
        trueYCol: cols.true_y_col,
        predYCols: cols.pred_y_cols,
        quantitativeXCols: cols.quantitative_x_cols,
        qualitativeXCols: cols.qualitative_x_cols,
      });
    })
    .catch(function (e) {
      // TODO
      alert("Errorrrrr: " + e);
    });
  };

  const handleDrop = useCallback(
    (groupKey, item) => {
      const col = item.name;
      let newColumns = columns;
      let group;

      // Remove col from previous group
      for (let k of  columns.keySeq()) {
        group = columns.get(k);
        if (OrderedSet.isOrderedSet(group) && group.includes(col)) {
          newColumns = newColumns.set(k, group.delete(col));
        }
        else if (group == col) {
          newColumns = newColumns.set(k, null); 
        }
      }

      // Add col to new group
      group = columns.get(groupKey);
      if (OrderedSet.isOrderedSet(group)) {
        newColumns = newColumns.set(groupKey, group.add(col));
      }
      else {
        if (group !== null) {
          newColumns = newColumns.set(
            "excluded",
            newColumns.get("excluded").add(group)
          );
        }
        newColumns = newColumns.set(groupKey, col);
      }

      setColumns(newColumns);
    },
    [columns]
  );

  if (isChecking) {
    return (
      <div className="spinner">
        <FontAwesome
          name="spinner"
          size="4x"
          spin
        />
      </div>
    );
  }

  const renderBoxes = (group) => {
    if (OrderedSet.isOrderedSet(group)) {
      return group.toArray().map(
        name => <Box name={name} key={name} />
      );
    }
    if (group === null) {
      return null;
    }
    // group is true y
    return <Box name={group} key={group} />
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <form className="configure" onSubmit={configure}>
        <div className="dnd">
          {columns.toArray().map(([groupKey, group]) => (
            <Dustbin
              key={groupKey}
              name={groupKey}
              onDrop={item => handleDrop(groupKey, item)}
            >
              {renderBoxes(group)}
            </Dustbin>
          ))}
        </div>
        <input type="submit" value="Explain" />
      </form>
    </DndProvider>
  );
}

Configure.propTypes = {
  checkEndpoint: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    columns: getColumns(state),
  }),
  { configure }
)(Configure);
