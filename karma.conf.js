// Karma configuration
// Generated on Fri Jun 19 2015 20:52:11 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['systemjs', 'jasmine'],

    systemjs: {
      configFile: 'system.conf.js',

      files: [
        'lib/**/*.js',
        'test/**/*.spec.js',

        'bower_components/backbone/backbone.js',
        'bower_components/flux/dist/Flux.js',
        'bower_components/fl-store/lib/**/*.js', // use the ES6 version
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js'
      ],

      testFileSuffix: '.spec.js'
    },


    // list of files / patterns to load in the browser
    // this is what karma will serve..
    files: [
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
