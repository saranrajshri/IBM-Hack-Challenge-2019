import React from "react";

// Context
import UserContext from "../Context/UserContext";

//MaterialUi Components
import {
  Paper,
  Button,
  Divider,
  Typography,
  Avatar,
  Grid,
  LinearProgress
} from "@material-ui/core";

// axios
import axios from "axios";

// Components
import DashBoardFriendsAnalysis from "./DashBoardFriendsAnalysis";

class DashBoardFindAMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendsData: [],
      isLoading: false,
      analysisDashBoardIsOpen: false
    };
  }

  // Get Friends Data
  getData = username => {
    return new Promise((resolve, reject) => {
      // Sending the user data to calculate match percentage
      axios
        .get(
          "http://127.0.0.1:5000/api/getFriendsData?username=" +
            username +
            "&" +
            "userList=" +
            this.context.userPersonalityData.personality[3].percentile +
            "," +
            this.context.userPersonalityData.personality[1].percentile +
            "," +
            this.context.userPersonalityData.personality[0].percentile +
            "," +
            this.context.userPersonalityData.personality[2].percentile +
            "," +
            this.context.userPersonalityData.personality[4].percentile
        )
        .then(response => {
          if (response.data) {
            return resolve(response);
          }
        })
        .catch(error => {
          return reject(error.message);
        });
    });
  };

  findAMatch = async () => {
    this.setState({ isLoading: true });

    for (var i = 0; i < this.context.userData.friends.length; i++) {
      await this.getData(this.context.userData.friends[i]).then(response => {
        this.state.friendsData.push(response.data);
        this.setState({
          friendsData: this.state.friendsData
        });
        // Send data to Context
        this.context.updateFriendsData(this.state.friendsData);
      });
    }
    this.setState({
      isLoading: false
    });
  };

  // Show Analysis Dashboard
  showAnalysis = () => {
    this.setState({
      analysisDashBoardIsOpen: true
    });
  };
  render() {
    return (
      <div>
        {/* Analysis DashBoard(Chart) */}
        <DashBoardFriendsAnalysis
          isOpen={this.state.analysisDashBoardIsOpen}
          handleClose={e => {
            this.setState({ analysisDashBoardIsOpen: false });
          }}
        />
        <Paper style={styles.root}>
          {/* ProgessBar */}
          {this.state.isLoading ? (
            <div>
              <LinearProgress color="secondary" />
              <Button
                variant="contained"
                disabled
                onClick={this.findAMatch}
                style={styles.button}
              >
                Analyzing
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.showAnalysis}
                style={styles.analysisButton}
              >
                Show Analysis
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={this.findAMatch}
              style={styles.button}
            >
              Find A Match
            </Button>
          )}
          {/* Button */}

          <Divider />
          {this.state.friendsData.map((value, index) => {
            if (value.cluster === this.context.userPersonalityData.cluster) {
              return (
                <div key={index}>
                  <Grid container style={styles.container}>
                    <Grid item md={1}>
                      <Avatar src={value.profile_pic_url} />
                    </Grid>
                    <Grid item md={11}>
                      <Typography
                        align="left"
                        variant="h6"
                        style={styles.userName}
                      >
                        {value.name}
                      </Typography>
                      <Typography align="left" style={styles.screenName}>
                        {"@"}
                        {value.screen_name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container style={styles.container}>
                    <Grid item md={12}>
                      <Typography align="left" style={styles.features}>
                        Agreeableness :{" "}
                        {(value.personality[3].percentile * 100).toFixed(0) +
                          "%"}
                      </Typography>
                      <Typography align="left" style={styles.features}>
                        Conscientiousness :
                        {(value.personality[1].percentile * 100).toFixed(0) +
                          "%"}
                      </Typography>
                      <Typography align="left" style={styles.features}>
                        Openess :{" "}
                        {(value.personality[0].percentile * 100).toFixed(0) +
                          "%"}
                      </Typography>
                      <Typography align="left" style={styles.features}>
                        Extraversion :{" "}
                        {(value.personality[2].percentile * 100).toFixed(0) +
                          "%"}
                      </Typography>
                      <Typography align="left" style={styles.features}>
                        Emotional Range :{" "}
                        {(value.personality[4].percentile * 100).toFixed(0) +
                          "%"}
                      </Typography>
                      <Typography align="left" style={styles.clusterText}>
                        Cluster: {value.cluster}
                      </Typography>
                      <Typography align="left" style={styles.clusterText}>
                        Match Percent: {(value.match_percent * 100).toFixed(0)}{" "}
                        {"%"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                </div>
              );
            } else {
              return null;
            }
          })}
        </Paper>
      </div>
    );
  }
}
const styles = {
  root: {
    marginTop: 10,
    padding: 15,
    paddingTop: 0
  },
  container: {
    marginTop: 10
  },
  userName: {
    marginLeft: 10,
    fontSize: 15,
    color: "#34495e"
  },
  screenName: {
    marginLeft: 8,
    color: "#7f8c8d"
  },
  button: {
    marginTop: 10,
    marginBottom: 10
  },
  analysisButton: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  clusterText: {
    fontWeight: "bold",
    color: "#e74c3c"
  }
};
DashBoardFindAMatch.contextType = UserContext;
export default DashBoardFindAMatch;
