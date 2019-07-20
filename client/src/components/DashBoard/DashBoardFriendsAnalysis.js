import React from "react";

// Material Ui Components
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

// Context
import UserContext from "../Context/UserContext";

// Pie Chart
import FriendAnalysisChart from "./FriendAnalysisChart";
import { Grid } from "@material-ui/core";
import FriendsAnalysisTabs from "./FriendsAnalysisTabs";

// Transistion
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class DashBoardFriendsAnalysis extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.isOpen}
          onClose={this.props.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.props.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">Analysis</Typography>
            </Toolbar>
          </AppBar>
          <div style={styles.root}>
            <Grid container>
              <Grid item md={5}>
                <FriendAnalysisChart />
              </Grid>
              <Grid item md={7}>
                <FriendsAnalysisTabs />
              </Grid>
            </Grid>
          </div>
        </Dialog>
      </div>
    );
  }
}
const styles = {
  root: {
    marginTop: 80,
    marginRight: 50
  }
};
DashBoardFriendsAnalysis.contextType = UserContext;
export default DashBoardFriendsAnalysis;
