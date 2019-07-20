import React from "react";

// Context
import UserContext from "../Context/UserContext";

// MaterialUI Components
import { Paper, Avatar, Typography, Grid } from "@material-ui/core";
class DashBoardProfileDetails extends React.Component {
  render() {
    return (
      <Paper style={styles.userDetails}>
        <Grid container>
          <Grid item md={3}>
            <Avatar
              src={this.context.userData.profile_pic_url}
              style={styles.avatar}
            />
          </Grid>
          <Grid item md={9}>
            <Typography align="left" variant="h6" style={styles.userName}>
              {this.context.userData.name}
            </Typography>
            <Typography align="left" style={styles.screenName}>
              {"@"}
              {this.context.userData.screen_name}
            </Typography>
          </Grid>
          <hr />
          <Grid container style={styles.details}>
            <Grid item md={6}>
              <Typography style={styles.detailsHeader}>Tweets</Typography>
              <Typography style={styles.detailsText}>
                {this.context.userData.tweets_count}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography style={styles.detailsHeader}>Friends</Typography>
              <Typography style={styles.detailsText}>
                {this.context.userData.friends_count}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
const styles = {
  userDetails: {
    padding: 15
  },
  avatar: {
    height: 60,
    width: 60
  },
  userName: {
    marginLeft: 10,
    color: "#34495e"
  },
  screenName: {
    marginLeft: 8,
    color: "#7f8c8d"
  },
  details: {
    marginTop: 10
  },
  detailsHeader: {
    color: "#34495e"
  },
  detailsText: {
    color: "#7f8c8d"
  }
};
DashBoardProfileDetails.contextType = UserContext;
export default DashBoardProfileDetails;
