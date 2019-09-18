import Route from '@ember/routing/route';

export default Route.extend({

router: Ember.inject.service(),
commonutils: Ember.inject.service(),

beforeModel(){
   if (this.get('session').content.isAuthenticated){
   	   return true;
   }
  this.get('router').transitionTo('application');
},

actions: {
    willTransition(transition) {
       this.get('commonutils').progressOff();
    }
 }


});
