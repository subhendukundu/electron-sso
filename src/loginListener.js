const electron = require('electron')

const ipc = electron.ipcRenderer

document.getElementById('start').addEventListener('click', _ => {
  ipc.send('countdown-start')
})

ipc.on('asynchronous-reply', (evt, count) => {
  console.log(count)
})
