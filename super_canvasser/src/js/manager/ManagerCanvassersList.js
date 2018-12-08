import React from 'react';
import Manager from './Manager';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import SelectFreeDateAndTask from './SelectFreeDateAndTask';
import Avatar from '@material-ui/core/Avatar';

const style = {
  backgroundColor: '#ffffff',
  position: 'absolute',
  minHeight: '100%',
  minWidth: '100%',
};

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
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

const avatar_styles = theme => ({
  purpleAvatar: {
    color: '#fff',
    padding: 5,
  }
})

class PaperSheet extends React.Component {
  state = {
    isDelete_open: false
  }

  handleDelete = () => {
    console.log('delete assignment');
    const {canvasserId, assignment} = this.props;
    const taskId = assignment.taskName;
  
    var query = `/tasks/unassign/${canvasserId}/${taskId}`;
    fetch(query).then(res => {
      res.json();
      console.log('Delete assignment');
    })
    .catch(err => console.log(err))
    this.setState({ isDelete_open: false })
    this.props.reload();
  }

  render() {
    const {classes, assignment} = this.props;

    return (
      <div>
        {
          assignment.locations.length === 0 ? null :
          <Paper className={classes.root} elevation={1}>

            <div justify='center'>
              <Typography variant='headline'>
                <strong>Task {assignment.taskName}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {assignment.date}
              </Typography>
              
              {assignment.locations.map((locationData, index) => {
                //console.log(locationData);
                return (
                <div key={index}>
                  <Typography><strong style={{color: '#DC143C'}}>Location:</strong> {locationData.fullAddress} &nbsp;&nbsp;&nbsp; <span style={{color: '#A9A9A9'}} > Duration: {locationData.duration} mins </span> </Typography>
                  {locationData.qaList.map((qa, idx) => {
                    return (
                      <div key={idx} style={{marginBottom: '15px'}}>
                        <Typography><strong>Question:</strong> {qa.question} </Typography>
                        <Typography><strong>Answer:</strong> {qa.answer} </Typography>
                      </div>
                    )
                  })}
                </div>
                )
              })}
    
              <Button 
                onClick={() => this.setState({isDelete_open : true})} 
                color="primary" 
                className={classes.button}> Unassign </Button>
    
                {/* ---------------------- modal for delete assignments -------------------------- */}
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.isDelete_open}
                  onClose={() => this.setState({isDelete_open : false})}
                >
                  <div style={getModalStyle()} className={classes.paper}>
                    <Grid container justify='center' >
                      <Typography variant='subheading'>
                        Are you sure you want to delete this canvas assignment?
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
          </Paper>
        }
      </div>
    )
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

PaperSheet = withStyles(paper_styles)(PaperSheet);



class ManagerCanvassersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvassers: [],
      unassignTasks: [],
      dataIsFetched: false,
      mainComponent: null,
    }
  }
  
  componentDidMount() {
    this.init();
  }

  init = () => {
    // get all unassigned tasks
    fetch('/tasks/unassigned').then(res => res.json())
    .then(unassigned => {
      this.setState({unassignTasks: unassigned})
    })
    .catch(err => console.log(err))
    
    setTimeout(() => {
      this.componentInit();
    }, 900)
  }

  reloadAfterAssign = (data) => {
    this.init();
  }

  renderMainComponent = () => {
    const {classes} = this.props;
    const {canvassers} = this.state;

    this.setState({
      mainComponent: <div style={style}>
      <Manager username={this.props.match.params.username}/>
      <br/><br/>
      <div className="canvasserlist" style={{margin: '0 15% 30px 15%'}} >
        <h1>Canvasser Assignments</h1> <br/>
        <Typography>Canvas assignments for each canvasser (including tasks with corresponding date and set of locations along with questions).</Typography>
        <br/><br/>
        
        {canvassers.map((canvasser, idx) => {
            var assignList = canvasser.assignments;
            var unassignList = canvasser.unassignments;

            return (
              <ExpansionPanel key={idx}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div style={{flexBasis: '5%', marginRight: '20px'}}>
                      <Avatar className={classes.purpleAvatar} >
                        <div> 
                          {canvasser.userInfo.firstName.substr(0,1)}{canvasser.userInfo.lastName.substr(0,1)}
                        </div>
                      </Avatar>
                  </div>
                  <div style={{flexBasis: '40%'}}>
                    <Typography variant='subheading' style={{color: '#483D8B'}}> {canvasser.userInfo.firstName} {canvasser.userInfo.lastName}</Typography>
                    <Typography variant='subheading' style={{color: '#A9A9A9'}}> @{canvasser.userInfo.username} | {canvasser.userInfo.role} </Typography>
                  </div>
                  <div style={{flexBasis: '50%'}}>
                    <Typography style={{color: '#A9A9A9'}}> Email: {canvasser.userInfo.email} </Typography>
                    <Typography style={{color: '#A9A9A9'}}> Phone number: {canvasser.userInfo.phone} </Typography>
                  </div>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                  <div style={{margin: '0 auto 0 auto'}} >
                    <List>
                      {assignList.map((assignment, idx) => {
                        if (assignment.locations.length === 0) {
                          //console.log(canvasser.userInfo);
                          // remove assigned date to make it free
                          var query = `/tasks/unassign/${canvasser.userInfo.id}/${assignment.taskName}`;
                          fetch(query).then(res => res.json()).catch(err => console.log(err))
                          this.componentInit();
                          return null;
                        
                        } else {
                          return (
                            <PaperSheet key={idx} assignment={assignment} canvasserId={canvasser.userInfo.id} reload={this.init} />
                          )
                        }
                      })}
                    </List>
                    <SelectFreeDateAndTask 
                        canvasserId={canvasser.userInfo.id}
                        unassignDates={unassignList} 
                        unassignTasks={this.state.unassignTasks} 
                        reloadAfterAssign={this.reloadAfterAssign} />
                    

                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
        })}
      </div>
    </div>
    })
  }

  componentInit = () => {
    fetch('/users/role/canvasser').then(res => res.json())
    .then(canvassers => {
      var canvasserList = [];
      canvassers.forEach((canvasser) => {
        var canvasserInfo = {};
        canvasserInfo['userInfo'] = canvasser;
        var listAssignment = [];
        var listUnassignment = [];

        var query = `/users/canvasser/assignments/${canvasser.id}`;
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
                  console.log(locationInfo)
                  fetch(`/locations/searching/${locationInfo.locationId}`)
                  .then(res => res.json())
                  .then((location) => {
                    locationDict['fullAddress'] = location[0].fullAddress;
                    locationDict['duration'] = location[0].duration;
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
            } else {
              var date = task.month + '/' + task.date + '/' + task.year;
              listUnassignment.push(date);  
            }
          })
        })
        .catch(err => console.log(err))

        setTimeout(() => {
          canvasserInfo['assignments'] = listAssignment;
          canvasserInfo['unassignments'] = listUnassignment;
          canvasserList.push(canvasserInfo);
          //console.log(canvasserInfo);
        },1300)
      })

      setTimeout(() => {
        this.setState({
          canvassers: canvasserList,
          dataIsFetched: true,
        }, () => {
          this.renderMainComponent();
        })
      }, 1400) 
    })
    .catch(err => console.log(err))
  }


  render() {
    return (
      <div>
        {this.state.mainComponent}
      </div>
    )
    
  };
}
ManagerCanvassersList = withStyles(avatar_styles)(ManagerCanvassersList);

export default ManagerCanvassersList;

