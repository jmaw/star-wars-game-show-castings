import Component from '@ember/component';

export default Component.extend({

commonutils: Ember.inject.service(),
alertt: Ember.inject.service(),
store: Ember.inject.service(),

users:[],
sortedUp:false,
loading:false,

uid: Ember.computed(function(){
  if (this.get('session').content.isAuthenticated){
        return this.get('session').content.currentUser.uid;     
   }     
  return null;
}),

LoadUsers(){
   var that = this;
   this.set('loading',true);
   this.get('commonutils').progressOn();
   this.get('store').query('user', {
            orderBy: 'managerid',
            equalTo: this.get('uid')
        }).then(function(recs) {
           var records=[];
           if (that.get('sortedUp')){
               records = recs.sortBy('lastname').reverse();
           }
           else{
               records = recs.sortBy('lastname');
           }
           that.set('users',records);
           that.get('commonutils').progressOff();
           that.set('loading',false);
        }).catch(function(e){
           that.get('alertt').error('Loading users','Error loading users '+e); 
           that.get('commonutils').progressOff();
           that.set('loading',false);
        });
},

didInsertElement(){
   this.LoadUsers();
},

actions: {

  doReload: function(){
     this.LoadUsers();
  },

  sortLastName: function(){
     this.toggleProperty('sortedUp');
     this.LoadUsers();
  },

},

});
