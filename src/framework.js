const isSameUrl = (req, route) => {
  if (route.handler && !(route.method || route.url)) {
    return true;
  }
  if (req.url == route.url && req.method == route.method) {
    return true
  };
  return false;
}

class App {
  constructor() {
    this.routes = [];
  }

  get(url, handler) {
    const route = { url, handler, method: 'GET' };
    this.routes.push(route);
  }

  post(url, handler) {
    const route = { url, handler, method: 'POST' };
    this.routes.push(route);
  }

  use(handler) {
    this.routes.push({ handler });
  }

  handleRequest(req, res) {
    const matchedRoutes = this.routes.filter(
      isSameUrl.bind(null, req)
    );
    const next = () => {
      if (matchedRoutes.length == 0) return;
      const currentHandler = matchedRoutes[0];
      matchedRoutes.shift();
      currentHandler.handler(req, res, next);
    }
    next();
  }
}

module.exports = App;