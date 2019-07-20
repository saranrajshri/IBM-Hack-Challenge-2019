import React from "react";

// Context
import UserContext from "../Context/UserContext";

// MaterialUI Components
import { Paper, Typography, Divider } from "@material-ui/core";

class DashBoardUserAnalysis extends React.Component {
  render() {
    return (
      <Paper style={styles.root}>
        <Typography variant="h6" style={styles.headerText}>
          Friends List
        </Typography>
        <Divider />
        <br />
        {this.context.userData.friends.map((value, index) => {
          return (
            <Typography key={index} style={styles.friendsName}>
              {value}
            </Typography>
          );
        })}
      </Paper>
    );
  }
}
const styles = {
  root: {
    padding: 15
  },
  friendsName: {
    color: "#2c3e50"
  },
  headerText: {
    color: "#34495e"
  }
};
DashBoardUserAnalysis.contextType = UserContext;
export default DashBoardUserAnalysis;
