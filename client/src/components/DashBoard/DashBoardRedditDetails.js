import React from "react";

// Context
import UserContext from "../Context/UserContext";

// Material Ui Components
import { Paper, Typography, Divider } from "@material-ui/core";

// FontAwesome
// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit } from "@fortawesome/free-brands-svg-icons";

class DashBoardRedditDetails extends React.Component {
  render() {
    return (
      <div>
        <Paper style={styles.root}>
          <Typography variant="h6" align="left" style={styles.headerText}>
            <FontAwesomeIcon icon={faReddit} style={styles.redditLogo} />
            User Interests In Reddit
          </Typography>
          <Divider />
          {this.context.userData.subreddits.map((value, index) => {
            return (
              <Typography align="left" key={index}>
                {value}
              </Typography>
            );
          })}
        </Paper>
      </div>
    );
  }
}
const styles = {
  root: {
    marginTop: 10,
    padding: 15
  },
  headerText: {
    marginBottom: 10
  },
  redditLogo: {
    color: "ff4500",
    marginRight: 10
  }
};
DashBoardRedditDetails.contextType = UserContext;
export default DashBoardRedditDetails;
