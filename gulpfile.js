function plugin (name) {
	return require('rollup-plugin-' + name);
}

const gulp   = require('gulp'),
      gulpif = require('gulp-if'),
      
      del    = require('del'),
      rename = require('gulp-rename'),
      newer  = require('gulp-newer'),
      
      htmlmin  = require('gulp-htmlmin'),
      cleancss = require('gulp-clean-css'),
      buble    = require('gulp-buble'),
      uglify   = require('gulp-uglify'),
      
      rollup  = require('gulp-rollup'),
      plugins = [
      	plugin('node-resolve')(),
      	plugin('commonjs')(),
      	plugin('json')(),
      	plugin('vue').default()
      ],
      
      sync = require('browser-sync').create();

let PRODUCTION = process.env.NODE_ENV !== 'development',
    noReplacePlugin = true,
    jswatcher;

gulp.task('clean', function (done) {
	del('docs');
	done();
});

gulp.task('assets', function () {
	return gulp.src('assets/**', { since: gulp.lastRun('assets') })
		.pipe(newer('docs/assets'))
		.pipe(gulp.dest('docs/assets'));
});

gulp.task('html', function () {
	return gulp.src('src/*.html', { since: gulp.lastRun('html') })
		.pipe(gulpif(PRODUCTION, htmlmin({
			collapseWhitespace: true,
			removeComments: true
		})))
		.pipe(gulp.dest('docs'));
});

gulp.task('css', function () {
	return gulp.src('src/styles/index.css')
		.pipe(cleancss({
			rebase: false
		}))
		.pipe(gulp.dest('docs'));
});

function getWatched (watcher) {
	let watched = watcher.getWatched(),
	    array = new Array();
	
	for (let dir in watched)
		for (let file of watched[dir])
			if (/\.\w+$/.test(file)) array.push(dir + '/' + file);
	
	return array;
}

gulp.task('js', function () {
	if (noReplacePlugin) {
		plugins.push(plugin('replace')({
			'process.env.NODE_ENV': PRODUCTION ? '"production"' : '"development"'
		}));
		noReplacePlugin = false;
	}
	
	return gulp.src('src/scripts/main.js')
		.pipe(rollup({
			allowRealFiles: true,
			
			input: 'src/scripts/main.js',
			output: {
				file: 'app.js',
				format: 'iife'
			},
			plugins,
			treeshake: PRODUCTION ? {
				pureExternalModules: true
			} : false
		}))
		.on('bundle', function (bundle) {
			if (!jswatcher) return;
			
			let watched = getWatched(jswatcher),
			    ids = bundle.modules.map(module => module.id),
			    unwatch = watched.filter(id => ids.indexOf(id) == -1);
			
			ids = ids.filter(id => watched.indexOf(id) == -1);
			
			jswatcher.unwatch(unwatch);
			jswatcher.add(ids);
		})
		.pipe(gulpif(PRODUCTION, buble({
			transforms: {
				dangerousForOf: true
			}
		})))
		.pipe(gulpif(PRODUCTION, uglify()))
		.pipe(rename('app.js'))
		.pipe(gulp.dest('docs'));
});

gulp.task('watch', function (done) {
	gulp.watch('assets/**',           gulp.series('assets'));
	gulp.watch('src/*.html',          gulp.series('html'));
	gulp.watch('src/styles/**/*.css', gulp.series('css'));
	
	jswatcher = gulp.watch('src/scripts/main.js', gulp.series('js'));
	
	done();
});

gulp.task('server', function () {
	sync.init({
		server: 'docs',
		files: 'docs/**/*',
		open: false
	});
});

gulp.task('dev:init', function (done) {
	PRODUCTION = false;
	done();
});

gulp.task('build', gulp.series('assets', 'html', 'css', 'js'));
gulp.task('dev',   gulp.series('dev:init', 'watch', 'build', 'server'));

gulp.task('default', gulp.series('clean', 'build'));
