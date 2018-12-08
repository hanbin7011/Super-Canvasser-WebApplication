import React from 'react';
import Manager from './Manager';
import routeImg from '../../img/route.png';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import {LocationOn} from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// loading UI icon
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div>
      <CircularProgress className={classes.progress} color="secondary" />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

CircularIndeterminate = withStyles(styles)(CircularIndeterminate);


const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};


var minTasks;
var result = [];

// --------- main class component --------------
class ManagerAlgorithm extends React.Component {
  state = {
    API_KEY: 'AIzaSyC3A1scukBQw2jyAUqwHHTw4Weob5ibZiY' ,
    isStarted: true,
    locationList: [] ,
    coordList: [] ,
    params: {} ,
    unvisit: [] ,
    tasks: null,
    tasksComponent: null
  }

  componentDidMount() {
    fetch('/parameters').then(res => res.json())
    .then(params => {
      this.setState({
        params: params[0]
      })
    }).catch(err => console.log(err))

    fetch('/locations').then(res => res.json())
    .then(locations => {
      minTasks = locations.length;
      this.setState({
        locationList: locations ,
      }, () => {
        this.saveListCoord(locations);
        this.renderExistingTasks();
      })
    }).catch(err => console.log(err))
  }

  renderExistingTasks = () => {
    fetch('/tasks/uniqueTaskId').then(res => res.json())
    .then(taskIdList => {
      var taskList = [];
      taskIdList.forEach(taskId => {
        var task = {};
        task['id'] = taskId.id;
        task['locationList'] = [];

        fetch(`/tasks/${taskId.id}`)
        .then(res => res.json())
        .then(taskData => {
          taskData.forEach(location => {
            var locationData = {};
            locationData['address'] = location.fullAddress;
            locationData['id'] = location.locationId;
            locationData['duration'] = location.duration;
            task['locationList'].push(locationData);
          })
          taskList.push(task);
        }).catch(err => console.log(err))
      })
      setTimeout(() => {
        this.setState({
          tasks: taskList
        }, () => this.renderTasksComponent())  
      }, 1500)
    })
    .catch(err => console.log(err))
  }

  async saveListCoord(locations) {
    var listCoordinates = await this.getCoordList(locations);
    //console.log(listCoordinates);
    this.setState({
      coordList: listCoordinates ,
      unvisit: listCoordinates ,
    }, () => this.setState({ isStarted: false }))
  }

  ///// Use Geocoding API to convert address to longitude and latitude 
  //// to display markers of all selected locations on the map
  getCoordList = (locationList) => {
    var coordData = [];
    
    locationList.forEach(location => {
      var locationData = {};
      locationData['duration'] = location.duration;
      locationData['fullAddress'] = location.fullAddress;
      locationData['id'] = location.id;

      var fullAddr = location.fullAddress;
      var search_query = fullAddr.replace(/ /g, '+');
      
      // use API to fetch search result
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + search_query + '&key=' + this.state.API_KEY)
      .then(res => res.json())
      .then(data => {
        //console.log(data.results[0].geometry.location)
        locationData['coord'] = data.results[0].geometry.location;
      }).catch(err => console.log(err))     

      coordData.push(locationData);
    })
    return new Promise((resolve, reject) => {
        //console.log('done')
        setTimeout(() => {
          resolve(coordData);
        }, 10)
    })
  }

  haversine_distance = (lat1, lon1, lat2, lon2) => {
    var R = 6371e3;         // earth radius in meters
    var lat1_rad = lat1 * (Math.PI / 180);
    var lon1_rad = lon1 * (Math.PI / 180);
    var lat2_rad = lat2 * (Math.PI / 180);
    var lon2_rad = lon2 * (Math.PI / 180);
    
    var dLat = (lat2_rad - lat1_rad);
    var dLon = (lon2_rad - lon1_rad);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1_rad) * Math.cos(lat2_rad) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;
    return distance; // in meters
  }

  getDistance = (str1, str2) => {
    var lat1 = parseFloat(str1.split(":")[0]);
    var lon1 = parseFloat(str1.split(":")[1]);
    var lat2 = parseFloat(str2.split(":")[0]);
    var lon2 = parseFloat(str2.split(":")[1]);
  
    return this.haversine_distance(lat1, lon1, lat1, lon2) + this.haversine_distance(lat1, lon2, lat2, lon2);
  }

  getDistanceList = (map, unvisit) => {
    var distList = {};
    Object.keys(map).forEach(key => {
      distList[key] = {};
      unvisit.push(key);
    })
    Object.keys(map).forEach(key1 => {
      Object.keys(map).forEach(key2 => {
        if (key1 === key2) {
          distList[key1][key2] = 0;
        } else {
          distList[key1][key2] = this.getDistance(key1, key2);
        }
      })
    })
    return distList;
  }

  solve_vrp = (path, tasks, src, s, unvisit, distList, map, k) => {
    var avgSpeed = this.state.params.avgSpeed;
    if (unvisit.length === 0) {
      tasks.push(JSON.parse(JSON.stringify(path)));
      if (minTasks > tasks.length ) {
        minTasks = tasks.length;
        result = JSON.parse(JSON.stringify(tasks));
      }
      return;
    }
    var yes = false;
    var tempSrc = "";
    var i = 0;

    unvisit.forEach(str => {
      if (i === 0) {
        tempSrc = str;
        i++;
      }
      
      var t = s + map[str]['duration'] + distList[src][str]/(avgSpeed*60);
      console.log('time: ' + t);
      if (t <= k) {
        console.log('good');
        yes = true;
        path.push({
          'address': map[str]['fullAddress'] ,
          'id' :  map[str]['id'] ,
          'duration': map[str]['duration']
        });
        var new_unvisit = JSON.parse(JSON.stringify(unvisit));
        new_unvisit.splice(new_unvisit.indexOf(str), 1);

        this.solve_vrp(JSON.parse(JSON.stringify(path)), JSON.parse(JSON.stringify(tasks)), 
              str, t, new_unvisit, distList, map, k );
        
        path.splice(path.length-1, 1);
      } else {
        console.log('bad');
      }
    })

    if (!yes) {
      tasks.push(JSON.parse(JSON.stringify(path)));
      this.solve_vrp([], tasks, tempSrc, 0, unvisit, distList, map, k);
    }
  }

  generateAlgorithm = () => {
    this.setState({
      isStarted: true
    })
    setTimeout(() => {
      const {coordList} = this.state;
      console.log(coordList)

      // setTimeout(() => {
      //   fetch('/runAlgorithm', {
      //     method: 'post',
      //     headers: {
      //       'Accept': 'application/json, text/plain, */*',
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       'coordData': coordList ,
      //       'avgSpeed': this.state.params.avgSpeed ,
      //       'dayDuration' : this.state.params.dayDuration 
      //     })
      //   })
      //   .then(res => {
      //     console.log('done here')
      //   })
      //   .catch(err => console.log(err))
      // }, 2500)
        
      

      var map = {};

      coordList.forEach(coordinate => {
        var key = coordinate.coord.lat + ":" + coordinate.coord.lng;
        map[key] = {};
        map[key]['duration'] = coordinate.duration;
        map[key]['fullAddress'] = coordinate.fullAddress;
        map[key]['id'] = coordinate.id;
      })
      
      console.log(map);
      var unvisit = [];
      var distanceList = this.getDistanceList(map, unvisit);
      console.log(distanceList);
      var k = this.state.params.dayDuration;

      // solve
      if (Object.keys(map).length > 0) {
        var init = Object.keys(map)[0];
        this.solve_vrp([], [], init, 0, unvisit, distanceList, map, k);
      }
      this.setState({
        isStarted: false
      })
      console.log(minTasks);
      //console.log(result);
      
      this.setState({
        tasks: result,
      }, () => {
        this.saveTasksToDB();
        setTimeout(() => {
          window.location.href = `/users/manager/${this.props.match.params.username}/algorithm`;
        }, 500)
      })

    }, 2000)
  }

  renderTasksComponent = () => {
    const {tasks} = this.state;
    console.log(tasks);
    this.setState({
      tasksComponent:
      <List>
        {tasks.map((task, idx) => {
          console.log(task);
          return (
            <PaperSheet key={idx} task={task.id} taskData={task.locationList} />
          )
        })}
      </List>
    })
  }

  saveTasksToDB = () => {
    const {tasks} = this.state;

    fetch('/tasks/deleteAll').then(res => res.json()).then(result => {
      tasks.forEach((task, idx) => {
        var taskId = idx + 1;
        task.forEach(location => {
          var query = `/tasks/saveAssigned/${taskId}/${location.id}`;
          fetch(query).then(res => res.json()).catch(error => console.log(error))
        })
      })
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <div style={style}>
        <Manager username={this.props.match.params.username}/>
        <br/>
        <Grid container justify='center' alignItems='center'>
            <Grid item >
               <img src={routeImg} alt='logo' style={{width: '60%'}} />
            </Grid>
        </Grid>
        <Grid container justify='center' alignItems='center'>
          <Grid item >
               <h1 style={{fontSize: '40px'}}>Canvas Assignments Algorithm</h1>
          </Grid>
        </Grid>
        <Grid container style={{marginTop: '25px'}} justify='flex-end' >
          <Grid container justify='center' >
            <Grid item style={{marginRight: '50px'}}>
              <Typography> <strong>Work day duration:</strong> {this.state.params.dayDuration} mins </Typography>
            </Grid>
            <Grid item>
              <Typography> <strong>Average user speed:</strong> {this.state.params.avgSpeed} m/s </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid container style={{marginTop: '25px'}} justify='center' alignItems='center'>
          <Button onClick={this.generateAlgorithm} variant="contained" color="primary" > Start algorithm </Button>
        </Grid>

        <Grid container style={{marginTop: '25px'}} justify='center' alignItems='center'>
          {this.state.isStarted ? <CircularIndeterminate/> : null}
        </Grid>

        <Grid container style={{marginTop: '25px', marginBottom: '30px'}} justify='center' alignItems='center'>
          {this.state.tasksComponent}
        </Grid>
      </div>
    )
  }
}

const paper_styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50 + 200,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
});

class PaperSheet extends React.Component {
  render() {
    const {classes, task, taskData} = this.props;
    return (
      <Paper className={classes.root} elevation={1} style={{marginBottom: '10px'}}>
        <div justify='center'>
          <Typography variant='subheading'> <strong> Task {task} </strong></Typography>
          {
            taskData.map((location, idx) => {
              return (
                <div key={idx} style={{marginBottom: '15px', marginTop: '5px'}}>
                  <Grid container spacing={8} alignItems="center" >
                    <Grid item>
                      <LocationOn color='secondary'/>
                    </Grid>
                    <Grid item>
                      <Typography > 
                        {location.address}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <div style={{marginLeft: '30px'}} >
                    <Typography> 
                      Duration: {location.duration} mins
                    </Typography>
                  </div>
                </div>
              )
            })
          }
        </div>
      </Paper>
    )
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

PaperSheet = withStyles(paper_styles)(PaperSheet);

export default ManagerAlgorithm;