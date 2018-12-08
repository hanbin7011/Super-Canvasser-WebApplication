import React from 'react';
import TableUsers from './TableUsers';
import 'react-web-tabs/dist/react-web-tabs.css';
import Admin from './Admin';
import Grid from '@material-ui/core/Grid';


const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};

class AdminViewUsers extends React.Component {
  state = {
    mainComponent: null,
    users: null,
  }

  componentDidMount() {
    this.reload();
  }
  
  reload = () => {
    // fetching from back-end server
    fetch('/users')
      .then(res => res.json())
      .then(users =>
        // set data to list of canvassers
        this.setState({
          users: users
        })
      )
      .catch(err => console.log(err))

    setTimeout(() => {
      this.load();
    }, 500)
  }

  load = () => {
    this.setState({
      mainComponent: <div style={style}>
        <Admin username={this.props.match.params.username}/>
        <br/>
        <Grid container justify='center'>
          <Grid item>
            <h1> Administrator </h1>
          </Grid>
        </Grid>
        <div>
          <TableUsers data={this.state.users} reload={this.reload} selected={[]}/>
        </div>
      </div>,
    })
  }

  render() {
    return (
      <div>
        {this.state.mainComponent}
      </div>
    );
  };
}

export default AdminViewUsers;

