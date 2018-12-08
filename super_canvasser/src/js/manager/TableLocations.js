import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { Edit, LocationOn, ListAlt} from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'street', numeric: false, disablePadding: false, label: 'Street' },
  { id: 'unit', numeric: false, disablePadding: false, label: 'Unit' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'zipcode', numeric: true, disablePadding: false, label: 'Zip code' },
  { id: 'duration', numeric: true, disablePadding: false, label: 'Duration (mins)' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50 + 300,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});


function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

function BodySelected({location}) {
  if (location == null) {
    return (
      <div>
        <Grid container justify='center'>
          <Typography variant='title' id="modal-title">
            Error!
          </Typography>
        </Grid>
        <Grid container justify='center'>
          <Typography variant='subheading' id="simple-modal-description">
            Please select only 1 location to edit!
          </Typography>
        </Grid>
      </div>
    )
  } else {
    return (
      <div>
        <Grid container justify='center'>
          <Typography variant='display2' id="modal-title">
            Edit location
          </Typography>
        </Grid>
        <br/>
        <Grid container justify='center'>
          <Typography variant='title' id="modal-title">
            {location.fullAddress}
          </Typography>
        </Grid>
      </div>
    )
  }
}


class EnhancedTableToolbar extends React.Component {
  state = {
    editModal_open: false,
    deleteModal_open: false,

    edit_street: '',
    edit_unit: '',
    edit_city: '',
    edit_state: '',
    edit_zipcode: '',
    edit_country: '',
    edit_duration: '',
  }

  handleEditModal_open = () => {
    const {locations , index} = this.props;
    this.setState({ editModal_open: true });

    var location = locations.find(location => location.id === index[0]);
    if (typeof location === 'undefined')
      return;
    this.setState({
      edit_street: location.street,
      edit_unit: location.unit,
      edit_city: location.city,
      edit_state: location.state,
      edit_zipcode: location.zipcode,
      edit_country: location.country,
      edit_duration: location.duration,
    })
  };

  handleEditModal_close = () => {
    this.setState({ editModal_open: false });
  };

  handleDelModal_open = () => {
    this.setState({ deleteModal_open: true });
  };

  handleDelModal_close = () => {
    this.setState({ deleteModal_open: false });
  };  

  handleTFchange = (event) => {
    if (event.target.id === 'street') {
      this.setState({edit_street: event.target.value})
    } else if (event.target.id === 'unit') {
      this.setState({edit_unit: event.target.value})
    } else if (event.target.id === 'city') {
      this.setState({edit_city: event.target.value})
    } else if (event.target.id === 'state') {
      this.setState({edit_state: event.target.value})
    } else if (event.target.id === 'zipcode') {
      this.setState({edit_zipcode: event.target.value})
    } else if (event.target.id === 'country') {
      this.setState({edit_country: event.target.value})
    } else if (event.target.id === 'duration') {
      this.setState({edit_duration: event.target.value})
    }
  }

  handleViewResults = () => {
    const {locations , index} = this.props;
    var locationResList = [];

    index.forEach(idx => {
      var location = locations.find(location => location.id === idx);
      if (typeof location !== 'undefined') {
        locationResList.push(location);
      }
    })

    this.props.handleViewResults(locationResList);
  }

  handleEdit = () => {
    console.log('edit location');
    const {locations , index} = this.props;

    var location = locations.find(location => location.id === index[0]);
    if (typeof location === 'undefined')
      return;

    location.street = this.state.edit_street;
    location.unit = this.state.edit_unit;
    location.city = this.state.edit_city;
    location.state = this.state.edit_state;
    location.zipcode = this.state.edit_zipcode;
    location.country = this.state.edit_country;
    location.duration = this.state.edit_duration;
    location.fullAddress = location.street;
    location.fullAddress += location.unit.length === 0 ? '' : ', ' + location.unit;
    location.fullAddress += ', ' + location.city
                    + ', ' + location.state + ', ' + location.zipcode
                    + ', ' + location.country;

    this.props.handleEdit(location);

    this.handleEditModal_close();
  }

  handleDelete = () => {
    this.handleDelModal_open();
    const {index, locations} = this.props;
    var deleteLocation_list = [];

    index.forEach(id => {
      var location = locations.find(location => location.id === id);
      if (typeof location === 'undefined') {
        return;
      }
      deleteLocation_list.push(location);
    })

    this.props.handleDelete(deleteLocation_list);
    this.handleDelModal_close();
  }

  handleDisplayMarker = () => {
    //console.log('display: ', this.props.listCoords);
    this.props.display(this.props.listCoords)
  }
  
  render() {
    const { numSelected, classes, locations, index } = this.props;
    
    // location to be edited
    var location = {};
    if (numSelected === 1) {
      location = locations.find(location => location.id === index[0]);
      if (typeof location === 'undefined')
        location = null;
    } else {
      location = null;
    }

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography id="tableTitle">
              List of all locations in the campaigns
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
      {/* ---------------- View results icon button--------------------*/}
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="View results">
              <IconButton onClick={this.handleViewResults} aria-label="Result">
                <ListAlt/>
              </IconButton>
            </Tooltip>
          ) : (
            null
          )}
        </div>

      {/* ---------------- Display marker icon button--------------------*/}
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Display location">
              <IconButton onClick={this.handleDisplayMarker} aria-label="Display">
                <LocationOn />
              </IconButton>
            </Tooltip>
          ) : (
            null
          )}
        </div>

        {/* ---------------- Edit icon button--------------------*/}
        <div className={classes.actions}>
          {numSelected > 0 ? (

            <Tooltip title="Edit">
              <IconButton onClick={this.handleEditModal_open} aria-label="Edit">
                <Edit />
              </IconButton>
            </Tooltip>
          ) : (
            null
          )}
        </div>


        {/* ------------------------  Modal for Edit location  ------------------------------ */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.editModal_open}
          onClose={this.handleEditModal_close}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <BodySelected location={location}/>
            <br/>
            {location == null ? null : 
              <form justify='center'>
                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>Street:</Grid>
                  <Grid item xs={6}>
                      <TextField
                        id='street'
                        className = 'street'
                        label='Street'
                        onChange={this.handleTFchange}
                        defaultValue={location.street}
                        fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>Unit:</Grid>
                  <Grid item xs={6}>
                      <TextField
                        id='unit'
                        className = 'unit'
                        label='Unit'
                        onChange={this.handleTFchange}
                        defaultValue={location.unit}
                        fullWidth={true} />
                  </Grid>
                </Grid>
      
                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>City:</Grid>
                  <Grid item xs={6}> 
                      <TextField
                        id='city'
                        className = 'city'
                        label='City'
                        onChange={this.handleTFchange}
                        defaultValue={location.city}
                        fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>State:</Grid>
                  <Grid item xs={6}> 
                      <TextField
                        id='state'
                        className = 'state'
                        label='State'
                        onChange={this.handleTFchange}
                        defaultValue={location.state}
                        fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>Zip code:</Grid>
                  <Grid item xs={6}> 
                      <TextField
                        id='zipcode'
                        className = 'zipcode'
                        label='Zip code'
                        onChange={this.handleTFchange}
                        defaultValue={location.zipcode}
                        fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>Country:</Grid>
                  <Grid item xs={6}> 
                      <TextField
                        id='country'
                        className = 'country'
                        label='Country'
                        onChange={this.handleTFchange}
                        defaultValue={location.country}
                        fullWidth={true} />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end" justify='center'>
                  <Grid item xs={3}>Duration:</Grid>
                  <Grid item xs={6}> 
                      <TextField
                        id='duration'
                        className = 'duration'
                        label='Duration'
                        onChange={this.handleTFchange}
                        defaultValue={location.duration}
                        fullWidth={true} />
                  </Grid>
                </Grid>
              </form>
            }
            <Grid container justify='center'>
              {numSelected === 1? <div><br/><Button onClick={this.handleEdit} variant="contained" color="primary" style={{marginTop:'15px', marginRight: '8px'}}> Update </Button></div> : null}
              {numSelected === 1? <div><br/><Button onClick={this.handleEditModal_close} variant="contained" color="default" style={{marginTop:'15px'}}> Cancel </Button></div> : null}
              {numSelected === 1? null : <Button onClick={this.handleEditModal_close} variant="contained" color="primary" style={{marginTop: '15px'}}> Close </Button>}
            </Grid>
          </div>
        </Modal>

        {/* ------------------------  Modal for Delete location  ------------------------------ */}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.deleteModal_open}
          onClose={this.handleDelModal_close}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Grid container justify='center' >
              <Typography variant='subheading'>
                Are you sure you want to delete following location(s)?
              </Typography>
            </Grid>
            <br/>
            <Grid container justify='center'>
              <div><br/><Button onClick={this.handleDelete} variant="contained" color="primary" style={{marginTop:'15px', marginRight: '8px'}}> Yes, delete </Button></div>
              <div><br/><Button onClick={this.handleDelModal_close} variant="contained" color="default" style={{marginTop:'15px'}}> No, cancel </Button></div>
            </Grid>
          </div>
        </Modal>

        {/* ---------------- Delete location icon button--------------------*/}
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={this.handleDelModal_open} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  }
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});



/* =================== Main class ============================*/
class TableLocations extends React.Component {
  state = {
    API_KEY: 'AIzaSyC3A1scukBQw2jyAUqwHHTw4Weob5ibZiY',
    order: 'asc',
    orderBy: 'id',
    selected: [],
    data: null,
    page: 0,
    rowsPerPage: 5,
    listCoordinates: {},
  };

  componentWillMount() {
    this.setState({
      data: this.props.listLocation
    })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }), 
        () => this.getCoordList(this.state.selected, [])
      );
      return;
    }
    this.setState({ selected: [] }, () => {
      this.getCoordList(this.state.selected, [])
    });
  };

  ///// Use Geocoding API to convert address to longitude and latitude 
  //// to display markers of all selected locations on the map
  getCoordList = (selected, listCoordinates) => {
    selected.forEach(id => {
      var locationData = this.props.listLocation.find(location => location.id === id);
      console.log(locationData);
      if (typeof locationData === 'undefined') {
        return;
      }
      var fullAddr = locationData.fullAddress;
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

    this.setState({ 
      listCoordinates: listCoordinates,
      data: this.props.listLocation,
    }, () => {
      this.props.selectedLocations(this.state.listCoordinates);
    })
  }

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    ///// Use Geocoding API to convert address to longitude and latitude 
    //// to display markers of all selected locations on the map
    this.setState({ selected: newSelected }, () => {
      // display markers on map
      this.getCoordList(this.state.selected, []);
    });

  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  displayHelper = (listLocations, selectChanged) => {
    //console.log('here: ', listLocations)
    this.props.display(listLocations, selectChanged)
  }

  deleteHelper = (deleteLocation_list) => {
    //console.log('delete list: ', deleteLocation_list);
    this.setState({ selected : []})
    this.props.deleteLocation(deleteLocation_list);
  }

  editHelper = (location) => {
    this.props.updateLocation(location);
  }

  viewResultsHelper = (locationResList) => {
    this.props.viewResults(locationResList);
  }

  render() {
    if (!this.state.data) {
      return <div/>
    }
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.listLocation.length - page * rowsPerPage);
    
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} 
                locations={this.props.listLocation} 
                index={selected} 
                listCoords={this.state.listCoordinates} 
                display={this.displayHelper} 
                handleDelete={this.deleteHelper}
                handleEdit={this.editHelper}
                handleViewResults={this.viewResultsHelper} />

        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={this.props.listLocation.length}
            />
            <TableBody>
              {stableSort(this.props.listLocation, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                                            
                      <TableCell> {n.street} </TableCell>
                      <TableCell> {n.unit} </TableCell>
                      <TableCell> {n.city} </TableCell>
                      <TableCell> {n.state} </TableCell>
                      <TableCell numeric> {n.zipcode} </TableCell>
                      <TableCell numeric> {n.duration} </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={this.props.listLocation.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

TableLocations.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableLocations);

