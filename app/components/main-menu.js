import Component from '@ember/component';
import ENV       from '../config/environment'; 

export default Component.extend({

commonutils: Ember.inject.service(),
firebaseApp: Ember.inject.service(),
store: Ember.inject.service(),

 
sbw:25,
randomid:'',
progress: false,
canAdd:false,

init(){
  this._super(...arguments);
  var that = this;
  this.get('commonutils').set('progressfn',function(progress){
          if (progress !== that.get('progress')){
              that.set('progress',progress);
          }
  });
},

checkURL(){
  var pn = window.location.pathname;
  if ((pn == '/manager-dashboard') || (pn == '/manager-dashboard/')){
      this.set('canAdd',true);
  }
  else{
    this.set('canAdd',false);
  }
},


setWW(mode,device,width,height){    
    if (device == 'desktop-laptop'){
        this.set('sbw',25);
    }
    else{
          // PORTRAIT MODE
          if (mode == 'portrait'){
              switch(device){
                 case 'ipad':
                 case 'android-tablet':
                    this.set('sbw',50);
                 break;
                  
                 case 'iphone':
                 case 'android-phone':
                     this.set('sbw',75);
                 break;
              }           
          }
          else{ // LANDSCAPE MODE
              switch(device){
                case 'ipad':
                case 'android-tablet':
                    this.set('sbw',40);
                break;
                    
                case 'iphone':
                case 'android-phone':
                    this.set('sbw',50);
                break;
                }                
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

    $('.button-collapse').sideNav({
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on &lt;a&gt; clicks, useful for Angular/Meteor
        breakpoint: 1440, // Breakpoint for button collapse
        MENU_WIDTH: 300, // Width for sidenav
        timeDurationOpen: 300, // Time duration open menu
        timeDurationClose: 200, // Time duration open menu
        timeDurationOverlayOpen: 50, // Time duration open overlay
        timeDurationOverlayClose: 200, // Time duration close overlay
        easingOpen: 'easeOutQuad', // Open animation
        easingClose: 'easeOutCubic', // Close animation
        showOverlay: true, // Display overflay
        showCloseButton: false // Append close button into siednav
        });

    this.get('commonutils').LoadCharacters();
    this.checkURL();
},


quitSession(){
    var that = this;
    this.get('session').close().then(()=>{
           that.get('store').unloadAll();
           sessionStorage.clear();      
           window.location.href = window.location.origin;
    });
}, 

      
actions: {

   quitConfirm: function(){
   	var that = this;
   	swal({
		  title: "Are you sure?",
		  text: "You are trying to close your session!",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
             that.quitSession(); 		    
		  } 
		});
   },

}

});
 