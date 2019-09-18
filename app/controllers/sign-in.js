import Controller from '@ember/controller';
import Ember from 'ember';

export default  Controller.extend({

    commonutils: Ember.inject.service(),
    alertt: Ember.inject.service(),

    firebaseApp: Ember.inject.service(),

    emailOK: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordOK: Ember.computed.match('password',/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
    captchaDone: true,
    
    email:'',
    password:'',
    fails:3,
     
    isSignInButtonDisabled: Ember.computed('captchaDone',function() {
             return !(this.get('captchaDone'));                      
    }),
    

  notEmpty(s){
    return (s.trim().length > 0);
  },

  gotoLink(link){
  	var base_url = window.location.origin;
    window.location.href = base_url + "/" + link;             
  },

  cleanForm(){  	     
         this.set('email','');
         this.set('password','');
         if (this.get('fails') > 0){
         	   this.decrementProperty('fails');             
         	   this.set('captchaDone',true);
         }
         else{
         	  this.set('captchaDone',false);
         	  this.get('gRecaptcha').resetReCaptcha();          	
         }         
  },


actions: {  

    onCaptchaResolved() {
        this.set('captchaDone',true);
    },

    signIn: function() {
      var  that = this; 
      if (!this.get('emailOK')){
          that.get('alertt').error('Error','Invalid email!');
          return;
      }
      if (!this.get('passwordOK')){
          that.get('alertt').error('Error','Invalid password!');
          return;
      }

      that.get('commonutils').progressOn();
      this.get('firebaseApp').auth()
                .signInWithEmailAndPassword(
                     this.get('email'),
                     this.get('password')
                ).catch(function(error){
                    that.cleanForm();
                    that.get('alertt').error('Error','Invalid email or password');
                    that.get('commonutils').progressOff();
                }).then(function(user){     
                   if (user && user.uid){
                   	   that.get('commonutils').progressOff();
                   	   that.gotoLink('manager-dashboard');
                   }             
                });


    },


},



});