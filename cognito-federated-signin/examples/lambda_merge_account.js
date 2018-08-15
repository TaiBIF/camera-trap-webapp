exports.handler = (event, context, callback) => {

    var AWS = require('aws-sdk');
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    
    console.log(event);
    
    //*
    if (event.request.userAttributes.hasOwnProperty("email")) {

        // list users
        var email_filter = {
            "AttributesToGet": null,
            "Filter": "email=\"" + event.request.userAttributes.email + "\"",
            "UserPoolId": event.userPoolId
        };

        cognitoidentityserviceprovider.listUsers(email_filter, function(err, data) {

            //console.log("\nData:\n");
            //console.log(data);
            //console.log("\nData.Attributes:\n");
            //console.log(data.Users[0].Attributes);           // successful response
            
            if (err) console.log(err, err.stack); // an error occurred
            else {
                
                // if no existed user found, sign up normally
                if (!data.Users || data.Users.length == 0) {
                    return;
                }
                
                // we merge and no sign up, but how to sign user in?
                var targetIdentitiesContainer = data.Users[0].Attributes.filter(function (attr) {
                    return attr.Name == 'identities';
                });
                
                var identities = JSON.parse(targetIdentitiesContainer[0].Value);
                
                var targetUserId = identities[0].userId;
                var targetProviderName = identities[0].providerName;

                mergeUserTo({id: targetUserId, provider: targetProviderName});

            }
        });
    }
    //*/
    
    function mergeUserTo (target) {

        var params = {
            DestinationUser: { /* required */
                //ProviderAttributeName: 'email',
                ProviderAttributeValue: target.id,
                ProviderName: target.provider
              },
            SourceUser: { /* required */
                ProviderAttributeName: 'Cognito_Subject',
                ProviderAttributeValue: event.userName.split('_')[1],
                ProviderName: event.userName.split('_')[0]
            },
            UserPoolId: event.userPoolId
        };
        
        console.log(params);
        
        cognitoidentityserviceprovider.adminLinkProviderForUser(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);           // successful response
            }
        });
    }
    
    // Return to Amazon Cognito
    // default behavior
    callback(null, event);
};
