import Component from '@ember/component';
import ENV       from '../config/environment'; 

export default Component.extend({

countries: ENV.common.countries,

commonutils: Ember.inject.service(),	
alertt: Ember.inject.service(),	
store: Ember.inject.service(),	

emailOK: Ember.computed.match('email', /^.+@.+\..+$/),
phoneOK: Ember.computed.match('phone',/^(\d{9})$/),


country:'',
birthday:'',
firstname:'',
lastname:'', 
phone:'',
email:'',
character:'',
photo:'',
userid:'',

characters:[],


uid: Ember.computed(function(){
  if (this.get('session').content.isAuthenticated){
        return this.get('session').content.currentUser.uid;     
   }     
  return null;
}),


init(){
  this._super(...arguments);
  this.set('characters',this.get('commonutils').getCharacters());
},

didInsertElement(){  
  var today = new Date();
  
  var year = today.getFullYear() - 18;
  var month = today.getMonth();
  var day = today.getDate();

  $('.mdb-select').material_select();
  $('.datepicker').pickadate({
  	format: 'yyyy-mm-dd',
  	max: new Date(year,month,day),
  	min: new Date(1950,1,1)
  });  

  if (this.get('userid')){
  	  this.userRecord();
  }
},

notEmpty(s){
    return (s.trim().length > 0);
},

clearData(){
   this.set('firstname','');
   this.set('lastname','');
   this.set('birthday','');
   this.set('email','');
   this.set('phone','');
   this.set('country','');
   this.set('character','');
   this.set('photo','/assets/images/unknown.jpg');

   this.pickerClear('date-of-birth');   
   this.selectValue('resCountry',''); 
   if (this.get('contestant')){
       this.selectValue('swChar','');
   }
},

selectValue(sid,value){
  $('#'+sid).material_select('destroy');
  document.getElementById(sid).value = value;
  $('#'+sid).material_select(); 
},

pickerClear(sid){
   var $input = $('#'+sid).pickadate();
   var picker = $input.pickadate('picker');
   picker.clear();
},

pickerValue(sid,value){
   var $input = $('#'+sid).pickadate();
   var picker = $input.pickadate('picker');
   picker.set('select', value);
},

userRecord(){
  var that = this;
  this.get('commonutils').progressOn();
  this.get('store').findRecord('user',this.get('userid'))
      .then(function(rec){
         that.set('userid',rec.get('id'));
         that.set('firstname',rec.get('firstname'));
         that.set('lastname',rec.get('lastname'));
         that.set('birthday',rec.get('birthday'));
         that.set('email',rec.get('email'));
         that.set('phone',rec.get('phone'));
         that.set('country',rec.get('country'));
         that.set('character',rec.get('character'));
         that.set('photo',rec.get('photo'));   
         that.pickerValue('date-of-birth',rec.get('birthday'));
         that.selectValue('resCountry',rec.get('country'));

         if (that.get('contestant')){
             that.selectValue('swChar',rec.get('character'));
         }        

         that.get('commonutils').progressOff();
      }).catch(function(e){
         that.get('commonutils').progressOff();
      });
},

newRecord(){
    var that = this;
    var errMsg='';
    var okMsg='';
    var dlgTitle='';
    var newUser=null;
    this.get('commonutils').progressOn();     
    if (this.get('contestant')){
    	 if (this.get('new')){
             dlgTitle='New Contestant';
             okMsg='Contestant successfully created!';
             errMsg='Error creating new contestant: ';
    	 }
    	 else{
             dlgTitle='Edit Contestant';
             okMsg='Contestant saved!';
             errMsg='Error saving contestant: ';
    	 }


	     newUser = this.get('store').createRecord('user', {
	     	                 managerid: this.get('uid'),
	     	                 firstname: this.get('firstname'),
	     	                 lastname: this.get('lastname'),
	                         email: this.get('email'), 
	                         birthday: this.get('birthday'),
	                         phone: this.get('phone'),
	                         country: this.get('country'),
	                         character: this.get('character')
	                     });
	}
	else{
    	 if (this.get('new')){
             dlgTitle='New Manager';
             okMsg='Manager successfully created!';
             errMsg='Error creating new manager: ';
    	 }
    	 else{
             dlgTitle='Edit Manager';
             okMsg='Manager saved!';
             errMsg='Error saving manager: ';   
    	 }		
	     newUser = this.get('store').createRecord('user', {
	     	                 id: this.get('uid'),
	     	                 firstname: this.get('firstname'),
	     	                 lastname: this.get('lastname'),
	                         email: this.get('email'), 
	                         birthday: this.get('birthday'),
	                         phone: this.get('phone'),
	                         country: this.get('country')
	                     });	 	
	}    
    newUser.save().then(function(){
     	     that.get('alertt').success(dlgTitle,okMsg);	                  
           that.get('commonutils').progressOff();
           that.clearData();
    }).catch(function(e){     	   
           that.get('alertt').error(dlgTitle,errMsg+e);              
           that.get('commonutils').progressOff();
    });

},


updateRecord(){
   var that = this;
   if (this.get('userid')){
      var errMsg='';
      var okMsg='';
      var dlgTitle='';
      if (this.get('contestant')){
          dlgTitle='Update Contestant';
          okMsg='Contestant saved!';
          errMsg='Error saving contestant: ';  
      } 
      else{
          dlgTitle='Update Manager';
          okMsg='Manager saved!';
          errMsg='Error saving manager: ';
      }

      this.get('commonutils').progressOn();
      this.get('store').findRecord('user', this.get('userid'))
          .then(function(rec) {
           
           rec.set('firstname', that.get('firstname'));
           rec.set('lastname', that.get('lastname'));
           rec.set('email', that.get('email'));
           rec.set('birthday', that.get('birthday'));
           rec.set('phone', that.get('phone'));
           rec.set('country', that.get('country'));
           rec.set('photo',that.get('photo'));

           if (that.get('contestant')){
               rec.set('character', that.get('character')); 
           }           
           
           rec.save().then(function(){
               that.get('alertt').success(dlgTitle,okMsg);            
               that.get('commonutils').progressOff();
           }).catch(function(e){
               that.get('alertt').error(dlgTitle,errMsg+e);
               that.get('commonutils').progressOff();
           });
           
       }).catch(function(e){
           that.get('alertt').error(dlgTitle,errMsg+e);
           that.get('commonutils').progressOff();
       }); 
   }
},

actions: {

   updateCountry:function(v){
      this.set('country',v);
   },

   updateDate:function(v){
      this.set('birthday',v);
   },

   updateCharacter:function(v){
      this.set('character',v);
   },

   saveData: function(){

      // Validation 

      if (!this.notEmpty(this.get('firstname'))){
          this.get('alertt').error('Error','First name cannot be empty!');
          return;
      }

      if (!this.notEmpty(this.get('lastname'))){
          this.get('alertt').error('Error','Last name cannot be empty!');
          return;
      }


      if (!this.notEmpty(this.get('birthday'))){
          this.get('alertt').error('Error','Date of birth cannot be empty!');
          return;
      }

      if (!this.get('emailOK')){
          this.get('alertt').error('Error','Invalid email!');
          return;
      }

      if (!this.get('phoneOK')){
          this.get('alertt').error('Error','Invalid phone: Must be at least 9 digits length!');
          return;
      }

      if (this.get('contestant')){

          if (this.get('country') !== 'Spain'){
              this.get('alertt').error('Error','The residence country for contestants must be Spain!'); 
              this.selectValue('resCountry','');
              return;  
          }

          if (!this.notEmpty(this.get('character'))){
              this.get('alertt').error('Error','Star Wars character cannot be empty!'); 
              return;  
          }
         
      } 


      if (this.get('new')){
      	  this.newRecord();
      }       
      else{
      	this.updateRecord();
      }
   },

   setPicture: function(url,width,height){
      this.set('photo',url);    
   },



}


});
