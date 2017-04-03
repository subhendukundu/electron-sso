const remote = require('remote');
const request = require('request');
const session =remote.session;
let userData;
session.defaultSession.cookies.get({url: 'https://eventdesktop.com'}, (error, cookies) => {
	console.log(cookies[0].value);
	var token = cookies[0].value;
	var options = {
	    url: 'https://vox-uat.publicis.sapient.com/api/core/v3/people/@me',
	    headers: {
	        'Authorization': 'Bearer ' + token
	    }
	}
	var parseJiveResponse = function(response) {
	    'use strict';
	    var trimmedResponse = response.replace('throw \'allowIllegalResourceCall is false.\';', '');
	    return trimmedResponse !== '' ? JSON.parse(trimmedResponse) : {};
	};
    request(options, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var userDetail = parseJiveResponse(body);
            var email;
            for (var i in userDetail.emails) {
                if (userDetail.emails[i].type == 'work') {
                    email = userDetail.emails[i].value;
                    break;
                }
            }
            var profile = {};
            for (var j in userDetail.jive.profile) {
                profile[userDetail.jive.profile[j]['jive_label']] = userDetail.jive.profile[j]['value'];
            }
            var contactNumber = {};
            for (var k in userDetail.phoneNumbers) {
                contactNumber[userDetail.phoneNumbers[k]['jive_label']] = userDetail.phoneNumbers[k]['value'];
            }
            var userInfo = {
                name: profile['Display Name'],
                email: email,
                careerStage: profile['Career Stage'],
                profilePic: userDetail.thumbnailUrl,
                ntId: userDetail.jive.username,
                homeLocation: profile['Home Office'],
                contact: contactNumber['Mobile Phone'],
                isActive: 1
            };
            console.log(userInfo)
            var theDiv = document.getElementById("user-details");
			var content = document.createTextNode(userInfo);
			theDiv.appendChild(content);
        }
    });
});

