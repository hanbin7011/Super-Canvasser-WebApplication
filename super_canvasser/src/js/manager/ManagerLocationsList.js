import React from 'react';
import Manager from './Manager';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TableLocations from './TableLocations';
import TextField from '@material-ui/core/TextField';
import {AddLocation , ListAlt} from '@material-ui/icons';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ReactStars from 'react-stars';
import {Doughnut} from 'react-chartjs-2';


window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};


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
    return(
        <GoogleMap
        defaultCenter = {{lat: 37.090240, lng: -95.712891}}
        zoom = { 8 }
        ref={(map) => map && map.fitBounds(this.props.bounds)}
        >
          
          {this.props.listLocations.map((coord,idx) => 
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


const paper_styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});


class PaperSheet extends React.Component {
  render() {
    const {classes, qa} = this.props;
    return (
      <Paper className={classes.root} elevation={1}>
        <div justify='center'>
          <Typography>
            <strong>Question:</strong> {qa.question}
          </Typography>
          <Typography>
            <strong>Answer:</strong> {qa.answer}
          </Typography>
        </div>
      </Paper>
    )
  }
}

PaperSheet = withStyles(paper_styles)(PaperSheet);


class ManagerLocationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input_street: '',
      input_unit: '',
      input_city: '',
      input_state: '',
      input_country: '',
      input_zipcode: '',
      input_duration: '',

      locationTable: null,
      locationMap: null,

      selectedLocations: [],
      deleteLocation_list: [],

      resultComponent: null,
      bounds: null,

      multipleLocationStr: '',
      params: {}
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

    setTimeout(() => {
      this.load()
    }, 500);
  }

  load = () => {
    this.setState({
      bounds: new window.google.maps.LatLngBounds()
    }, () => {
      this.loadLocationList() 
      this.loadMap()
    })
  }

  loadResult = (locationResList) => {
    var results = []
    var qaRateList = [];

    locationResList.forEach((location, idx) => {
      var query = `/locations/search?locationId=${location.id}`;
      var qaList = [];
      var unanswered = 0;
      var answered = 0;

      fetch(query).then(res => res.json())
      .then(data => {
        data.forEach(qa => {
          qaList.push({ question: qa.question, answer: qa.answer })
          if (qa.answer === '') {
            unanswered += 1;
          } else {
            answered += 1;
          }
        })
        qaRateList.push({
          unanswered: parseFloat((unanswered/(unanswered+answered)).toFixed(2)),
          answered: parseFloat((answered/(unanswered+answered)).toFixed(2))
        })
      }).catch(err => console.log(err));

      setTimeout(() => {
        console.log(qaRateList[idx]);
        var res = 
        <ExpansionPanel key={idx}>

          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{flexBasis: '70.33%'}}>
              <Typography style={{color: '#483D8B'}}> {location.street}, {location.unit} </Typography>
              <Typography style={{color: '#483D8B'}}> {location.city}, {location.state} {location.zipcode}, {location.country}</Typography>
            </div>
            <div style={{flexBasis: '33.33%'}}><Typography style={{color: '#A9A9A9'}}> duration: {location.duration} mins</Typography></div>
          </ExpansionPanelSummary>
          
          <ExpansionPanelDetails>
            <div style={{margin: '0 auto 0 auto'}}>
              <List>
                {qaList.map((qa,idx) => {
                  return <PaperSheet key={idx} qa={qa} location={location} />
                })}
              </List>
              <Grid container justify='center'>
                <Grid item>
                  <Typography>
                    <strong>Notes: </strong>
                  </Typography>
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

              <Grid container justify='center' alignItems='center'>
                <Grid item>
                  <Typography>
                    <strong>Rate: </strong> {location.rate} &nbsp;&nbsp;&nbsp;
                  </Typography>
                </Grid>
                <Grid item>
                  <ReactStars
                        count={5}
                        value={location.rate}
                        edit={false}
                        size={20}
                        color2={'#ffd700'} />
                </Grid>
              </Grid>

              {
                qaList.length === 0 ? null :
                <Grid container justify='center' alignItems='center'>
                  <Grid item>
                    <Doughnut
                      width={500}
                      height={200}
                      data={{
                        labels: [
                          `Unanswered` ,
                          `Answered` 
                        ],
                        datasets: [{
                          data: [qaRateList[idx].unanswered, qaRateList[idx].answered],
                          backgroundColor: [
                          '#FF6384',
                          '#36A2EB',
                          ],
                          hoverBackgroundColor: [
                          '#FF6384',
                          '#36A2EB',
                          ]
                        }]
                      }}
                    />
                  </Grid>
                </Grid>
              }
              
              </div>
          </ExpansionPanelDetails>

        </ExpansionPanel>
      
        results.push(res);
      }, 1000);
    })

    setTimeout(() => {
      this.setState({
        resultComponent: <Grid item xs={12} >
          <Grid container spacing={8} alignItems="flex-end" style={{marginTop: '70px'}}>
            <Grid container spacing={8} alignItems="flex-end" justify='center' >
              <Grid item> <ListAlt/></Grid>
              <Grid item> <h1>Results</h1></Grid>
            </Grid>
          </Grid>
          <Grid container spacing={8} justify='center' style={{marginTop:'20px', marginBottom: '20px'}}>
            <div style={{width: '70%'}}>
              {results}
            </div>
          </Grid>
        </Grid>
      })
    }, 2000)
  }

  deleteLocation = (deleteLocation_list) => {
    this.setState({
      deleteLocation_list: deleteLocation_list
    }, () => {
      deleteLocation_list.forEach(location => {
        //console.log('to be del: ', location);
        var fullAddress = location.fullAddress.replace(/ /g, '+');
        var street = location.street.replace(/ /g, '+');
        var city = location.city.replace(/ /g, '+');
        var unit = location.unit.replace(/ /g, '+');
        var state = location.state.replace(/ /g, '+');
        var zipcode = location.zipcode;
        var country = location.country.replace(/ /g, '+');

        fetch(`/locations/delete?fullAddress=` +
           `${fullAddress}&street=${street}`
           + `&unit=${unit}`
           + `&city=${city}`
           + `&state=${state}`
           + `&zipcode=${zipcode}`
           + `&country=${country}`)
        .then(res => {
          res.json();
          console.log('Delete location done!');
        })
        .catch(err => console.log(err))
      })
      this.setState({selectedLocations : []}, () => {
        this.setState({resultComponent: null})
        this.loadLocationList();
      });
    })
  }


  updateLocation = (location) => {
    console.log('update: ', location);

    var fullAddress = location.fullAddress.replace(/ /g, '+');
    var street = location.street.replace(/ /g, '+');
    var unit = location.unit.replace(/ /g, '+');
    var city = location.city.replace(/ /g, '+');
    var state = location.state.replace(/ /g, '+');
    var zipcode = location.zipcode;
    var country = location.country.replace(/ /g, '+');
    var duration = location.duration;
    var rate = location.rate;
    var note = location.note;

    fetch(`/locations/edit?id=${location.id}` 
            + `&fullAddress=${fullAddress}`
            + `&street=${street}`
            + `&unit=${unit}`
            + `&city=${city}`
            + `&state=${state}`
            + `&zipcode=${zipcode}`
            + `&country=${country}`
            + `&rate=${rate}`
            + `&note=${note}`
            + `&duration=${duration}`)
      .then(res => {
        res.json();
        console.log('Update successfully!');
      })
      .catch(err => console.log(err))

    this.setState({resultComponent: null})
    this.loadLocationList();
  }

  loadLocationList = () => {
    fetch('/locations')
      .then(res => res.json())
      .then(locations => {
        var list = <TableLocations 
                      listLocation={locations} 
                      selectedLocations={this.set_selectedLocations} 
                      display={this.displayLocations} 
                      deleteLocation={this.deleteLocation}
                      updateLocation={this.updateLocation} 
                      viewResults={this.loadResult} />

        this.setState({
          locationTable: list
        }) 
      })
      .catch(err => console.log(err)) 
  }

  loadMap = () => {
    this.setState({
      locationMap: <GoogleMapExample
                    listLocations={this.state.selectedLocations}
                    bounds={this.state.bounds}
                    containerElement={ <div style={{ height: `420px`, width: '100%' }} /> }
                    mapElement={ <div style={{ height: `100%` }} /> }
                  />
    })
  }


  set_selectedLocations = (list) => {
    this.setState({
      selectedLocations: list
    }, () => {
      this.loadMap()
    })
  }

  displayLocations = (displayList) => {
    displayList.forEach(location => {
      this.state.bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
    })
    this.setState({
      selectedLocations: displayList,
    }, () => {
      this.loadMap()
    })
  }

  handleTFchange = (event) => {
    if (event.target.id === 'street') {
      this.setState({input_street: event.target.value})
    } else if (event.target.id === 'unit') {
      this.setState({input_unit: event.target.value})
    } else if (event.target.id === 'city') {
      this.setState({input_city: event.target.value})
    } else if (event.target.id === 'state') {
      this.setState({input_state: event.target.value})
    } else if (event.target.id === 'zipcode') {
      this.setState({input_zipcode: event.target.value})
    } else if (event.target.id === 'country') {
      this.setState({input_country: event.target.value})
    } else if (event.target.id === 'duration') {
      this.setState({input_duration: event.target.value})
    }
  }

  handleAddLocation = () => {
    var fullAddress = this.state.input_street + ', '
                        + this.state.input_city + ', '
                        + this.state.input_unit + ', '
                        + this.state.input_state + ', '
                        + this.state.input_zipcode + ', '
                        + this.state.input_country;
    fullAddress = fullAddress.replace(/ /g, '+');
    //console.log(fullAddress);
    var street = this.state.input_street.replace(/ /g, '+');
    var unit = this.state.input_unit.replace(/ /g, '+');
    var city = this.state.input_city.replace(/ /g, '+');
    var state = this.state.input_state.replace(/ /g, '+');
    var zipcode = parseInt(this.state.input_zipcode, 10);
    var country = this.state.input_country.replace(/ /g, '+');
    var duration = parseInt(this.state.input_duration, 10);


    fetch(`/locations/add?fullAddress=` +
           `${fullAddress}&street=${street}`
           + `&unit=${unit}`
           + `&city=${city}`
           + `&state=${state}`
           + `&zipcode=${zipcode}`
           + `&country=${country}`
           + `&duration=${duration}`)
    .then(res => {
      res.json();
      console.log('Add location done!');
    })
    .catch(err => console.log(err))
    this.loadLocationList();
  }

  handleMultipleLocationChange = (e) => {
    this.setState({
      multipleLocationStr: e.target.value
    })
  }

  handleAddMultiple_location = () => {
    var {multipleLocationStr} = this.state;
    multipleLocationStr.split("\n").forEach((locationAddress) => {
      var street = '';
      var unit = '';
      var city = '';
      var state = '';
      var zipcode = '';
      var country = 'USA';

      var location_info = locationAddress.split(",");
      location_info.forEach((data, idx) => {
        if (idx === 0) {
          street += data.trim();
        } else if (idx === 1) {
          street += ' ' + data.trim();
        } else if (idx === 2) {
          unit = data.trim();
        } else if (idx === 3) {
          city = data.trim();
        } else if (idx === 4) {
          state = data.trim();
        } else if (idx === 5) {
          zipcode = data.trim();
        }
      })
      var fullAddress = locationAddress.replace(/ /g, '+');
      fullAddress = fullAddress.replace("#",'');
      street = street.replace(/ /g, '+');
      unit = unit.replace(/ /g, '+');
      unit = unit.replace("#",'');
      city = city.replace(/ /g, '+');
      state = state.replace(/ /g, '+');
      zipcode = parseInt(zipcode, 10);
      var duration = this.state.params.visitDuration;

      fetch(`/locations/add?fullAddress=` +
            `${fullAddress}&street=${street}`
            + `&unit=${unit}`
            + `&city=${city}`
            + `&state=${state}`
            + `&zipcode=${zipcode}`
            + `&country=${country}`
            + `&duration=${duration}`)
      .then(res => {
        res.json();
        console.log('Add location done!');
      })
      .catch(err => console.log(err))
    })
    this.loadLocationList();
  }

  render() {
    return (
      <div style={style}>
        <Manager username={this.props.match.params.username}/>
        <br/>

        <div className='locationlist' style={{margin: '0 3.5% 30px 3.5%'}}>
          <Grid container justify='center'>
            <Grid item xs={7} style={{marginRight: '20px'}}>
              <div className="manager-location-list">
                <br/>
                <h1>Locations list</h1>
                {this.state.locationTable}
              </div>
            </Grid>
            <Grid item xs={4} >
              <div className='manager-map'>
                <br/> <h1>Map</h1> <br/>
                {this.state.locationMap}
              </div>
            </Grid>
          </Grid>                    

          <Grid container justify='center'>
            <Grid item xs={12} style={{marginRight: '0 auto 0 auto'}}>
              <Grid container spacing={8} alignItems="flex-end" style={{marginTop: '40px'}}>
                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item> <AddLocation/></Grid>
                  <Grid item> <h1>Add location</h1></Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>Street:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='street'
                          className = 'street'
                          label='Enter street'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>Unit:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='unit'
                          className = 'unit'
                          label='Enter unit info'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>City:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='city'
                          className = 'city'
                          label='Enter city'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>
                
                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>State:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='state'
                          className = 'state'
                          label='Enter state'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>
                
                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>Zip code:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='zipcode'
                          className = 'zipcode'
                          label='Enter zipcode'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>Country:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='country'
                          className = 'country'
                          label='Enter country'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Grid item xs={3}>Visit duration:</Grid>
                  <Grid item xs={6}>
                    <TextField
                          id='duration'
                          className = 'duration'
                          label='Enter duration'
                          style={{minWidth: '100%'}}
                          onChange={this.handleTFchange} />
                  </Grid>
                </Grid>
                
                <Grid container spacing={8} alignItems="flex-end" justify='center' >
                  <Button onClick={this.handleAddLocation} variant="contained" color="primary" style={{marginTop: '30px'}} > Add new location </Button>
                </Grid>
              </Grid>
              
            </Grid>

            <Grid container spacing={8} alignItems="flex-end" justify='center' style={{marginTop: '50px'}} >
              <Grid item> 
                  <h1>Add multiple locations together</h1>
              </Grid>
            </Grid>

            <Grid container spacing={8} alignItems="flex-end" justify='center' >
              <Grid item> 
                <Typography variant='caption'> Each line contains a location address. </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={8} justify='center' >
                <TextField
                    label='Add multiple locations here'
                    onChange={this.handleMultipleLocationChange}
                    multiline={true}
                    style={{width: '50%'}}
                    rows={5} />
            </Grid>

            <Grid container spacing={8} alignItems="flex-end" justify='center' >
              <Button onClick={this.handleAddMultiple_location} variant="contained" color="primary" style={{marginTop: '30px'}} > Add </Button>
            </Grid>

            {this.state.resultComponent}
          </Grid>
        </div>
      </div>
    );
  };
}

export default ManagerLocationsList;

