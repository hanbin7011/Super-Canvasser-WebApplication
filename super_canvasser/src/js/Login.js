import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { VpnKey, Email } from '@material-ui/icons';
import Radio from '@material-ui/core/Radio';
import FormHelperText from '@material-ui/core/FormHelperText';
import '../css/App.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '1',
      currentUsername: '',
      email: '',
      password: '',
      emailValid: true,
      passwordValid: true,
      roleValid: true,
    };
  }

  handleChangeRadio = (event) => {
    console.log(event.target.value);

    this.setState({
      selectedValue: event.target.value
    }, () => {
      if (this.state.selectedValue === '1') {
      } else if (this.state.selectedValue === '2') {
      } else {

      }
    })
  };

  handleLogin = () => {
    const inEmail = this.state.email;
    const inPass = this.state.password;
    const inRole = this.state.selectedValue;

    fetch('/users')
      .then(res => res.json())
      .then(users => {
        // validate email
        var status = users.find((user) => user.email === inEmail);

        if (typeof status === 'undefined') {
          console.log('Invalid email');
          this.setState({
            emailValid: false
          })
        } else {
          this.setState({
            emailValid: true
          })
        }
        // validate password
        status = users.find((user) => user.password === inPass);
        if (typeof status === 'undefined') {
          console.log('Invalid password');
          this.setState({
            passwordValid: false
          })
        } else {
          this.setState({
            passwordValid: true
          })
        }

        // validate role
        if (typeof status !== 'undefined') {
          if ((status.role === 'admin' && inRole === '1')
            || (status.role === 'canvasser' && inRole === '2')
            || (status.role === 'manager' && inRole === '3')) {
            // now all inputs are correct
            this.setState({
              roleValid: true,
              currentUsername: status.username
            })
          } else {
            // role invalid
            console.log('Wrong role!');
            this.setState({
              roleValid: false
            })
          }
        }

        // the case where all inputs are valid
        if (this.state.emailValid && this.state.passwordValid && this.state.roleValid) {
          const { currentUsername } = this.state;

          fetch(`http://localhost:3001/users/current?username=${currentUsername}`)
            .catch((err) => console.log(err))

          console.log('Log in user: ', status);
          window.location.href = '/users/' + status.role + '/' + currentUsername;
        }
      })
  };

  handleChangeField = (event) => {
    if (event.target.type === 'text') {
      // email
      this.setState({
        email: event.target.value
      })
    } else {
      // password
      this.setState({
        password: event.target.value
      })
    }

  }

  render() {
    return (
      <Grid item xs={12} container justify='center'>
        <form className="form" justify='center'>
          {/* user email text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><Email /></Grid>
            <Grid item>
              <TextField
                className='email'
                label='Email'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.emailValid ? null : <FormHelperText id="component-error-text">Invalid email!</FormHelperText>}
            </Grid>
          </Grid>

          {/* password text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><VpnKey /></Grid>
            <Grid item>
              <TextField
                className='password'
                type="password"
                label='Password'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.passwordValid ? null : <FormHelperText id="component-error-text">Invalid password!</FormHelperText>}
            </Grid>
          </Grid>

          <br />
          <div justify='center'>
            <Radio checked={this.state.selectedValue === '1'} value='1' onChange={this.handleChangeRadio} />Admin
                  <Radio checked={this.state.selectedValue === '2'} value='2' onChange={this.handleChangeRadio} />Canvasser
                  <Radio checked={this.state.selectedValue === '3'} value='3' onChange={this.handleChangeRadio} />Manager
                  {this.state.roleValid ? null : <FormHelperText id="component-error-text">Your role is incorrect!</FormHelperText>}
          </div>

          <Button onClick={this.handleLogin} variant="contained" color="primary" fullWidth={true} style={btn_style}> Log In </Button>
        </form>
      </Grid>
    );
  }
}

const field_style = {
  width: 300,
  color: "#ffffff",
}
const btn_style = {
  marginTop: 10,
};

export default Login;
