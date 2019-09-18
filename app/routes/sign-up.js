import Route from '@ember/routing/route';

export default Route.extend({


  session: Ember.inject.service(),

  beforeModel:function(){
        console.log('SESSION2',this.get('session'));
        return this.get('session').fetch().catch(function() {});
  },          


});
