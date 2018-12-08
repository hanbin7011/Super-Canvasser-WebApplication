import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {AccountCircle} from '@material-ui/icons';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class Canvasser extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      currentUserName: '',
      currentUserObj: '',
      currentUserFullName: '',
    }
  }

  componentWillMount() {
    if (typeof this.props.username === 'undefined') {
      this.setState({
        currentUserName: this.props.match.params.username,
      }, () => this.getCurrentUser(this.state.currentUserName))
    } else {
      this.setState({
        currentUserName: this.props.username,
      }, () => this.getCurrentUser(this.state.currentUserName))
    }
  }

  getCurrentUser = (currentUserName) => {
    fetch('/users').then(res => res.json())
      .then(users => {
        var currentUserObj = users.find(user => user.username === currentUserName);
        this.setState({
          currentUserObj: currentUserObj,
          currentUserFullName: currentUserObj.firstName + ' ' + currentUserObj.lastName,
        })
      }).catch(err => console.log(err))
  }

  logout = () => {
    window.location.href = '/';
  }

  /////
  viewAssignments = () => {
    window.location.href = '/users/canvasser/' + this.state.currentUserName + '/assignments';
  }

  viewAvailability = () => {
    window.location.href = '/users/canvasser/' + this.state.currentUserName + '/availability';
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <AccountCircle />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.grow}>
               {this.state.currentUserFullName}
            </Typography>
            
            <Button onClick={this.viewAssignments} color="inherit">Canvas Assignments</Button>
            <Button onClick={this.viewAvailability} color="inherit">Schedule/Calendar</Button>
            <Button onClick={this.logout} color="inherit">Log out</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Canvasser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Canvasser);