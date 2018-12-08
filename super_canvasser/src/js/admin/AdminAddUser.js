import React from 'react';
import Grid from '@material-ui/core/Grid';
import Admin from './Admin';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { PersonAdd, Timelapse } from '@material-ui/icons';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';


const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};

const wrap = {
  margin: '3% 15% 3% 15%',
};

const pad = {
  paddingLeft: '13%',
}

class AdminAddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      selectedValue: '1',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      tmpFirstName: '',
      tmpLastName: '',
      tmpUsername: '',
      tmpEmail: '',
      tmpPhone: '',

      params: {},

      firstNameValid: true,
      lastNameValid: true,
      userNameValid: true,
      emailValid: true,

      success: false
    }
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    var role = searchParams.get('role');

    if (role === 'admin') {
      role = '1';
    } else if (role === 'canvasser') {
      role = '2';
    } else {
      role = '3';
    }
    

    if (id !== null) {
      this.setState({
        id: parseInt(id, 10),
        tmpFirstName: firstName,
        tmpLastName: lastName,
        tmpUsername: username,
        tmpEmail: email,
        tmpPhone: phone,
        selectedValue: role
      })
    }
  }

  componentWillMount() {
    // fetch global parameters
    fetch('/parameters').then(res => res.json())
    .then(params => {
      this.setState({
        params: params[0]
      })
    }).catch(err => console.log(err))
  }

  handleChangeRadio = (event) => {
    this.setState({
      selectedValue: event.target.value
    })
  }

  handleChangeField = (event) => {
    this.setState({ edit: true });
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
      } else if (event.target.id === 'dayDuration') {
        // work day duration
        this.setState({
          params: {
            dayDuration: event.target.value,
            visitDuration: typeof this.state.params === 'undefined' ? 0.0 : this.state.params.visitDuration ,
            avgSpeed: typeof this.state.params === 'undefined' ? 0.0 : this.state.params.avgSpeed
          }
        })
      } else if (event.target.id === 'visitDuration') {
        // visit duration
        this.setState({
          params: {
            dayDuration: typeof this.state.params === 'undefined' ? 0 : this.state.params.dayDuration ,
            visitDuration: event.target.value ,
            avgSpeed: typeof this.state.params === 'undefined' ? 0.0 : this.state.params.avgSpeed
          }
        })
      } else if (event.target.id === 'avgSpeed') {
        // speed
        this.setState({
          params: {
            dayDuration: typeof this.state.params === 'undefined' ? 0 : this.state.params.dayDuration ,
            visitDuration: typeof this.state.params === 'undefined' ? 0.0 : this.state.params.visitDuration ,
            avgSpeed: event.target.value
          }
        })
      }
    }
  }

  handleAddUser = () => {
    const inFirstName = this.state.firstName;
    const inLastName = this.state.lastName;
    const inUserName = this.state.username;
    const inEmail = this.state.email;

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
            console.log("work");
            this.setState({
              userNameValid: true
            })
            userObj = users.find((user) => user.email === inEmail);
            if (typeof userObj === 'undefined') {
              // email not exist => good
              this.setState({
                emailValid: true
              })

              // password is good, all inputs are valid!
              this.setState({
                success: true
              })
              const { firstName, lastName, username, email, phone } = this.state;
              console.log(phone);
              var password = "1234";
              var role = "";
              if (this.state.selectedValue === '1') {
                role = "admin";
              } else if (this.state.selectedValue === '2') {
                role = "canvasser";
              } else {
                role = "manager";
              }

              fetch(`/users/add?firstName=${firstName}&lastName=${lastName}&username=${username}&email=${email}&phone=${phone}&password=${password}&role=${role}`)
                .catch((err) => console.log(err))

              console.log('Registered user done!');

            } else {
              console.log('Existed email!');
              this.setState({
                emailValid: false
              })
            }
          } else {
            console.log('Existed username!');
            console.log(inUserName);
            this.setState({
              userNameValid: false
            })
          }
        })
    }
  }

  handleUpdateParam = () => {
    const {params} = this.state;
    console.log(params);
    var query = `/parameters/${params.dayDuration}/${params.visitDuration}/${params.avgSpeed}`;
    fetch(query).then(res => res.json())
    .catch(err => console.log(err));
  }

  handleUpdateUser = () => {
    const inFirstName = this.state.firstName;
    const inLastName = this.state.lastName;
    const inUserName = this.state.username;
    const inEmail = this.state.email;

    if (inFirstName === '' && inLastName === '' && inEmail === '' && inUserName === '') {
      console.log('One of field should be filled!');
    } else {
      if (inFirstName === '' || inFirstName === this.state.tmpFirstName) {
        var firstName = this.state.tmpFirstName;
      } else {
        firstName = inFirstName;
      }

      if (inLastName === '' || inLastName === this.state.tmpLastName) {
        var lastName = this.state.tmpLastName;
      } else if (inLastName !== '') {
        lastName = inLastName;
      }

      if (inUserName === '' || inUserName === this.state.tmpUsername) {
        var username = this.state.tmpUsername;
      } else {
        fetch('/users')
          .then(res => res.json())
          .then(users => {
            var userObj = users.find((user) => user.username === inUserName);

            if (typeof userObj === 'undefined') {
              // username not exist => good
              console.log("work");
              username = inUserName;
              this.setState({
                userNameValid: true
              })
            } else {
              console.log('Existed username!');
              console.log(userObj);
              console.log(inUserName);
              this.setState({
                userNameValid: false
              })
            }
          })

      }

      if (inEmail === '' || inEmail === this.state.tmpEmail) {
        var email = this.state.tmpEmail;
      } else {
        fetch('/users')
          .then(res => res.json())
          .then(users => {
            var userObj = users.find((user) => user.email === inEmail);

            if (typeof userObj === 'undefined') {
              // username not exist => good
              console.log("work");
              email = inEmail;
              this.setState({
                emailValid: true
              })
            } else {
              console.log('Existed email!');
              console.log(userObj);
              console.log(inEmail);
              this.setState({
                emailValid: false
              })
            }
          })

      }

      if (this.state.selectedValue === 1) {
        var role = "admin";
      } else if (this.state.selectedValue === 2) {
        role = "canvasser";
      } else {
        role = "manager";
      }


      if (this.state.userNameValid && this.state.emailValid) {
        fetch(`/users/update?firstName=${firstName}&lastName=${lastName}&username=${username}&email=${email}&role=${role}&id=${this.state.id}`)
          .catch((err) => console.log(err))

        console.log('Update user done!');
      }

    }
  }

  render() {
    return (
      <div style={style}>
        <Admin username={this.props.match.params.username} />
        <br />
        <div style={wrap}>
          <form className="form" justify='center'>
            <Grid container spacing={8} alignItems="flex-end" justify='center'>
              <Grid item><PersonAdd /></Grid>
              <Grid item><h1> {this.state.id === '' ? 'Add new user' : 'Update User'}</h1></Grid>
            </Grid>
            <div style={pad}>
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>First Name:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='firstName'
                    className='firstName'
                    label={this.state.tmpFirstName === '' ? 'First Name' : this.state.tmpFirstName}
                    fullWidth={true}
                    onChange={this.handleChangeField} />
                  {this.state.firstNameValid ? null : <FormHelperText id="component-error-text">Please fill in!</FormHelperText>}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Last Name:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='lastName'
                    className='lastName'
                    label={this.state.tmpLastName === '' ? 'Last Name' : this.state.tmpLastName}
                    fullWidth={true}
                    onChange={this.handleChangeField} />
                  {this.state.lastNameValid ? null : <FormHelperText id="component-error-text">Please fill in!</FormHelperText>}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Username:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='username'
                    className='username'
                    label={this.state.tmpUsername === '' ? 'Username' : this.state.tmpUsername}
                    fullWidth={true}
                    onChange={this.handleChangeField} />
                  {this.state.userNameValid ? null : <FormHelperText id="component-error-text">Existed username! Please use another username!</FormHelperText>}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Email:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='email'
                    className='email'
                    label={this.state.tmpEmail === '' ? 'Email Address' : this.state.tmpEmail}
                    fullWidth={true}
                    onChange={this.handleChangeField} />
                  {this.state.emailValid ? null : <FormHelperText id="component-error-text">Existed email! Please use another email!</FormHelperText>}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Phone:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='phone'
                    className='phone'
                    label={this.state.tmpPhone === '' ? 'Phone Number' : this.state.tmpPhone}
                    fullWidth={true}
                    onChange={this.handleChangeField} />
                </Grid>
              </Grid>
              <br/>
            </div>

            <Grid container justify='center'>
              <Grid item><br/>Role:</Grid>
            </Grid>
            <Grid container justify='center'>
              <Grid item>
                <div justify='center'>
                  <Radio checked={this.state.selectedValue === '1'} value='1' onChange={this.handleChangeRadio} />Admin
                  <Radio checked={this.state.selectedValue === '2'} value='2' onChange={this.handleChangeRadio} />Canvasser
                  <Radio checked={this.state.selectedValue === '3'} value='3' onChange={this.handleChangeRadio} />Manager
                </div>
              </Grid>
            </Grid>

            <Grid container justify='center'>
              <Grid item><br />
                <Button onClick={this.state.id === '' ? this.handleAddUser : this.handleUpdateUser} variant="contained" size='large' color="primary"> {this.state.id === '' ? 'Add new user' : 'Update User'}</Button>
              </Grid>
            </Grid>
            <br /><br />
            <Grid container spacing={8} alignItems="flex-end" justify='center'>
              <Grid item><Timelapse /></Grid>
              <Grid item><h1> Update parameters </h1></Grid>
            </Grid>

            <div style={pad}>
              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Work day duration (mins):</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='dayDuration'
                    onChange={this.handleChangeField}
                    defaultValue={typeof this.state.params === 'undefined' ? '': this.state.params.dayDuration}
                    className='dayDuration'
                    label='Work day duration'
                    fullWidth={true} />
                </Grid>
              </Grid>

              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>Default visit duration (mins) at each location:</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='visitDuration'
                    onChange={this.handleChangeField}
                    //defaultValue={typeof this.state.params === 'undefined' ? '': this.state.params.visitDuration}
                    className='visitDuration'
                    label='Visit duration'
                    fullWidth={true} />
                </Grid>
              </Grid>

              <Grid container spacing={8} alignItems="flex-end" justify='center'>
                <Grid item xs={3}>User average speed (m/s):</Grid>
                <Grid item xs={6}>
                  <TextField
                    id='avgSpeed'
                    onChange={this.handleChangeField}
                    defaultValue={typeof this.state.params === 'undefined' ? '': this.state.params.avgSpeed}
                    className='speed'
                    label='Average speed'
                    fullWidth={true} />
                </Grid>
              </Grid>
            </div>
            <br />
            <Grid container justify='center'>
              <Grid item><br/>
                <Button onClick={this.handleUpdateParam} variant="contained" size='large' color="primary"> Update </Button>
              </Grid>
            </Grid>

          </form>
        </div>
      </div>
    );
  }
}

export default AdminAddUser;

