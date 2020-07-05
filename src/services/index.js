import axios from "axios";

/**
 * class to call http api services with built-in rate limiting
 */
class RateLimitApiRoute {
  /**
   * constructor
   * @param {string} routeName name to assign this route
   * @param {string} routeUrl url of this api route
   * @param {number} rateLimit number of requests that can be made within limit interval
   * @param {number} limitInterval amount of time that needs to pass before more requests can be made in milliseconds
   */
  constructor(routeName, routeUrl, rateLimit, limitInterval) {
    this.routeName = routeName;
    this.routeUrl = routeUrl;
    this.rateLimit = rateLimit;
    this.limitInterval = limitInterval;

    setTimeout(
      (originalLimit) => {
        this.rateLimit = originalLimit;
      },
      limitInterval,
      rateLimit
    );
  }

  async callRoute(pathParameter, queryParameters) {
    if (this.rateLimit > 0) {
      const apiParameters =
        pathParameter != null
          ? pathParameter.concat(queryParameters ?? "")
          : queryParameters;

      const finalRouteUrl = new URL(apiParameters ?? "", this.routeUrl);
      const response = await axios.get(finalRouteUrl);
      this.rateLimit--;
      return response.data;
    } else {
      return null;
    }
  }
}

export const NewsfeedApi = new RateLimitApiRoute(
  "NewsFeed",
  "http://localhost:8000/news/generalfeed",
  30,
  1000
);
