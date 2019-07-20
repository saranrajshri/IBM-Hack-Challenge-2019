import React from "react";

// Context
import UserContext from "../Context/UserContext";

// MaterialUI Components
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Divider
} from "@material-ui/core/";

// axios
import axios from "axios";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faReddit } from "@fortawesome/free-brands-svg-icons";

// COmponents
import DashBoard from "../DashBoard/DashBoard";

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loginFormIsOpen: true,
      isLoading: false,
      twitterName: "",
      loginButtonIsDisabled: false,
      redditLogin: false,
      redditName: "",
      redditPassword: ""
    };
  }

  // Update Username to state
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // login
  login = () => {
    // showing ProgressBar and Disabling the LoginButton
    this.setState({
      isLoading: true,
      loginButtonIsDisabled: true
    });

    // Get details from the backend
    axios
      .get(
        " http://127.0.0.1:5000/api/getUserDetails?twitter_name=" +
          this.state.twitterName +
          "&reddit_name=" +
          this.state.redditName +
          "&reddit_password=" +
          this.state.redditPassword
      )
      .then(response => {
        // send data to the context
        this.context.updateUserData(response.data);
        // open dashboard
        this.setState({ loginFormIsOpen: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // handle check box change
  showRedditLoginForm = () => {
    this.setState({
      redditLogin: !this.state.redditLogin
    });
  };

  render() {
    if (this.state.loginFormIsOpen) {
      return (
        <Container style={styles.root}>
          <Grid container>
            <Grid item md={3} />
            <Grid item md={6}>
              <Paper style={styles.loginForm}>
                {/* ProgessBar */}
                {this.state.isLoading ? (
                  <LinearProgress color="secondary" />
                ) : null}
                {/* ProgressBar End */}
                <Typography variant="h6" style={styles.loginFormHeader}>
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={styles.twitterLogo}
                  />
                  Login With Twitter
                </Typography>

                <TextField
                  style={styles.loginFormInput}
                  id="outlined-name"
                  label="Enter Your Twitter Username"
                  margin="normal"
                  name="twitterName"
                  variant="outlined"
                  onChange={this.handleChange}
                />

                <Divider />
                {this.state.redditLogin ? (
                  <div>
                    <Typography variant="h6" style={styles.loginFormHeader}>
                      <FontAwesomeIcon
                        icon={faReddit}
                        style={styles.redditLogo}
                      />
                      Enter Your Reddit Credentials
                    </Typography>
                    <TextField
                      style={styles.loginFormInput}
                      id="outlined-name"
                      label="Enter Your Reddit Username"
                      margin="normal"
                      name="redditName"
                      variant="outlined"
                      onChange={this.handleChange}
                    />
                    <TextField
                      style={styles.loginFormInput}
                      id="outlined-name"
                      label="Enter Your Reddit Password"
                      margin="normal"
                      name="redditPassword"
                      type="password"
                      variant="outlined"
                      onChange={this.handleChange}
                    />
                  </div>
                ) : (
                  <div>
                    <Divider />
                    <Button
                      onClick={this.showRedditLoginForm}
                      style={styles.redditButton}
                    >
                      I also have an reddit account
                    </Button>
                  </div>
                )}

                {/* Reddit Login Form */}
                <Divider />
                {/* Button */}
                {this.state.loginButtonIsDisabled ? (
                  <Button
                    variant="contained"
                    disabled
                    style={styles.lodingButton}
                  >
                    Loading
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    style={styles.loginButton}
                    onClick={this.login}
                  >
                    Login
                  </Button>
                )}
              </Paper>
            </Grid>
            <Grid item md={3} />
          </Grid>
        </Container>
      );
    } else {
      return <DashBoard />;
    }
  }
}
const styles = {
  root: {
    marginTop: "3%"
  },
  loginForm: {
    padding: 15,
    paddingTop: 0
  },
  loginFormHeader: {
    color: "#2c3e50",
    paddingTop: 10
  },
  loginFormInput: {
    width: "100%"
  },
  twitterLogo: {
    marginRight: 10,
    color: "#1da1f2"
  },
  redditLogo: {
    color: "ff4500",
    marginRight: 10
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 10
  },
  redditButton: {
    marginTop: 10,
    marginBottom: 10
  },
  loadingButton: {
    marginTop: 10
  }
};

LoginForm.contextType = UserContext;
export default LoginForm;
