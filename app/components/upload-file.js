import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({

firebaseApp: Ember.inject.service(),
commonutils: Ember.inject.service(),
alertt: Ember.inject.service(),

fileinprogress:false,
acceptfile:'',
filetitle:'',
fileprogress:0, 
ios:false,


init(){
   this._super(...arguments);
   this.set('acceptfile','image/*');
   this.set('filetitle','images');
},


replace: function (s,search,replacement){
	return s.split(search).join(replacement); 
},

fixRefName:function(name){
   name = this.replace(name,' ','_');
   name = this.replace(name,'(','_');
   name = this.replace(name,')','_');
   name = this.replace(name,'-','_');
   name = this.replace(name,'jpeg','jpg');
   return name;
},

//storeFile: function(currlib,uid,file,filesize,duration){
storeFile: function(rec){
      var that = this;
      var sto    = this.get('firebaseApp').storage();
      var stoRef = sto.ref();
      var filename = this.fixRefName(rec.file.name.toLowerCase());
      var imgRef = stoRef.child(rec.lib+'/'+rec.uid+'/'+filename);

      var uploadTask = imgRef.put(rec.file);

      uploadTask.on('state_changed', function(snapshot){
         var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         that.set('fileinprogress',true);
         that.set('fileprogress',progress);
      }, function(error) {
         // Handle unsuccessful uploads
          that.set('fileinprogress',false);
          that.get('alertt').error('Upload File',error);
      }, function() {
         // Handle successful uploads on complete
         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
         var downloadURL = uploadTask.snapshot.downloadURL;
         that.set('fileinprogress',false);
         rec.filename = filename;
         rec.downloadURL = downloadURL;         
         that.get('commonutils').progressOff();
         that.get('alertt').success('Upload File','File successfully uploaded. Please, saved your user info to update photo!'); 
         if (that.get('setaction')){
             that.sendAction('setaction', downloadURL);
         }
      }); 
    
},

uploadImg: function(uid,file){
  var that = this;	
  var reader = new FileReader();
  this.get('commonutils').progressOn();
  reader.onload = function(evt) {
          var image = new Image();
          image.onload = function(evt) {
            var width = this.width;
            var height = this.height;

          	var rec = {
                  type: that.get('filetype'),
                  lib: 'images',
                  uid: uid,       
                  file: file,
                  filesize: file.size,
                  width: width,
                  height: height,
                  filename:'',
                  downloadURL:''         
          	}; 

            that.storeFile(rec);
          };
          image.src = evt.target.result; 
  };
  reader.readAsDataURL(file);
},


actions: {

updateFile: function(e){
      var uid = this.get('uid');
      var file = e.target.files[0];
      if (file == undefined){
      	  return;
      }
      this.uploadImg(uid,file);      
},

},


});
 