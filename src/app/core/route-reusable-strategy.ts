import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy
} from '@angular/router';

/**
 * A route strategy allowing for explicit route reuse.
 * Used as a workaround for https://github.com/angular/angular/issues/18374
 * To reuse a given route, add `data: { reuse: true }` to the route definition.
 */
export class RouteReusableStrategy extends RouteReuseStrategy {

  /**
   * Route Reuse Strategy lifecycle method
   * @param route Current activated route
   * @returns false
   */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Route Reuse Strategy lifecycle method
   * @param route Current activated route
   * @param detachedTree The detached tree
   */
  public store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle | null
  ): void {}

  /**
   * Route Reuse Strategy lifecycle method
   * @param route Current activated route
   * @returns false
   */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Route Reuse Strategy lifecycle method
   * @param route Current activated route
   * @returns null
   */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  /**
   * Route Reuse Strategy lifecycle method
   * @param future Future activated route
   * @param curr Current activated route
   */
  public shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig || future.data.reuse;
  }
}
