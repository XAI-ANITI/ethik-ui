import React from "react";
import { connect } from "react-redux";

import { getFeatures } from "../redux/mean_explainer/selectors";
import { selectFeature } from "../redux/mean_explainer/reducer";

class DisplayMeanExplanation extends React.Component {
  handleChange = (e) => {
    this.props.selectFeature({
      feature: e.target.value
    });
  }

  render() {
    if (!this.props.features.size) {
      return null;
    }

    const options = this.props.features.map(feature => (
      <option key={feature} value={feature}>{feature}</option>
    ));
    return (
      <label>
        Select a feature:
        <select value={this.props.selectedFeature} onChange={this.handleChange}>
          {options}
        </select>
      </label>
    );
  }
}

export default connect(
  state => ({ features: getFeatures(state) }),
  { selectFeature }
)(DisplayMeanExplanation);
