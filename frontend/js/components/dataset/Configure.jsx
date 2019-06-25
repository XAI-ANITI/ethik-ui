import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Select from "react-select";
import { OrderedSet } from "immutable";

import API from "../../api";
import { configure } from "../../redux/dataset/reducer";
import { getColumns } from "../../redux/dataset/selectors";
import { view as viewPredictions } from "../../redux/predictions/reducer";

function Configure(props) {
  const [isChecking, setIsChecking] = useState(false);
  const [predLabelsCols, setPredLabelsCols] = useState(
    new OrderedSet([props.columns.last()])
  );
  const [trueLabelCol, setTrueLabelCol] = useState(null);

  const configure = () => {
    setIsChecking(true);

    API.post(props.checkEndpoint, {
      columns: props.columns.toJS(),
      pred_labels_cols: predLabelsCols.toJS(),
      true_label_col: trueLabelCol,
    })
    .then(function (res) {
      setIsChecking(false);

      const errors = res.data.errors;
      if (errors.length) {
        alert(errors); // TODO
        return;
      }

      new Promise((resolve, reject) => {
        props.configure({
          trueLabelCol: trueLabelCol,
          predLabelsCols: predLabelsCols,
        });
        resolve();
      }).then(props.viewPredictions);
    })
    .catch(function (e) {
      // TODO
      alert("Errorrrrr: " + e);
    });
  };

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

  if (predLabelsCols.includes(trueLabelCol)) {
    setTrueLabelCol(null);
  }

  const optionsPred = props.columns.toArray().map(
    c => ({ value: c, label: c })
  );

  const options = props.columns.toArray().filter(
    col => !predLabelsCols.includes(col)
  ).map(
    c => ({ value: c, label: c })
  );

  return (
    <form className="configure" onSubmit={configure}>
      <div>
        <label>Ŷ:</label>
        <Select
          value={predLabelsCols.toArray().map(
            name => ({ value: name, label: name })
          )}
          onChange={
            (sel) => setPredLabelsCols(new OrderedSet(sel.map(opt => opt.value)))
          }
          options={optionsPred}
          className="Select"
          isSearchable
          isMulti
        />
      </div>
      
      <div>
        <label>Y:</label>
        <Select
          value={{ value: trueLabelCol, label: trueLabelCol }}
          onChange={
            (sel) => setTrueLabelCol(sel != null ? sel.value : null)
          }
          options={options}
          className="Select"
          isSearchable
          isClearable
        />
      </div>

      <input type="submit" value="Explain" />
    </form>
  );
}

Configure.propTypes = {
  checkEndpoint: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    columns: getColumns(state),
  }),
  { configure, viewPredictions }
)(Configure);
