import React from "react";
import "./App.css";

// Router
import { BrowserRouter as Router } from "react-router-dom";

// Context
import UserContext from "./components/Context/UserContext";

// Components
import AppBar from "./components/AppBar/AppBar";
import LoginForm from "./components/LoginForm/LoginForm";
import Footer from "./components/Footer/Footer";

// Route
const Route = require("react-router-dom").Route;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userData: [],
      userPersonalityData: [],
      friendsData: []
    };
  }

  // update userdata from loginscreen to the UserData state
  updateUserData = data => {
    this.setState({
      userData: data
    });
  };

  // update user sentiment Data to user sentiment data state
  updateUserPersonalityData = data => {
    this.setState({
      userPersonalityData: data
    });
  };

  // Update Friends Data to show Visualiztion
  updateFriendsData = data => {
    this.setState({
      friendsData: data
    });
  };

  render() {
    console.log(this.state.userData);
    return (
      <div className="App">
        <UserContext.Provider
          value={{
            ...this.state,
            updateUserData: this.updateUserData,
            updateUserPersonalityData: this.updateUserPersonalityData,
            updateFriendsData: this.updateFriendsData
          }}
        >
          <AppBar />
          <Router>
            <Route path="/" component={LoginForm} />
          </Router>
          <Footer />
        </UserContext.Provider>
      </div>
    );
  }
}

export default App;
