import log from './tasks/log'
import isCi from './tasks/is-ci'

/**
 * The collection of tasks to use with `cy.task()`
 * @param on `on` is used to hook into various events Cypress emits
 */
export default function tasks(on: Cypress.PluginEvents) {
  on('task', {log})
  on('task', {isCi})
  // add tasks here
}
