import json
import math
import numpy as np
from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2

#file = './super_canvasser/src/data/vrp_data.json'
file = '../data/vrp_data.json'
with open(file) as f:
  vrp_data = json.load(f)

#print (vrp_data)

demands = []
lat_lng_list = []
address_list = vrp_data['coordData']
for i in range(0, len(address_list)):
  addr = address_list[i]
  coord_data = (addr['coord']['lat'], addr['coord']['lng'])
  lat_lng_list.append(coord_data)
  demands.append(addr['duration'])

#print (lat_lng_list)
num_vehicles = 5
capacities = np.empty(num_vehicles)
capacities.fill(vrp_data['dayDuration'])


###########################
# Problem Data Definition #
###########################
def create_data_model():
  """Stores the data for the problem"""
  data = {}
  # Locations in block units
  data['avgSpeed'] = vrp_data['avgSpeed']
  data['dayDuration'] = vrp_data['dayDuration']
  data["locations"] = lat_lng_list
  data["num_locations"] = len(data["locations"])
  data["num_vehicles"] = num_vehicles
  data["depot"] = 0
  data['demands'] = demands
  data['capacities'] = capacities
  return data


#######################
# Problem Constraints #
#######################

def haversine_distance(lat1, lon1, lat2, lon2):
  R = 6371e3         # earth radius in meters
  lat1_rad = lat1 * (math.pi / 180)
  lon1_rad = lon1 * (math.pi / 180)
  lat2_rad = lat2 * (math.pi / 180)
  lon2_rad = lon2 * (math.pi / 180)
  
  dLat = (lat2_rad - lat1_rad)
  dLon = (lon2_rad - lon1_rad)

  a = math.sin(dLat/2) * math.sin(dLat/2) + \
          math.cos(lat1_rad) * math.cos(lat2_rad) * \
          math.sin(dLon/2) * math.sin(dLon/2)

  c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
  distance = R * c
  return distance;      # in meters


def manhattan_distance(position_1, position_2):
  """Computes the Manhattan distance between two points"""
  #a = haversine_distance(position_1['coord']['lat'], position_1['coord']['lng'], position_1['coord']['lat'], position_2['coord']['lng']) 
  #b = haversine_distance(position_1['coord']['lat'], position_2['coord']['lng'], position_2['coord']['lat'], position_2['coord']['lng']) 
  a = haversine_distance(position_1[0], position_1[1], position_1[0], position_2[1]) 
  b = haversine_distance(position_1[0], position_2[1], position_2[0], position_2[1])
  return a + b

def create_distance_callback(data):
  """Creates callback to return distance between points."""
  _distances = {}

  for from_node in range(data["num_locations"]):
    _distances[from_node] = {}
    for to_node in range(data["num_locations"]):
      if from_node == to_node:
        _distances[from_node][to_node] = 0
      else:
        _distances[from_node][to_node] = int( manhattan_distance(data["locations"][from_node], data["locations"][to_node]) )
  
  #print(_distances)
  def distance_callback(from_node, to_node):
    """Returns the manhattan distance between the two nodes"""
    return _distances[from_node][to_node]

  return distance_callback


def add_distance_dimension(routing, distance_callback):
  """Add Global Span constraint"""
  distance = 'Distance'
  maximum_distance = int( vrp_data['dayDuration'] * vrp_data['avgSpeed']*60 )   # Maximum distance per vehicle.
  routing.AddDimension(
      distance_callback,
      0,  # null slack
      maximum_distance,
      True,  # start cumul to zero
      distance)
  distance_dimension = routing.GetDimensionOrDie(distance)
  # Try to minimize the max distance among vehicles.
  distance_dimension.SetGlobalSpanCostCoefficient(100)



def get_routes_array(assignment, num_vehicles, routing):
  # Get the routes for an assignent and return as a list of lists.
  routes = []
  for route_nbr in range(num_vehicles):
    node = routing.Start(route_nbr)
    route = []

    while not routing.IsEnd(node):
      index = routing.NodeToIndex(node)
      route.append(index)
      node = assignment.Value(routing.NextVar(node))
    routes.append(route)
  return routes


###########
# Printer #
###########

def print_solution(data, routing, assignment):
  """Print routes on console."""
  total_distance = 0
  for vehicle_id in range(data["num_vehicles"]):
    index = routing.Start(vehicle_id)
    plan_output = 'Route for vehicle {}:\n'.format(vehicle_id)
    distance = 0
    while not routing.IsEnd(index):
      plan_output += ' {} ->'.format(routing.IndexToNode(index))
      previous_index = index
      index = assignment.Value(routing.NextVar(index))
      distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
    plan_output += ' {}\n'.format(routing.IndexToNode(index))
    plan_output += 'Distance of route: {:.3f} m \n'.format(distance)
    print(plan_output)
    total_distance += distance
  print('Total distance of all routes: {:.3f} m'.format(total_distance))


########
# Main #
########

# Instantiate the data problem.
data = create_data_model()
  

def main(data, num_vehicles):
  """Entry point of the program"""
  # Create Routing Model
  routing = pywrapcp.RoutingModel(
      data["num_locations"],
      data["num_vehicles"],
      data["depot"])

  # Define weight of each edge
  distance_callback = create_distance_callback(data)
  routing.SetArcCostEvaluatorOfAllVehicles(distance_callback)
  add_distance_dimension(routing, distance_callback)
  # Setting first solution heuristic (cheapest addition).
  search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
  search_parameters.first_solution_strategy = (
      routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC) # pylint: disable=no-member
  
  search_parameters.time_limit_ms = 30000
  # Solve the problem.
  assignment = routing.SolveWithParameters(search_parameters)

  #print (assignment)
  if assignment:
    print_solution(data, routing, assignment)
    routes = get_routes_array(assignment, num_vehicles, routing)
    print (routes)
    with open('../data/result.json', 'w') as outfile:
      json.dump(routes, outfile)


main(data, num_vehicles)
