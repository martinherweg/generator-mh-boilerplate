/**
 * Combine all Prompts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

// Import some prompt modules
const projectPrompts = require('./project');
const authorPrompts = require('./author');
const craftPrompts = require('./craft');
const laravelPrompts = require('./laravel');
const vuePrompts = require('./vue');

function prompts() {
  return [
    ...projectPrompts,
    ...craftPrompts,
    ...laravelPrompts,
    ...vuePrompts,
    ...authorPrompts,
  ];
}

module.exports = prompts;
