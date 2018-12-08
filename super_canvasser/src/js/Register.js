import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AccountCircle, VpnKey, Email, Face, Phone } from '@material-ui/icons';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import '../css/App.css';


class Register extends Component {
  state = {
    selectedValue: '1',

    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    role: '',

    firstNameValid: true,
    lastNameValid: true,
    userNameValid: true,
    emailValid: true,
    passwordValid: true,

    success: false
  };

  handleChangeRadio = (event) => {
    this.setState({
      selectedValue: event.target.value
    }, () => {
      if (this.state.selectedValue === '1') {
        this.setState({role: 'admin'})
      } else if (this.state.selectedValue === '2') {
        this.setState({role: 'canvasser'})
      } else {
        this.setState({role: 'manager'})
      }
    })
  };

  handleRegister = () => {
    const inFirstName = this.state.firstName;
    const inLastName = this.state.lastName;
    const inUserName = this.state.username;
    const inEmail = this.state.email;
    const inPassword = this.state.password;
    const inRole = this.state.role;

    if (inFirstName === '') {
      console.log('Blank first name');
      this.setState({
        firstNameValid: false
      })
    } else if (inLastName === '') {
      console.log('Blank last name');
      this.setState({
        firstNameValid: true,
        lastNameValid: false
      })
    } else {
      this.setState({
        firstNameValid: true,
        lastNameValid: true
      })
      fetch('/users')
        .then(res => res.json())
        .then(users => {
          var userObj = users.find((user) => user.username === inUserName);

          if (typeof userObj === 'undefined') {
            // username not exist => good
            this.setState({
              userNameValid: true
            })
            userObj = users.find((user) => user.email === inEmail);
            if (typeof userObj === 'undefined') {
              // email not exist => good
              this.setState({
                emailValid: true
              })
              if (inPassword.length <= 5) {
                console.log('Password isn\'t strong enough!');
                this.setState({
                  passwordValid: false
                })
              } else {
                // password is good, all inputs are valid!
                this.setState({
                  passwordValid: true,
                  success: true
                })
                const { firstName, lastName, username, phone, email, password } = this.state;
                var role = inRole;
                
                fetch(`/users/add?firstName=${firstName}&lastName=${lastName}&username=${username}&phone=${phone}&email=${email}&password=${password}&role=${role}`)
                  .catch((err) => console.log(err))

                console.log('Registered user done!');
                window.location.href = '/users/' + role + '/' + username;
              }
            } else {
              console.log('Existed email!');
              this.setState({
                emailValid: false
              })
            }
          } else {
            console.log('Existed username!');
            this.setState({
              userNameValid: false
            })
          }
        })
    }
  };

  handleChangeField = (event) => {
    if (event.target.type === 'text') {
      if (event.target.id === 'firstName') {
        //first name
        this.setState({
          firstName: event.target.value
        })
      } else if (event.target.id === 'lastName') {
        // last name
        this.setState({
          lastName: event.target.value
        })
      } else if (event.target.id === 'username') {
        // username
        this.setState({
          username: event.target.value
        })
      } else if (event.target.id === 'email') {
        // email
        this.setState({
          email: event.target.value
        })
      } else if (event.target.id === 'phone') {
        // phone
        this.setState({
          phone: event.target.value
        })
      }
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

          {/* first name text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><Face /></Grid>
            <Grid item>
              <TextField
                id='firstName'
                label='First Name'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.firstNameValid ? null : <FormHelperText id="component-error-text">Please fill in!</FormHelperText>}
            </Grid>
          </Grid>


          {/* last name text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><Face /></Grid>
            <Grid item>
              <TextField
                id='lastName'
                label='Last Name'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.lastNameValid ? null : <FormHelperText id="component-error-text">Please fill in!</FormHelperText>}
            </Grid>
          </Grid>


          {/* user name text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><AccountCircle /></Grid>
            <Grid item>
              <TextField
                id='username'
                label='Username'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.userNameValid ? null : <FormHelperText id="component-error-text">Existed username! Please use another username!</FormHelperText>}
            </Grid>
          </Grid>

          {/* phone text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><Phone /></Grid>
            <Grid item>
              <TextField
                id='phone'
                label='Phone'
                style={field_style}
                onChange={this.handleChangeField} />
            </Grid>

          </Grid>

          {/* user email text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><Email /></Grid>
            <Grid item>
              <TextField
                id='email'
                label='Email'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.emailValid ? null : <FormHelperText id="component-error-text">Existed email! Please use another email!</FormHelperText>}
            </Grid>

          </Grid>

          {/* password text field */}
          <Grid container spacing={8} alignItems="flex-end" justify='center'>
            <Grid item><VpnKey /></Grid>
            <Grid item>
              <TextField
                type="password"
                label='Password'
                style={field_style}
                onChange={this.handleChangeField} />
              {this.state.passwordValid ? null : <FormHelperText id="component-error-text">Password isn't strong enough!</FormHelperText>}
            </Grid>
          </Grid>
          <br />

          <div justify='center'>
            <Radio checked={this.state.selectedValue === '1'} value='1' onChange={this.handleChangeRadio} />Admin
                  <Radio checked={this.state.selectedValue === '2'} value='2' onChange={this.handleChangeRadio} />Canvasser
                  <Radio checked={this.state.selectedValue === '3'} value='3' onChange={this.handleChangeRadio} />Manager
               </div>
          {this.state.success ? <FormHelperText id="component-success-text">Register successfully!</FormHelperText> : null}
          <Button onClick={this.handleRegister} variant="contained" color="primary" fullWidth={true} style={btn_style}> Register </Button>

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

export default Register;

