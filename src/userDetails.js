const electron = require('electron');
const { ipcRenderer: ipc } = electron;
const remote = require('remote');
const session =remote.session;
session.defaultSession.cookies.get({url: 'https://eventdesktop.com'}, (error, cookies) => {
	const userName = cookies[0].value;
	document.getElementById("userDetails").innerHTML=`<div>Welcome ${userName}</div>`;
});
