import Route from '@ember/routing/route';

export default Route.extend({
	queryParams: {
	  userid: ''
    },
  
    router: Ember.inject.service(),

	beforeModel(){
	   if (this.get('session').content.isAuthenticated){
	   	   return true;
	   }
	  this.get('router').transitionTo('application');
	},

    model(params){
      return params.userid;   
    },

});
