
let project_folder = "dist";
let source_folder = "#src";

let fs = require('fs');

let path = {
	build: {
		html: project_folder + "/",
		js: project_folder + "/js/",
		css: project_folder + "/css/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
		json: project_folder + "/json/"
	},
	src: {
		favicon: source_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
		html: [source_folder + "/**/*.html", "!" + source_folder + "/_*.html"],
		js: [source_folder + "/js/app.js", source_folder + "/js/vendors.js"],
		css: source_folder + "/scss/style.scss",
		img: [source_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		fonts: source_folder + "/fonts/*.ttf",
		json: source_folder + "/json/**/*.*"
	},
	watch: {
		html: source_folder + "/**/*.html",
		js: source_folder + "/**/*.js",
		css: source_folder + "/scss/**/*.scss",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
		json: source_folder + "/json/**/*.*"
	},
	clean: "./" + project_folder + "/"
};

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webphtml = require('gulp-webp-html'),
	webp = require('imagemin-webp'),
	webpcss = require("gulp-webpcss"),

	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	newer = require('gulp-newer');

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}
function css() {
	return src(path.src.css)


		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)

		.pipe(
			group_media()
		)

		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{ webpClass: '', noWebpClass: '.no-webp' },
			['.jpg', '.jpeg', '.png']))
		.pipe(dest(path.build.css))
		.pipe(clean_css())

		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}
function images() {
	return src(path.src.img)
		.pipe(newer(path.build.img))
		.pipe(
			imagemin([
				webp({
					quality: 75
				})
			])
		)
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(newer(path.build.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.img))
}
function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
};
function fonts_otf() {
	return src('./' + source_folder + '/fonts/*.otf')
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulp.dest('./' + source_folder + '/fonts/'));
}

function fontstyle() {
	let file_content = fs.readFileSync(source_folder + '/scss/settings/settings.fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/settings/settings.fonts.scss', '', cb);
		fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/settings/settings.fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
	return src(path.src.html).pipe(browsersync.stream());
}
function cb() { }
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}
function clean(params) {
	return del(path.clean);
}


let fontsBuild = gulp.series(fonts_otf, fonts, fontstyle);
let buildDev = gulp.series(clean, gulp.parallel(fontsBuild, html, css, js, images));
let watch = gulp.series(buildDev, gulp.parallel(watchFiles, browserSync));

exports.fonts = fontsBuild;
exports.watch = watch;
exports.default = watch;