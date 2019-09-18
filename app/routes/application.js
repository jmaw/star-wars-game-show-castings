import Route from '@ember/routing/route';

export default Route.extend({
	
	session: Ember.inject.service(),
	commonutils: Ember.inject.service(),

	beforeModel: function(){
      return this.get('session').fetch().catch(function() {});
    },

});
