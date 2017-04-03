const electron = require('electron');
const electronOauth2 = require('electron-oauth2');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const {session} = require('electron');
var GoogleSpreadsheet = require('google-spreadsheet');
const fetch = require('node-fetch');
var async = require('async');
const windows = []
const qs = require('qs');
const axios = require('axios');
const {parse} = require('url');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me'
const GOOGLE_REDIRECT_URI = 'http://localhost'
const GOOGLE_CLIENT_ID = '221026750825-6s74r6pa2qu0iqbdebel5uhlfo5b4p31.apps.googleusercontent.com'
app.on('ready', _ => {
  
    let win = new BrowserWindow({
      height: 800,
      width: 1400
    })
    win.loadURL(`file://${__dirname}/countdown.html`);

    function useJive () {
       return new Promise((resolve, reject) => { 
        const authWindow = new BrowserWindow({
          width: 500,
          height: 600,
          show: true,
        })

        const urlParams = {
          response_type: 'code',
          redirect_uri: GOOGLE_REDIRECT_URI,
          client_id: GOOGLE_CLIENT_ID,
          scope: 'profile email',
        }
        const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`;
        function handleNavigation (url) {
          const query = parse(url, true).query
          if (query) {
            if (query.error) {
              reject(new Error(`There was an error: ${query.error}`))
            } else if (query.code) {
              // Login is complete
              // console.log(query.code);
              authWindow.removeAllListeners('closed')
              setImmediate(() => authWindow.close());
              resolve(query.code);
              // This is the authorization code we need to request tokens
              resolve(query.code);
            }
          }
        }
        authWindow.on('closed', () => {
          // TODO: Handle this smoothly
          throw new Error('Auth window was closed by user')
        })

        authWindow.webContents.on('will-navigate', (event, url) => {
          handleNavigation(url)
        })

        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
          handleNavigation(newUrl)
        })
        authWindow.loadURL(authUrl);

    });
    };
    function fetchAccessTokens(code) {
      // console.log(code , "am i here?");
      return axios.post(GOOGLE_TOKEN_URL, qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      // console.log(response.data)
      // return response.data
    }
    win.openDevTools();
    win.on('closed', _ => {
      win = null
    })
    windows.push(win);
    const tokens = "";
    ipc.on('countdown-start', (req, res) => {
        var data = useJive().then(function (test) {
           fetchAccessTokens(test).then(function (argument) {
              console.log(argument) 
           })
           // console.log(`${tokens} please give me defined`);
           // console.log("tokens", test)

        }, function (e) {
           console.error(e)
        })
        // console.log("data", data)
        // console.log(`${tokens} please give me undefined`);
    })


})

