import Component from '@ember/component';

export default Component.extend({

alertt: Ember.inject.service(),
store: Ember.inject.service(),
commonutils: Ember.inject.service(),


randomid:'',
landscapemode:false,

setWW(mode,device,width,height){    
    // Desktops are always in landscape
    if (device == 'desktop-laptop'){
        this.set('landscapemode',true);
    }
    else{
          // PORTRAIT MODE
          if (mode == 'portrait'){
              this.set('landscapemode',false);           
          }
          else{ // LANDSCAPE MODE
              this.set('landscapemode',true);                
          }  
    }
},

didInsertElement(){
    var that = this;
    this.set('randomid',this.get('commonutils').getid());
    var t = this.get('commonutils').getOrientationDevice();
    this.setWW(t.mode,t.device,t.width,t.height);
    this.get('commonutils').addOrientationListener(this.get('randomid'),function(mode,device,width,height){
            if (!that.isDestroyed){
                 that.setWW(mode,device,width,height);
            }      
    });

},

deleteUser(userid){
   var that = this;
   this.get('commonutils').progressOn();	
   this.get('store').findRecord('user', userid, { backgroundReload: false })
       .then(function(rec) {
          rec.destroyRecord().then(function(){
          	if (that.get('reload')){
          		that.sendAction('reload');
          	}
            that.get('commonutils').progressOff();	
          }).catch(function(e){
             that.get('alertt').error('Delete User','Error deleting user '+e);
             that.get('commonutils').progressOff();	
          }); 
        });
},


gotoLink(link){
  	var base_url = window.location.origin;
    window.location.href = base_url + "/" + link;             
},


actions: {

editUser: function(userid){
   this.gotoLink('manager-dashboard-edit/?userid='+userid);   
},	

verifyDelete: function(userid,firstname){
   	var that = this;
   	swal({
		  title: "Are you sure?",
		  text: "You are trying to delete the user "+firstname,
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
             that.deleteUser(userid); 		    
		  } 
		});
},  

},

});
