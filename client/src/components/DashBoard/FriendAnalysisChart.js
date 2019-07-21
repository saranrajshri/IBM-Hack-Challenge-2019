import React from "react";

// Chart
import { Pie } from "react-chartjs-2";

// Context
import UserContext from "../Context/UserContext";

var zeroClusterCount = 0,
  oneClusterCount = 0,
  twoClusterCount = 0;
class FriendAnalysisChart extends React.Component {
  constructor() {
    super();
    this.state = {
      zeroClusterCount: 0,
      oneClusterCount: 0,
      twoClusterCount: 0
    };
  }

  calculateCount = () => {
    for (var i = 0; i < this.context.friendsData.length; i++) {
      var value = this.context.friendsData[i];
      if (value.cluster === "Moderate Positivity") {
        zeroClusterCount = zeroClusterCount + 1;
      } else if (value.cluster === "High Positivity") {
        oneClusterCount = oneClusterCount + 1;
      } else {
        twoClusterCount = twoClusterCount + 1;
      }
    }
  };
  render() {
    var zeroClusterPercentage =
      (zeroClusterCount / this.context.friendsData.length) * 100;
    var oneClusterPercentage =
      (oneClusterCount / this.context.friendsData.length) * 100;
    var twoClusterPercentage =
      (twoClusterCount / this.context.friendsData.length) * 100;
    const data = {
      labels: ["Moderate Postivity", "High Positivity", "Low Positivity"],
      datasets: [
        {
          label: "Types Of Persons",
          data: [
            zeroClusterPercentage,
            oneClusterPercentage,
            twoClusterPercentage
          ],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"]
        }
      ]
    };

    const options = {
      maintainAspectRatio: false // Don't maintain w/h ratio
    };

    return (
      <div>
        {this.calculateCount()}
        <Pie data={data} options={options} />
      </div>
    );
  }
}

FriendAnalysisChart.contextType = UserContext;
export default FriendAnalysisChart;
