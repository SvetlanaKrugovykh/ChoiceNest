/**
 *   node src/winService.js --install
 *   node src/winService.js --uninstall
 */

const Service = require('node-windows').Service
const path = require('path')

const scriptPath = path.join(__dirname, 'server.js')

const svc = new Service({
  name: 'ChoiceNestService',
  description: 'ChoiceNest NodeJS Service',
  script: scriptPath,
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    }
  ]
})

svc.on('install', () => {
  console.log('Service installed')
  svc.start()
})

svc.on('alreadyinstalled', () => {
  console.log('Service already installed')
})

svc.on('start', () => {
  console.log('Service started')
})

svc.on('stop', () => {
  console.log('Service stopped')
})

svc.on('error', (err) => {
  console.error('Service error:', err)
})

svc.install()