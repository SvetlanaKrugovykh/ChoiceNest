/**
 * Для установки сервиса:
 *   node service.js
 * Для удаления сервиса:
 *   node service.js --uninstall
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

svc.on('uninstall', () => {
  console.log('Service uninstalled')
})


if (process.argv.includes('--uninstall')) {
  svc.uninstall()
} else {
  svc.install()
}