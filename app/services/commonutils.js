import Service    from '@ember/service';
import UAParser   from 'ua-parser-js';

export default Service.extend({

// GLOBAL VARIABLES 

orientationfn:[],
scrmode:'',


//========================  
//     INIT SERVICE     //
//========================  


init(){
    this._super(...arguments);
    var that = this;
    window.onorientationchange = function(event){
       that.checkWindowOrientation();  
    };
    this.checkWindowOrientation();
},


//========================  
//   SWAPI CHARACTERS   //
//========================  


characters:[],

_LoadCharacters(page){  
  var that = this;
  Ember.$.getJSON(page).then((data) => {
          data.results.forEach( c => {
            that.get('characters').push(c.name);
          })
          if (data.next){
              that._LoadCharacters(data.next);
          }
          else{
            window.localStorage.setItem('characters',that.get('characters'));
            that.progressOff();
          }
      });
},

LoadCharacters(){  
   var c = window.localStorage.getItem('characters');
   if (!c){
       this.progressOn();
       this.set('characters',[]); 
       this._LoadCharacters("https://swapi.co/api/people");                
   }   
},

getCharacters(){
   var c = window.localStorage.getItem('characters');
   return c.split(',');
},


//========================  
//        HELPERS       //
//========================  


// random int between min and max (both included)

randInt(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
},

// GENERATE RANDOM ID

getid(n){
    var m = 7;  
    if (n !== undefined){
        if (n >= 6){
            m = n + 1;
        }
    }
    var validFirstChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var c = validFirstChars.charAt(Math.floor(Math.random() * validFirstChars.length));
    return c + (Math.random().toString(36)+'00000000000000000').slice(2, m);
},


//========================  
//     ORIENTATION      //
//========================  


// Operating system

ua: window.navigator.userAgent.toLowerCase(),

up: Ember.computed('ua',function(){
        var p = new UAParser();
        p.setUA(this.get('ua'));
        //alert(JSON.stringify(p.getResult()));
        if (this.isMobileDevice()){
            if (!p.getDevice().type){
               if (p.getOS().name.toLowerCase() == 'android'){
                  return 'android-tablet';
               }       
               else{
                  return 'unknown-mobile';
               }
            }
            else{
              return p.getDevice().type;
            }
        } 
        else{
           return 'desktop-laptop';  
        }
}),

os:Ember.computed('ua',function(){
    var p = new UAParser();
    p.setUA(this.get('ua'));
    return p.getOS().name;
}),

ios:Ember.computed('os',function(){
    return this.get('os') == 'iOS';
}),

// Devices

device: Ember.computed('up',function(){
    if (this.get('up') == 'mobile' && this.get('os') == 'iOS'){
        return 'iphone';
    }
    if (this.get('up') == 'tablet' && this.get('os') == 'iOS'){
        return 'ipad';
    }
    if (this.get('up') == 'mobile' && this.get('os') == 'android'){
        return 'android-phone';
    }
    return this.get('up');
}),

isipad: Ember.computed('ua',function(){
    return this.get('ua').indexOf('ipad') > -1;
}),


isMobileDevice(){
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
},

ismobile: Ember.computed('up',function(){
   //alert(this.get('os')+' '+this.get('device')+' '+this.get('up'));
   // fix to consider ipad as a mobile device and any android a mobile device
   return this.get('up') == 'mobile' || this.get('up') == 'tablet' || this.get('os').toLowerCase() == 'android'; 
}),

istablet: Ember.computed('up',function(){
   return this.get('up') == 'tablet' || (this.get('up') !== 'tablet' && this.get('os').toLowerCase() == 'android');
}),

istabletportrait: Ember.computed('istablet','scrmode',function(){
   return (this.get('istablet') && (this.get('scrmode') == 'portrait'));
}),

// Orientation

isportrait:Ember.computed('scrmode',function(){
    return this.get('scrmode') == 'portrait';
}),

checkWindowResize(){
    this.checkWindowOrientation();
 },
 
getOrientationDevice(){
    var sc = (window.orientation == 0 || window.orientation == 180)? 'portrait' : 'landscape';
    return {
       mode: sc,
       height: screen.height,
       width: screen.width,
       device: this.get('device')  
    };
},

 checkWindowOrientation(){
   var that = this;
   window.setTimeout(function(){      
       var sc = (window.orientation == 0 || window.orientation == 180)? 'portrait' : 'landscape';
       if (!that.isDestroyed){
           that.set('scrmode',sc); 
           if (that.get('orientationfn.length') > 0){
               var ar = that.get('orientationfn');
               for(var i=0;i<ar.length;i++){
                   //alert('id = '+ar[i].id);  
                   if (ar[i].f){
                       ar[i].f(sc,that.get('device'),screen.width,screen.height);  
                   }              
               }
           }  
       }      
   },300);
 },
 
 
addOrientationListener(oid,fn){
   var found=false;
   var ar = this.get('orientationfn');

   for(var i=0;i<ar.length && !found;i++){
       if (ar[i].id == oid){
           ar[i].f = fn;
           found=true;
       }
   }
   if (!found){
       var ari = {
            id:oid,
            f:fn
       };
       ar.unshift(ari);       
   }
   this.set('orientationfn',ar); 
   this.checkWindowOrientation();
},

//========================  
//       COOKIES        //
//========================  

setTimeCookie(cookie,value,minutes){
    if (cookie && value && minutes){    
        var dt = new Date();
        dt.setMinutes( dt.getMinutes() + minutes );
        document.cookie = cookie.toString().trim()+'='+value.toString().trim()+'; expires='+dt.toGMTString()+'; path=/;'; 
    }
},


setCookie(cookie,value){
    if (cookie){    
        document.cookie = cookie.toString().trim()+'='+value.toString().trim()+'; expires=Thu, 14 Jul 2050 12:00:00 UTC; path=/;'; 
    }
},
  
deleteCookie(cookie){
    document.cookie = cookie.toString().trim()+'=; expires=Thu, 14 Jul 1966 12:00:00 UTC; path=/;';  
},
  
getCookie(cookie){
     var cookies = this.getAllCookies();
     if (cookies.length){
         for(var i=0;i<cookies.length;i++){
             //console.log('COOKIE====['+cookies[i].cookie.trim()+']');
             if (cookie == cookies[i].cookie.trim()){
                 return cookies[i].value.trim();
             }
         }
     }
     return null;
},
  
getAllCookies(cookie){
    var cookies = [];
    var ck = document.cookie;
    if (ck){
        var ac = ck.split(';');
        //console.log('getAllCookies',ac);
        for (var i=0;i<ac.length;i++){
             var c = ac[i].split('=');
             cookies.push({
                cookie: c[0],
                value: c[1]
             });
        }
    }
    return cookies;
  },
  
clearCookies(){
      var that = this;
      var cookies = this.getAllCookies();
      cookies.forEach(c => {
         that.deleteCookie(c.cookie);
      });
  },


//========================  
//     USER FEEDBACK    //
//========================  

progressfn: null,
progress:false,


progressOn(){
   var f = this.get('progressfn');
   this.set('progress',true);
   if (f){
       f(true); 
   }   
},

progressOff(){
   var f = this.get('progressfn');
   this.set('progress',false);
   if (f){
       f(false); 
   }   
},

getProgress(){
  return this.get('progress');
},


}); // <=================  COMMONUTILS 


    
