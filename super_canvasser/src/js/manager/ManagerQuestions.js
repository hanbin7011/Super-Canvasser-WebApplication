import React from 'react';
import Manager from './Manager';
import '../../css/App.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {QuestionAnswer} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import {LocationOn} from '@material-ui/icons';


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

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

class PaperSheet extends React.Component {
  state = {
    isDelete_open: false,
    isUpdate_open: false,
    edit_question: '',
  }

  openUpdate_modal = () => {
    this.setState({isUpdate_open: true})
    const { qa } = this.props;
    this.setState({
      edit_question: qa.question
    })
  }

  handleTFChange = (event) => {
    //console.log(event.target.value);
    this.setState({ edit_question: event.target.value })
  }

  handleUpdate = () => {
    //console.log(this.state.edit_question);
    const { qa, locationId } = this.props;
    var old_question = qa.question.replace(/ /g, '+');
    var new_question = this.state.edit_question.replace(/ /g, '+');

    var query = `/locations/${locationId}/questions/update?oldQ=${old_question}&newQ=${new_question}`;
    // perform query update
    console.log(query);
    fetch(query).then(res => {
      res.json();
      console.log('Update question successfully!');
    })
    .catch(err => console.log(err))
    
    this.setState({ isUpdate_open: false })
    this.props.reload();
  }

  handleDelete = () => {
    const { qa, locationId } = this.props;
    var query = `/locations/${locationId}/questions/delete?question=${qa.question}`;
    fetch(query).then(res => {
      res.json();
      console.log('Delete question successfully!');
    })
    .catch(err => console.log(err))
    
    this.setState({ isDelete_open: false })
    this.props.reload();
  }

  render() {
    const { classes, qa } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
            <div justify='center'>
              <Typography>
                <strong>Question:</strong> {qa.question}
              </Typography>
              <Typography>
                <strong>Answer:</strong> {qa.answer}
              </Typography>
            </div>   
          <Button 
            onClick={this.openUpdate_modal}
            color="primary" 
            className={classes.button}> Update </Button>
          <Button 
            onClick={() => this.setState({isDelete_open : true})} 
            color="primary" 
            className={classes.button}> Delete </Button>
        </Paper>
        {/* ---------------------- modal for update question -------------------------- */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isUpdate_open}
          onClose={() => this.setState({isUpdate_open : false})}
        >
            <div style={getModalStyle()} className={classes.paper}>
                <Grid container justify='center'>
                  <Typography variant='display2' id="modal-title">
                    Update question
                  </Typography>
                </Grid>
                <Grid container justify='center'>
                  <TextField
                      onChange={this.handleTFChange}
                      className = 'question'
                      label='Enter question'
                      defaultValue={qa.question}
                      style={{minWidth: '80%'}} />
                </Grid>
                
                <Grid container justify='center'>
                  <Button onClick={this.handleUpdate} variant="contained" color="primary" style={{marginTop: '30px', marginRight: '15px'}} > Update </Button>
                  <Button onClick={()=>this.setState({isUpdate_open:false})} variant="contained" color="default" style={{marginTop: '30px'}} > Cancel </Button>
                </Grid>
            </div>
        </Modal>

        {/* ---------------------- modal for delete question -------------------------- */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isDelete_open}
          onClose={() => this.setState({isDelete_open : false})}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Grid container justify='center' >
              <Typography variant='subheading'>
                Are you sure you want to delete this question?
              </Typography>
            </Grid>
            <br/>
            <Grid container justify='center'>
              <div><br/><Button 
                            onClick={this.handleDelete} 
                            variant="contained" 
                            color="primary" 
                            style={{marginTop:'15px', marginRight: '8px'}}> Yes, delete </Button></div>
              <div><br/><Button 
                            onClick={() => this.setState({isDelete_open: false})} 
                            variant="contained" 
                            color="default" 
                            style={{marginTop:'15px'}}> No, cancel </Button>
              </div>
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

PaperSheet = withStyles(paper_styles)(PaperSheet);



class LocationRow extends React.Component {
  state = {
    locationId: this.props.locationData.locationId,
    isOpen: false,
    isChanged: false,
    addSuccess: false,
    isFilled: true,
    questionTobeAdd: '',
    qaComponent: null,
  }

  addQuestion = () => {
    var question = this.state.questionTobeAdd;
    if (question.length === 0) {
      console.log('Please enter a question!');
      this.setState({isFilled: false, addSuccess: false})
      setTimeout(() => {
        this.setState({ addSuccess: false,  })
      }, 2000);
      return;
    }
    this.setState({isFilled: true, addSuccess: true}, () => {
      question = question.replace(/ /g, '+');
      var query = '/locations/' + this.state.locationId + '/questions/add';
      query += `?question=${question}&answer=`;
      // perform query add question
      fetch(query).then(res => {
        res.json();
        console.log('Add question successfully');
      })
      .catch(err => console.log(err));
      this.props.reload();
    })
    setTimeout(() => {
      this.setState({ isOpen: false, addSuccess: false,  questionTobeAdd: ''})
    }, 1500);

  }

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleTFChange = (event) => {
    this.setState({questionTobeAdd: event.target.value})
  }

  render() {
    const { locationData, classes} = this.props;
    
    return (
      <ExpansionPanel >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{flexBasis: '5%'}}>
            <LocationOn color='secondary' />
          </div>
          <div style={{flexBasis: '70%'}}>
            <Typography variant='subheading' style={{color: '#483D8B'}}> {locationData.street}, {locationData.unit}</Typography>
            <Typography variant='subheading' style={{color: '#483D8B'}}> {locationData.city}, {locationData.state} {locationData.zipcode}, {locationData.country}</Typography>
          </div>
          <div style={{flexBasis: '20%'}}><Typography style={{color: '#A9A9A9'}}> duration: {locationData.duration} mins</Typography></div>
        </ExpansionPanelSummary>
        
        <ExpansionPanelDetails>
          <div style={{margin: '0 auto 0 auto'}}>
            <List>
              {locationData.qaList.map((data,idx) => {
                return <PaperSheet key={idx} qa={data} locationId={locationData.locationId} reload={this.props.reload}/>
              })}
              <Button 
                onClick={() => this.setState({isOpen: true, addSuccess: false, isFilled: true}) }
                variant="contained" 
                color="primary" 
                style={{marginTop: '10px'}} >
                + Add question
              </Button>
            </List>
            {/*--------------------- modal for add question --------------------- */}
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.isOpen}
              onClose={this.handleClose}
            >
              <div style={getModalStyle()} className={classes.paper}>
                <Grid container justify='center'>
                  <Typography variant='display2' id="modal-title">
                    Add new question
                  </Typography>
                </Grid>
                <Grid container justify='center'>
                  <TextField
                      onChange={this.handleTFChange}
                      className = 'question'
                      label='Enter question'
                      style={{minWidth: '80%'}} />
                </Grid>
                <Grid container justify='center'>
                  {this.state.addSuccess ?
                    <FormHelperText id="component-success-text">New question just added successfully!</FormHelperText> :null}
                  {this.state.isFilled ? 
                    null : <FormHelperText id="component-error-text">Please fill in the question!</FormHelperText> }
                </Grid>
                <Grid container justify='center'>
                  <Button onClick={this.addQuestion} variant="contained" color="primary" style={{marginTop: '30px', marginRight: '15px'}} > Add </Button>
                  <Button onClick={()=>this.setState({isOpen:false})} variant="contained" color="default" style={{marginTop: '30px'}} > Close </Button>
                </Grid>
              </div>
            </Modal>
          </div>
        </ExpansionPanelDetails>
        
      </ExpansionPanel> 
    )
  }
}

LocationRow = withStyles(paper_styles)(LocationRow);

class ManagerQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locationsQA: [],
      locationComponent: [],
    }
  }

  componentWillMount() {
    this.reload();
  }

  reload = () => {
    this.load();
    setTimeout(() => {
      this.startRender();
    }, 1000)
  }

  startRender = () => {
    //console.log(this.state.locationsQA);
    var locationQA = [];
    this.state.locationsQA.forEach((locationData, idx) => {
      var row = <LocationRow key={idx} locationData={locationData} reload={this.reload}/>
      locationQA.push(row);
    })
    this.setState({
      locationComponent: locationQA
    })
  }

  
  load = () => {
    var locationsQA = [];
  
    fetch('/locations')
      .then(res => res.json())
      .then(locations => {
        this.setState({ locations: locations }, () => {
          locations.forEach((location, idx) => {
            // perform search all questions and answer at this location
            var query = `/locations/search?locationId=${location.id}`;
            
            var qaList = [];
            fetch(query).then(res => res.json())
            .then(data => {
              data.forEach(qa => {
                qaList.push({ question: qa.question, answer: qa.answer })
              })
            }).catch(err => console.log(err));

            locationsQA.push({
              locationId: location.id,
              fullAddress: location.fullAddress,
              street: location.street,
              unit: location.unit,
              city: location.city,
              state: location.state,
              zipcode: location.zipcode,
              country: location.country,
              duration: location.duration,
              qaList: qaList
            })
          })
        })
      })
      .catch(err => console.log(err))

    this.setState({
      locationsQA: locationsQA
    })
  }

  render() {
    return (
      <div style={style}>
        <Manager username={this.props.match.params.username}/>
        <div className="questionList" style={{margin: '30px 15% 30px 15%'}}>
          <Grid container alignItems='flex-end' justify='center' >
            <Grid item style={{marginRight: '15px'}}>
              <QuestionAnswer/>
            </Grid>
            <Grid item>
              <h1>Questions details</h1>
            </Grid>
          </Grid>
          
          <Grid container justify='center' style={{marginBottom: '20px'}} >
            <Grid item>
              <Typography> Click on each location to view its collection of questions.</Typography>
            </Grid>
          </Grid>
          {this.state.locationComponent}           
        </div>
      </div>
    );
  };
}

export default ManagerQuestions;