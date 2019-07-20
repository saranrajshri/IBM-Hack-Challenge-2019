import React from "react";

// Context
import UserContext from "../Context/UserContext";

// MaterialUI Components
import { Paper, Typography, Grid, CircularProgress } from "@material-ui/core";

// Components
import DashBoardFindAMatch from "./DashBoardFindAMatch";
import DashBoardUserInterests from "./DashBoardUserInterests";

// axios
import axios from "axios";

class DashBoardUserAnalysis extends React.Component {
  componentDidMount() {
    // Calculate Personality insights
    axios
      .get(
        "http://127.0.0.1:5000/api/getUserTweetsAndCalcInsights/" +
          this.context.userData.screen_name
      )
      .then(response => {
        this.setState({ personalityInsights: response.data });

        // Send Data to Context
        this.context.updateUserPersonalityData(this.state.personalityInsights);

        // Calculate Sentiment Anaysis
        axios
          .get("http://127.0.0.1:5000/api/getSentimentAnalysis/")
          .then(response => {
            this.setState({
              sentimentAnalysis: response.data,
              isLoading: false
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      personalityInsights: [],
      sentimentAnalysis: []
    };
  }
  render() {
    console.log(this.state.personalityInsights);
    // Showing progress icon while analyzing
    if (!this.state.isLoading) {
      return (
        <div>
          <Paper style={styles.root}>
            <Grid container>
              <Grid item md={4}>
                <Typography variant="h6" align="left" style={styles.headerText}>
                  Personality Insights
                </Typography>
                <Typography align="left" style={styles.features}>
                  Agreeableness :{" "}
                  {(
                    this.state.personalityInsights.personality[3].percentile *
                    100
                  ).toFixed(0) + "%"}
                </Typography>
                <Typography align="left" style={styles.features}>
                  Conscientiousness :
                  {(
                    this.state.personalityInsights.personality[1].percentile *
                    100
                  ).toFixed(0) + "%"}
                </Typography>
                <Typography align="left" style={styles.features}>
                  Openess :{" "}
                  {(
                    this.state.personalityInsights.personality[0].percentile *
                    100
                  ).toFixed(0) + "%"}
                </Typography>
                <Typography align="left" style={styles.features}>
                  Extraversion :{" "}
                  {(
                    this.state.personalityInsights.personality[2].percentile *
                    100
                  ).toFixed(0) + "%"}
                </Typography>
                <Typography align="left" style={styles.features}>
                  Emotional Range :{" "}
                  {(
                    this.state.personalityInsights.personality[4].percentile *
                    100
                  ).toFixed(0) + "%"}
                </Typography>
                <Typography align="left" style={styles.clusterText}>
                  Cluster: {this.state.personalityInsights.cluster}
                </Typography>
              </Grid>
              <Grid item md={8}>
                <Typography variant="h6" style={styles.headerText}>
                  Sentiment Analysis
                </Typography>
                <Typography style={styles.features}>
                  Overall Sentiment :{" "}
                  {this.state.sentimentAnalysis.sentiment.document.label}
                </Typography>
                <Typography style={styles.features}>
                  Score:{" "}
                  {(
                    this.state.sentimentAnalysis.sentiment.document.score * 100
                  ).toFixed(0)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          {/* User Interests */}
          <DashBoardUserInterests />
          {/* Find a match section */}
          <DashBoardFindAMatch />
        </div>
      );
    } else {
      return (
        <Paper style={styles.root}>
          <Grid container justify="center">
            <CircularProgress />
            <Typography style={styles.text}>Analyzing...Please Wait</Typography>
          </Grid>
        </Paper>
      );
    }
  }
}
const styles = {
  root: {
    padding: 15
  },
  headerText: {
    color: "#2980b9",
    marginBottom: 10
  },
  features: {
    color: "#34495e",
    fontWeight: "bold"
  },
  text: {
    color: "#34495e",
    marginLeft: 15
  },
  clusterText: {
    fontWeight: "bold",
    color: "#e74c3c"
  }
};
DashBoardUserAnalysis.contextType = UserContext;
export default DashBoardUserAnalysis;
