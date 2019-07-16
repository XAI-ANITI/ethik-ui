import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Select from "react-select";
import { OrderedSet } from "immutable";

import API from "../../api";
import { configure } from "../../redux/dataset/reducer";
import { getColumns } from "../../redux/dataset/selectors";

function Configure(props) {
  const [isChecking, setIsChecking] = useState(false);
  const [predYCols, setPredYCols] = useState(
    new OrderedSet([props.columns.last()])
  );
  const [qualitativeXCols, setQualitativeXCols] = useState(
    new OrderedSet([])
  );
  const [quantitativeXCols, setQuantitativeXCols] = useState(
    new OrderedSet(props.columns.butLast())
  );
  const [trueYCol, setTrueYCol] = useState(null);

  const configure = () => {
    setIsChecking(true);

    API.post(props.checkEndpoint, {
      quantitative_x_cols: quantitativeXCols.toJS(),
      qualitative_x_cols: qualitativeXCols.toJS(),
      pred_y_cols: predYCols.toJS(),
      true_y_col: trueYCol,
    })
    .then(function (res) {
      setIsChecking(false);

      const errors = res.data.errors;
      if (errors.length) {
        alert(errors); // TODO
        return;
      }

      props.configure({
        trueYCol,
        predYCols,
        quantitativeXCols,
        qualitativeXCols,
      });
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

  if (predYCols.includes(trueYCol)) {
    setTrueYCol(null);
  }

  const optionsPred = props.columns.toArray().map(
    c => ({ value: c, label: c })
  );

  const options = props.columns.toArray().filter(col => (
    !predYCols.includes(col) &&
    !quantitativeXCols.includes(col) &&
    !qualitativeXCols.includes(col)
  )).map(
    c => ({ value: c, label: c })
  );

  return (
    <form className="configure" onSubmit={configure}>
      <fieldset>
        <legend>X</legend>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Quantitative:</label>
              </td>
              <td className="select_col">
                <Select
                  value={quantitativeXCols.toArray().map(
                    name => ({ value: name, label: name })
                  )}
                  onChange={
                    (sel) => setQuantitativeXCols(new OrderedSet(sel.map(opt => opt.value)))
                  }
                  options={optionsPred}
                  className="Select"
                  isSearchable
                  isMulti
                />
              </td>
            </tr>
            <tr className="sep">
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <label>Qualitative:</label>
              </td>
              <td className="select_col">
                <Select
                  value={qualitativeXCols.toArray().map(
                    name => ({ value: name, label: name })
                  )}
                  onChange={
                    (sel) => setQualitativeXCols(new OrderedSet(sel.map(opt => opt.value)))
                  }
                  options={optionsPred}
                  className="Select"
                  placeholder="Not supported yet"
                  isSearchable
                  isMulti
                  isDisabled
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>

      <fieldset>
        <legend>Y</legend>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Predicted:</label>
              </td>
              <td className="select_col">
                <Select
                  value={predYCols.toArray().map(
                    name => ({ value: name, label: name })
                  )}
                  onChange={
                    (sel) => setPredYCols(new OrderedSet(sel.map(opt => opt.value)))
                  }
                  options={optionsPred}
                  className="Select"
                  isSearchable
                  isMulti
                />
              </td>
            </tr>
            <tr className="sep">
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <label>Real:</label>
              </td>
              <td className="select_col">
                <Select
                  value={{ value: trueYCol, label: trueYCol }}
                  onChange={
                    (sel) => setTrueYCol(sel != null ? sel.value : null)
                  }
                  options={options}
                  className="Select"
                  isSearchable
                  isClearable
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>

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
  { configure }
)(Configure);
