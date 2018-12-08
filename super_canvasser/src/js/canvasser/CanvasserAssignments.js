import React from 'react';
import Canvasser from './Canvasser';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ReactStars from 'react-stars';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {LocationOn, Done} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};


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



class GoogleMapExample extends React.Component {
  state = {
    API_KEY: 'AIzaSyC3A1scukBQw2jyAUqwHHTw4Weob5ibZiY',
    currentId: '',
    currentAddress: '',
  }

  handleClick = (coord, idx) => {
    var latitude = coord.lat;
    var longitude = coord.lng;

    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + this.state.API_KEY)
      .then(res => res.json())
      .then(data => this.setState({ currentAddress: data.results[0].formatted_address }))
      .catch(err => console.log(err))

    this.setState({
      currentId: idx
    })
  }

  render() {
    const {listLocations} = this.props;

    return(
        <GoogleMap
        defaultCenter = {{lat: listLocations[0].lat, lng: listLocations[0].lng}}
        zoom = { 8 }
        //ref={(map) => map && map.fitBounds(this.props.bounds)}
        >
          
          {listLocations.map((coord,idx) => 
            <Marker key={idx} position={coord} label='view'
              onClick={()=>this.handleClick(coord, idx)} >

              {this.state.currentId === idx ?
                <InfoWindow onCloseClick={() => this.setState({currentId: -1})}>
                  <div>
                    <p>{this.state.currentAddress.split(", ")[0]}</p>
                    <p>{this.state.currentAddress.split(", ")[1]}, {this.state.currentAddress.split(", ")[2]}, {this.state.currentAddress.split(", ")[3]}</p>
                  </div>
                </InfoWindow> : null
              }
            </Marker>
          )}
          
        </GoogleMap>
      
    )
  }
}

GoogleMapExample = withGoogleMap(GoogleMapExample);



class PaperSheet extends React.Component {
  state = {
    API_KEY: 'AIzaSyC3A1scukBQw2jyAUqwHHTw4Weob5ibZiY',
    locationComponent: null,
    recommendComponent: null,
    mapComponent: null,
    originalLocation: null,
    isSaved: false,
  }

  componentDidMount() {
    const { assignment} = this.props;
    this.setState({
      originalLocation: assignment.locations[0] 
    }, () => {
      if (typeof assignment.locations[0] !== 'undefined') {
        this.load([assignment.locations[0]]) 
      }
    })
  }

  load = (listLocation) => {
    var current_locationData = {};
    current_locationData['id'] = listLocation[0].id;
    current_locationData['fullAddress'] = listLocation[0].fullAddress;
    current_locationData['duration'] = listLocation[0].duration;
    current_locationData['qaList'] = [];
    fetch(`/locations/searching/${listLocation[0].id}`).then(res => res.json())
    .then(data => {
      current_locationData['rate'] = data[0].rate === null ? 0 : data[0].rate;
      current_locationData['note'] = data[0].note === null ? '' : data[0].note;
    }).catch(err => console.log(err))

    var query = `/locations/canvasserAssignments/${listLocation[0].id}`;
    fetch(query).then(res => res.json())
    .then(locationQAlist => {
      //console.log(locationQAlist);
      locationQAlist.forEach(locationQAdata => {
        current_locationData['rate'] = locationQAdata.rate;
        current_locationData['note'] = locationQAdata.note;
        current_locationData['qaList'].push({
          question: locationQAdata.question,
          answer: locationQAdata.answer
        })
      })
    })

    var addressList = [];
    listLocation.forEach(location => addressList.push(location.fullAddress));
    var listCoordinates = this.getCoordList(addressList);

    this.setState({
      mapComponent: <GoogleMapExample
                        listLocations={listCoordinates}
                        containerElement={ <div style={{ height: `300px`, width: '100%' }} /> }
                        mapElement={ <div style={{ height: `100%` }} /> }
                    />
    }, () => {
      setTimeout(() => {
        this.renderLocation(current_locationData);
      }, 700)
      this.renderRecommend(current_locationData.fullAddress);
    })
  }

  ///// Use Geocoding API to convert address to longitude and latitude 
  //// to display markers of all selected locations on the map
  getCoordList = (selected) => {
    var listCoordinates = [];
    var i = 0;
    selected.forEach(fullAddr => {
      i += 1;
      var search_query = fullAddr.replace(/ /g, '+');
      
      // use API to fetch search result
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + search_query + '&key=' + this.state.API_KEY)
      .then(res => res.json())
      .then(data => {
        //console.log(data.results[0].geometry.location)
        listCoordinates.push(data.results[0].geometry.location)
      })
      .catch(err => console.log(err))     
    })
    while (i < selected.length) {}
    return listCoordinates;
  }

  displayNextLocation = (location) => {
    this.load([this.state.originalLocation, location]);
  }

  saveInfo = (toEditLocationInfo) => {
    console.log(toEditLocationInfo);

    // update rate and note
    var note = toEditLocationInfo.note === null ? '': toEditLocationInfo.note;
    note = note.replace(/ /g, '+');
    note = note.replace(/\r?\n/g, '%0D%0A');
    var query = `/locations/assignments/editRateNote/${toEditLocationInfo.id}/`;
    query += `?rate=${toEditLocationInfo.rate}&note=${note}`;
    fetch(query).then(res=>res.json()).catch(err => console.log(err));

    // update question answer
    toEditLocationInfo.qaList.forEach(qaObj => {
      var question = qaObj.question.replace(/ /g, '+');
      var answer = qaObj.answer.replace(/ /g, '+');
      query = `/locations/assignments/editQA/${toEditLocationInfo.id}/`;
      query += `?question=${question}&answer=${answer}`;
      fetch(query).then(res=>res.json()).catch(err => console.log(err));
    })

    this.setState({ isSaved: true }, () => this.load([toEditLocationInfo]))
    setTimeout(() => {
      this.setState({ isSaved: false })
    }, 1500)
  }

  handleNoteChange = (e, toEditLocationInfo) => {
    toEditLocationInfo.note = e.target.value;
  }

  handleQAChange = (e, toEditLocationInfo, question) => {
    var qaObj = toEditLocationInfo.qaList.find(qa => qa.question === question);
    if (typeof qaObj !== 'undefined') {
      qaObj.answer = e.target.value;
    }
  }

  renderLocation = (location) => {
      console.log(location)
      const {classes} = this.props;
      var toEditLocationInfo = JSON.parse(JSON.stringify(location));

      var displayLocation = 
      <div style={{marginBottom: '20px'}}>
        <Grid container spacing={8} alignItems="center">
          <Grid item>
              <IconButton disabled={true} aria-label="Location">
                <LocationOn color='secondary'/>
              </IconButton>
          </Grid>
          <Grid item>
            <strong>
              {location.fullAddress} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{color: '#A9A9A9'}} > Duration: {location.duration} mins </span> 
            </strong>
          </Grid>
        </Grid>
        {location.qaList.map((qa, idx) => {
          return (
            <div key={idx} style={{marginBottom: '15px'}}>
              <Typography variant='inherit'><strong>Question:</strong> {qa.question} </Typography>
              <Typography variant='inherit'><strong>Answer:</strong> {qa.answer} </Typography>
              <TextField 
                    onChange={(e) => this.handleQAChange(e, toEditLocationInfo, qa.question)}
                    defaultValue=''
                    label='Update answer here'
                    multiline={true}
                    style={{width: '90%', marginBottom: '5px'}} 
              />
        
            </div>
          )
        })}
        
        <Grid container >
          <Grid item xs={6} >
            <Grid container justify='center' >
              <Typography variant='inherit'><strong>Notes:</strong></Typography>
            </Grid>

            <Grid container justify='center' style={{marginBottom: '15px'}}>
              <Grid item>
                {
                  location.note === null ? null : 
                  location.note.split('\n').map((line, index) => {
                    return (
                      <Typography key={index}>
                        {line}
                      </Typography>
                    )
                  })
                }
              </Grid>
            </Grid>

            <Grid container justify='center' style={{marginBottom: '15px'}}>
              <TextField
                  onChange={(e) => this.handleNoteChange(e, toEditLocationInfo)}
                  defaultValue=''
                  label='Update notes here'
                  multiline={true}
                  style={{width: '90%'}}
                  rows={5} />
            </Grid>

            <Grid container alignItems='flex-end' justify='center' style={{marginBottom: '15px'}}>
              <Grid item>
                <Typography variant='inherit'> 
                  <strong>Rate:</strong> &nbsp;&nbsp;&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <ReactStars
                    count={5}
                    value={location.rate}
                    onChange={(rate) => {toEditLocationInfo.rate = rate}}
                    size={20}
                    color2={'#ffd700'} />
              </Grid>
            </Grid>
            
            {
              this.state.isSaved ? 
              <Grid container justify='center' style={{marginBottom: '15px'}}>
                <Typography style={{color: 'green'}}>Your information is saved!</Typography>
              </Grid>
              : null
            }

            <Grid container justify='center' style={{marginBottom: '15px'}}>
              <Button 
                onClick={() => this.saveInfo(toEditLocationInfo)}
                variant='contained'
                color='primary'
                className={classes.button}> Save info </Button>
            </Grid>
          </Grid>

          <Grid item xs={6} >
            {this.state.mapComponent}
          </Grid>
        </Grid>
      </div>
      
      setTimeout(() => {
        this.setState({
          locationComponent: displayLocation
        })
      }, 600)
  }

  changeRenderLocation = (location) => {
    this.setState({
      originalLocation: location,
    }, () => this.load([location]))
  }

  renderRecommend = (currentLocation) => {
    const { assignment} = this.props;

    // algorithm to find next recommended location and remaining locations list
    var remainLocations = [];
    var recommendLocation = null;
    var i = 0;
    var j = 0;

    for (i=0; i < assignment.locations.length; i++) {
      var locationData = assignment.locations[i];
      if (locationData.fullAddress !== currentLocation) {
        remainLocations.push(locationData);
      } else {
        if (i !== assignment.locations.length - 1) {
          recommendLocation = assignment.locations[i+1];
        } else {
          recommendLocation = assignment.locations[0];
        }
        break;
      }
    }

    if (recommendLocation !== assignment.locations[0]) {
      for (j=i+2; j < assignment.locations.length; j++) {
        remainLocations.push(assignment.locations[j]);
      }
    } else {
      remainLocations.splice(0,1);
    }
    
    j = 0;
    // render recommendation component
    this.setState({
      recommendComponent: 
      <Grid container>
        <Grid item xs={6} >
          <strong>Recommended next location:</strong> <br/><br/>
          {
            assignment.locations.length > 1 ?
            <div>
                <Typography> {recommendLocation.fullAddress} </Typography> <br/>
                <Tooltip title="Display location">
                  <Button onClick={() => this.displayNextLocation(recommendLocation)} variant='extendedFab' color='secondary' aria-label="Location" style={{marginRight: '10px'}}>
                    <LocationOn /> Show location
                  </Button>
                </Tooltip>

                <Tooltip title="Go to next location">
                  <Button onClick={() => this.changeRenderLocation(recommendLocation)} variant='extendedFab' color='primary' aria-label="Go">
                    <Done /> Go
                  </Button>
                </Tooltip>
            </div>
            : <div> <Typography> Not available </Typography> </div>
          }
          
        </Grid>

        <Grid item xs={6} >
          <strong>Other locations:</strong>
          {
            assignment.locations.length > 1 ?
            <List>
              {remainLocations.map((location, idx) => {
                j++;
                return (
                  <ListItem key={idx} style={{width: '100%', backgroundColor: (j%2===0) ? '#F4F4F4' : '#F9E5F7' }}>
                    <ListItemText 
                        primary={<Typography>{location.fullAddress}<br/></Typography>} 
                    />

                    <Tooltip title="Display location">
                      <IconButton onClick={() => this.displayNextLocation(location)} 
                            color='secondary'> <LocationOn/> </IconButton>
                    </Tooltip>

                    <Tooltip title="Go to next location">
                      <IconButton
                          onClick={() => this.changeRenderLocation(location)}
                          color='primary'> <Done/> 
                      </IconButton>
                    </Tooltip>

                  </ListItem>
                )
              })}
            </List>
            : <div><br/> <Typography> Not available </Typography> </div>
          }
          
        </Grid>
      </Grid>
    })
  }

  render() {
    const {classes, assignment} = this.props;

    return (
      <Paper className={classes.root} elevation={1} style={{marginBottom: '10px'}}>
        <div justify='center'>
          <Typography variant='headline'>
            <strong>Task {assignment.taskName}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {assignment.date}
          </Typography>

          {this.state.locationComponent}
          {this.state.recommendComponent}
        </div>
      </Paper>
    )
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

PaperSheet = withStyles(paper_styles)(PaperSheet);


class CanvasserAssignments extends React.Component {
  state = {
    currentUsername: this.props.match.params.username,
    canvasserInfo: null,
    canvasserData: null,
    mainComponent: null,
  }

  componentDidMount() {
    // load canvasser info
    const {currentUsername} = this.state;
    var query = `/users/${currentUsername}`;
    fetch(query).then(res => res.json())
    .then(canvasser => {
      this.setState({
        canvasserInfo: canvasser[0]
      }, () => this.componentInit()) 
    })
    .catch(err => console.log(err))
  }

  renderMainComponent = () => {
    this.setState({
      mainComponent: <div style={{margin: '0 auto 0 auto'}} >
        <List>
          {
            this.state.canvasserData === null ? null :
            <div>
              {
                this.state.canvasserData.assignments.length === 0 ? <div>No assignments yet!</div> :
                this.state.canvasserData.assignments.map((assignment, idx) => {
                  if (assignment.locations.length === 0 ) {
                    //console.log(assignment)
                    // remove assigned date to make it free
                    var query = `/tasks/unassign/${this.state.canvasserInfo.id}/${assignment.taskName}`;
                    fetch(query).then(res => res.json()).catch(err => console.log(err))

                    return <div key={idx}> No assignments yet!</div>
                  } else {            
                    return (
                      <PaperSheet key={idx} assignment={assignment} />
                    )
                  }
                })
              }
            </div>
          }
          
        </List>
      </div>
    })
  }


  componentInit = () => {
    const {canvasserInfo} = this.state;
    var info = {};
    info['userInfo'] = canvasserInfo;
    var listAssignment = [];

    var query = `/users/canvasser/assignments/${canvasserInfo.id}`;
    fetch(query).then(res => res.json())
    .then(data => {
      //console.log('data: ', data)
      
      data.forEach(task => {
        var assignment = {}
        if (task.taskId !== null) {
          //console.log(task)
          assignment['date'] = task.month + '/' + task.date + '/' + task.year;
          assignment['taskName'] = task.taskId;
          assignment['locations'] = [];

          var query = `/users/canvasser/tasks/${task.taskId}`;
          fetch(query).then(res => res.json())
          .then(taskInfo => {
            taskInfo.forEach(locationInfo => {
              var locationDict = {};
              //console.log(locationInfo)
              fetch(`/locations/searching/${locationInfo.locationId}`)
              .then(res => res.json())
              .then((location) => {
                locationDict['id'] = location[0].id;
                locationDict['fullAddress'] = location[0].fullAddress;
                locationDict['duration'] = location[0].duration;
                locationDict['note'] = location[0].note === null ? '':location[0].note;
                locationDict['rate'] = location[0].rate === null ? 0:location[0].rate;
                locationDict['qaList'] = [];

                var sql = `/locations/search?locationId=${locationInfo.locationId}`;
                fetch(sql).then(res => res.json())
                .then(locationList => {
                  locationList.forEach((locationQA) => {
                    var qa = {}
                    qa['question'] = locationQA.question;
                    qa['answer'] = locationQA.answer;
                    locationDict['qaList'].push(qa);
                  })
                }).catch(err => console.log(err))
              }).catch(err => console.log(err))
              
              setTimeout(() => {
                assignment['locations'].push(locationDict);
              }, 1000)

            })
          }).catch(err => console.log(err))
          setTimeout(() => {
            listAssignment.push(assignment);  
          }, 1200);
        }
      })
    })
    .catch(err => console.log(err))

    setTimeout(() => {
      info['assignments'] = listAssignment;
    },1000)

    setTimeout(() => {
      this.setState({
        canvasserData: info
      }, () => {
        this.renderMainComponent()
      })
    },1500)
  }

  render() {
    return (
      <div style={style}>
        <Canvasser username={this.props.match.params.username} />
        <br/><br/>
        <div className="canvasserlist" style={{margin: '0 15% 30px 15%'}} >
          <h1>Canvasser Assignments</h1> <br/>
          {this.state.mainComponent}
        </div>
      </div>
    )
  }
}

export default CanvasserAssignments;