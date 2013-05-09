'use strict';

var mountFolder = function (connect, dir) {
  return connect['static'](require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var options = {
    root: 'src',
    dist: 'dist',
    vendor: 'vendor'
  };

  grunt.initConfig({
    options: options,
    watch: {
      templates: {
        files: '<%= options.root %>/templates/{,*/}*.hbs',
        tasks: ['emberTemplates', 'livereload']
      },
      helpers: {
        files: '<%= options.root %>/js/helpers/{,*/}*.js',
        tasks: ['concat:helpers', 'livereload']
      },
      controllers: {
        files: '<%= options.root %>/js/controllers/{,*/}*.js',
        tasks: ['concat:controllers', 'livereload']
      },
      models: {
        files: '<%= options.root %>/js/models/{,*/}*.js',
        tasks: ['concat:models', 'livereload']
      },
      routes: {
        files: '<%= options.root %>/js/routes/{,*/}*.js',
        tasks: ['concat:routes', 'livereload']
      },
      views: {
        files: '<%= options.root %>/js/views/{,*/}*.js',
        tasks: ['concat:views', 'livereload']
      },
      less: {
        files: ['<%= options.root %>/css/{,*/}*.less'],
        tasks: ['less', 'livereload']
      },
      livereload: {
        files: [
          '<%= options.root %>/*.html',
          '<%= options.root %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      proxies: [{
        context: '/api',
        host: 'localhost',
        port: 8080,
        https: false,
        changeOrigin: false
      }],
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, options.vendor),
              mountFolder(connect, options.root)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= options.dist %>/*',
            '!<%= options.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= options.root %>/js/{,*/}*.js',
        'test/spec/{,*/}*.js'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    less: {
      app: {
        options: {
          paths: ['<%= options.root %>/css']
        },
        files: {
          '.tmp/css/app.css': '<%= options.root %>/css/app.less'
        }
      },
    },
    concat: {
      controllers: {
        src: ['<%= options.root %>/js/controllers/{,*/}*.js'],
        dest: '.tmp/js/controllers.js'
      },
      helpers: {
        src: ['<%= options.root %>/js/helpers/{,*/}*.js'],
        dest: '.tmp/js/helpers.js'
      },
      models: {
        src: ['<%= options.root %>/js/models/{,*/}*.js'],
        dest: '.tmp/js/models.js'
      },
      routes: {
        src: ['<%= options.root %>/js/routes/{,*/}*.js'],
        dest: '.tmp/js/routes.js'
      },
      views: {
        src: ['<%= options.root %>/js/views/{,*/}*.js'],
        dest: '.tmp/js/views.js'
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= options.dist %>/js/{,*/}*.js',
            '<%= options.dist %>/css/{,*/}*.css',
            '<%= options.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= options.dist %>/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= options.root %>/index.html',
      options: {
        dest: '<%= options.dist %>'
      }
    },
    usemin: {
      html: ['<%= options.dist %>/{,*/}*.html'],
      css: ['<%= options.dist %>/css/{,*/}*.css'],
      options: {
        dirs: ['<%= options.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= options.root %>/img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= options.dist %>/img'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= options.root %>/img',
          src: '{,*/}*.svg',
          dest: '<%= options.dist %>/img'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= options.dist %>/css/application.css': [
            '<%= options.vendor %>/css/{,*/}*.css',
            '.tmp/css/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= options.root %>',
          src: '*.html',
          dest: '<%= options.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= options.root %>',
          dest: '<%= options.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'img/{,*/}*.{webp,gif}',
            'fonts/*'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'emberTemplates',
        'less',
        'concat'
      ],
      test: [
      ],
      dist: [
        'emberTemplates',
        'less',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    uglify: {
      options: {
        beautify: true
      }
    },
    emberTemplates: {
      options: {
        templateName: function (sourceFile) {
          var templatePath = options.root + '/templates/';
          return sourceFile.replace(templatePath, '');
        }
      },
      dist: {
        files: {
          '.tmp/js/templates.js': '<%= options.root %>/templates/{,*/}*.hbs'
        }
      }
    }
  });

  grunt.renameTask('regarde', 'watch');
  grunt.renameTask('ember_templates', 'emberTemplates');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'configureProxies',
      'livereload-start',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
