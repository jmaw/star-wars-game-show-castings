import Service from '@ember/service';

export default Service.extend({


success(title,msg,callback){
  swal({
     button: {
        text: "OK",
        className: "swal-button-alertt"
     },
     title: title,
      icon: "success",
     text: msg
   });
},

info(title,msg,callback){
  swal({
     button: {
        text: "OK",
        className: "swal-button-alertt"
     },    
     title: title,
      icon: "info",
     text: msg
   });
},

warning(title,msg,callback){
  swal({
     button: {
        text: "OK",
        className: "swal-button-alertt"
     },    
     title: title,
      icon: "warning",
     text: msg
   });
},

error(title,msg,callback){
  swal({
     button: {
        text: "OK",
        className: "swal-button-alertt"
     },
     title: title,
      icon: "error",
      text: msg
   });
},


});
