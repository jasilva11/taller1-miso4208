'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var express = require('express');
var ghPages = require('gh-pages');
var packageJson = require('./package.json');
var path = require('path');
var runSequence = require('run-sequence');
var swPrecache = require('sw-precache');

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
  var config = {
    cacheId: 'appShell',
    handleFetch: handleFetch,
    logger: $.util.log,
    runtimeCaching: [{
      // See https://github.com/GoogleChrome/sw-toolbox#methods
      urlPattern: /^https:\/\/api-ratp.pierre-grimaud\.fr\/v3\/schedules/,
      handler: 'cacheFirst',
      // See https://github.com/GoogleChrome/sw-toolbox#options
      options: {
        cache: {
          maxEntries: 10,
          name: 'runtime-cache'
        }
      }
    }],
    staticFileGlobs: [
      rootDir + '/styles/**.css',
      rootDir + '/**.html',
      rootDir + '/images/**.*',
      rootDir + '/scripts/**.js',
    ],
    stripPrefix: rootDir + '/',
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: true
  };
  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
}

gulp.task('generate-service-worker-dev', function(callback) {
  writeServiceWorkerFile('./', true, callback);
});