import React from "react";
import { Container, Grid, Link } from "@material-ui/core";

class Footer extends React.Component {
  render() {
    return (
      <Container style={styles.root}>
        <Grid container>
          <Grid item md={3} />
          <Grid item md={6}>
            <Link style={styles.link}>Home</Link>
            <Link style={styles.link}>Login</Link>
            <Link style={styles.link}>How To Use</Link>
            <Link style={styles.link}>Contact Us</Link>
          </Grid>
          <Grid item md={3} />
        </Grid>
      </Container>
    );
  }
}
const styles = {
  root: {
    marginTop: "2%"
  },
  link: {
    color: "#2c3e50",
    marginRight: 30
  }
};
export default Footer;
