import React from "react";

// Material UI Components
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// Context
import UserContext from "../Context/UserContext";
import { List, ListItem } from "@material-ui/core";

// Styles
const styles = {
  root: {
    marginTop: 10
  }
};

class DashBoardUserInterests extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Purchasing Preferences</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {this.context.userPersonalityData.consumption_preferences[0].consumption_preferences.map(
                (value, index) => {
                  if (value.score === 1) {
                    return (
                      <div key={index}>
                        <ListItem>
                          <Typography>{value.name}</Typography>
                        </ListItem>
                      </div>
                    );
                  } else {
                    return null;
                  }
                }
              )}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Music Interests</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {this.context.userPersonalityData.consumption_preferences[5].consumption_preferences.map(
                (value, index) => {
                  if (value.score === 1) {
                    return (
                      <div key={index}>
                        <ListItem>
                          <Typography>{value.name}</Typography>
                        </ListItem>
                      </div>
                    );
                  } else {
                    return null;
                  }
                }
              )}
            </List>{" "}
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Movie Interests</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {this.context.userPersonalityData.consumption_preferences[6].consumption_preferences.map(
                (value, index) => {
                  if (value.score === 1) {
                    return (
                      <div key={index}>
                        <ListItem>
                          <Typography>{value.name}</Typography>
                        </ListItem>
                      </div>
                    );
                  } else {
                    return null;
                  }
                }
              )}
            </List>{" "}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
DashBoardUserInterests.contextType = UserContext;
export default DashBoardUserInterests;
