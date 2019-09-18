import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({

    // COMMON INFORMATION 
    firstname:    DS.attr('string'), // First Name
    lastname:     DS.attr('string'), // Last Name
    birthday:     DS.attr('string'), // Date of birth 
    phone:        DS.attr('string'), // Mobile phone   
    email:        DS.attr('string'), // Email   
    country:      DS.attr('string'), // Country of residence   
    
    photo:        DS.attr('string',{ // Photo 
                     defaultValue() { return '/assets/images/unknown.jpg'; }
                  }),
    
    // CONTESTANT INFORMATION

    character:    DS.attr('string'), // Star Wars Character   
    managerid:    DS.attr('string'), // Contestant manager ID   
    
    // CONTROL INFORMATION
    createdat:    DS.attr('date', {  // Creation date 
                      defaultValue() { return new Date(); }
                  }),

});
