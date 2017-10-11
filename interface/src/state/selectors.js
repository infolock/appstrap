import { createSelector } from 'reselect'

export const selActiveRoute = createSelector(
  state => state.activeRoute,
  state => state.routes,
  (activeRouteIndx, routes) => {
    const selectedRoute = routes[activeRouteIndx]
    const returnObj = {
      endpoint: selectedRoute.endpoint,
      handlers: []
    };
    ['get', 'post', 'put', 'delete'].forEach(method => {
      if (selectedRoute[method]) {
        returnObj.handlers.push({
          method: method.toUpperCase(),
          ...selectedRoute[method]
        })

      }
    })
    return returnObj
  }
)
