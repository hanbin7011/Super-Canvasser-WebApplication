import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SelectFreeDateAndTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      task: '',
      name: 'hai',
      labelWidth: 0,
    }
  }

  handleChange = event => {
    console.log(event.target.value);
    if (event.target.id === 'date') {
      this.setState({ date: event.target.value })
    } else if (event.target.id === 'task') {
      this.setState({ task: event.target.value })
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  assignTask = () => {
    const {date, task} = this.state;
    const {unassignDates, unassignTasks, canvasserId} = this.props;

    if (date.length === 0 || task.length === 0) {
      alert('Invalid inputs!');
      return;
    } else {
      // update free date
      var removeUnAssignDateIdx = unassignDates.findIndex(unassign => unassign === date);
      unassignDates.splice(removeUnAssignDateIdx,1);
      // update task
      var removeUnAssignTaskIdx = unassignTasks.findIndex(unassign => unassign.id === task);
      unassignTasks.splice(removeUnAssignTaskIdx,1);
      
      var query = `/tasks/assign/${canvasserId}/${task}/day?date=${date.split('/')[1]}&month=${date.split('/')[0]}&year=${date.split('/')[2]}`;
      fetch(query).then(res => res.json()).catch(err => console.log(err))

      this.props.reloadAfterAssign({date: date, task: task})
    }
  }

  render() {
    const { classes } = this.props;
    const {unassignDates, unassignTasks} = this.props;

    return (
      <div>
      <form className={classes.root} >        
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="date-simple">Free date</InputLabel>
          <Select
            id='date'
            value={this.state.date}
            onChange={this.handleChange}
            inputProps={{
              name: 'date',
              id: 'date-simple',
            }}
          >
            <MenuItem key={0} value="">
              <em>None</em>
            </MenuItem>
            
            {unassignDates.map((unassign, idx) => {
              return (
                <MenuItem key={idx+1} value={unassign}>{unassign}</MenuItem>
              )
            })}

          </Select>
        </FormControl>
        
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="task-simple">Task</InputLabel>
          <Select
            id='task'
            value={this.state.task}
            onChange={this.handleChange}
            inputProps={{
              name: 'task',
              id: 'task-simple',
            }}
          >
            <MenuItem key={0} value="">
              <em>None</em>
            </MenuItem>
            
            {unassignTasks.map((unassign, idx) => {
              return (
                <MenuItem key={idx+1} value={unassign.id}>{unassign.id}</MenuItem>
              )
            })}

          </Select>
        </FormControl>
      </form>
      <Button 
            onClick={this.assignTask}
            variant="contained"
            color="primary" 
            className={classes.button}> Assign </Button>
      </div>
    );
  }
}

SelectFreeDateAndTask.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectFreeDateAndTask);