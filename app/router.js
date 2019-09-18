import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('manager-profile');
  this.route('manager-dashboard');
  this.route('manager-dashboard-new');
  this.route('manager-dashboard-edit');
  this.route('sign-in');
  this.route('sign-up');

  this.route('page-not-found', { path: '/*path'});
});

export default Router;
