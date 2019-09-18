import Route from '@ember/routing/route';

export default Route.extend({

router: Ember.inject.service(),

beforeModel(){
   if (this.get('session').content.isAuthenticated){
   	   return true;
   }
  this.get('router').transitionTo('application');
},


});
