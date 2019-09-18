import Controller from '@ember/controller';
import Ember from 'ember';

export default  Controller.extend({

    alertt: Ember.inject.service(),
    commonutils: Ember.inject.service(),

    firebaseApp: Ember.inject.service(),
    store: Ember.inject.service(),

    emailOK: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordOK: Ember.computed.match('password1',/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),

    captchaDone: false,
    
    firstname:'',
    lastname:'',
    email:'',
    password1:'',
    password2:'',
   
    isSignUpButtonDisabled: Ember.computed('captchaDone',function() {
          return !(this.get('captchaDone'));
    }),

  notEmpty(s){
    return (s.trim().length > 0);
  },


  doUserLogin(user) {
      var that = this;
      this.get('commonutils').progressOn();
      this.get('firebaseApp').auth()
                  .signInWithEmailAndPassword(
                     this.get('email'),
                     this.get('password1')
                ).catch(function(error){
                  that.get('commonutils').progressOff();
                }).then(function(){                  
                   that.createRecord(user.uid, that.get('firstname'), that.get('lastname'), that.get('email'));                           
                   that.get('commonutils').progressOff();                
                });

  },

  gotoLink(link){
  	var base_url = window.location.origin;
    window.location.href = base_url + "/" + link;             
  },

  createRecord(uid,firstname,lastname,email){
     var that = this;
     this.get('commonutils').progressOn();
     const newUser = this.get('store').createRecord('user', {
     	                 id: uid,
     	                 firstname: firstname,
     	                 lastname: lastname,
                       email: email 
                     });
     newUser.save().then(function(){
           //that.get('alertt').success('Sign-up','Casting Manager created!');
           that.gotoLink('manager-dashboard');
           that.get('commonutils').progressOff();
     }).catch(function(e){     	   
           that.get('alertt').error('Sign-up','Error creating manager: '+e);   
           that.cleanForm();
           that.get('commonutils').progressOff();
     });
  },

  cleanForm(){
         this.set('firstname',''); 
         this.set('lastname',''); 
         this.set('email','');
         this.set('password1','');
         this.set('password2','');
         this.get('gRecaptcha').resetReCaptcha();          
  },


actions: {  


    onCaptchaResolved() {
        this.set('captchaDone',true);
    },

    signUp: function() {
      var  that = this; 

      if (!this.notEmpty(this.get('firstname'))){
          that.get('alertt').error('Error','First name cannot be empty!');
          return;
      }

      if (!this.notEmpty(this.get('lastname'))){
          that.get('alertt').error('Error','Last name cannot be empty!');
          return;
      }

      if (!this.get('emailOK')){
          that.get('alertt').error('Error','Invalid email!');
          return;
      }

      if (!this.get('passwordOK')){
          that.get('alertt').error('Error','Invalid password format (Minimum eight characters, at least one letter and one number)');
          return;
      }

      if (this.get('password1') !== this.get('password2')){
          that.get('alertt').error('Error','Passwords must be identical!');
          return;
      }


      that.get('commonutils').progressOn();
      this.get('firebaseApp').auth()
        .createUserWithEmailAndPassword(
                 this.get('email'),
                 this.get('password1')
        ).catch(function(error){
             that.get('alertt').error('Sign-up','Error creating user with email '+that.get('email'));
             that.cleanForm();
             that.get('commonutils').progressOff();
        }).then(function(user){
             that.get('commonutils').progressOff();
             if (user){
                 that.doUserLogin(user);
             }
        });
     },


},



});