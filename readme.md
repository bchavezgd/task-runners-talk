# Modern Task Runners 

## Rewind. 

Websites used to be easy to make. A single html file, a few images, and a Geocities account, and you have yourself a website. Frames were the layout tool of choice, and soon after Tables, then Floats. Now we have Flex-box nearly ready for show time.

We also have abandoned Flash for Javascript and Canvas, and I haven't seen a Java Applet for a while. 

Some of these technologies have become simpler, some have be come more robust, and inherently more complex. 

While a Geocities site would still work on the website today, it'll show it's age like an 8-track tape. Where one person could be a "Webmaster" 15 years ago, today it takes a team of programers, designers, writers, and photographers, working together to maintain a site. The team can be small or huge, depending on the user base of the site. As a designer I focus on the look and feel of a website.  

## Abstraction. 

The Introduction of CSS as a separate file was the first abstraction of web technology that I had to figure out. Because learning implied structured teaching. JavaScript eluded me until more recently. 

Now there are *Preprocessors* that add another layer of abstraction to the core languages of front end design. 

- **CSS:** SASS / LESS / Stylus
- **JavaScript:** Coffescript / Typescript / Livescript / Bable
- **HTML:** HAML / Jade / slim

Since I started using these preprocessors I've found that I make less mistakes, especially the most annoying kind. Like hex code typos for colors, missing closing tags, missed semicolons, and so on. 

But they can also add another error prone process... since they have to be processed to spit out the language that a server expects. 

## What is a *Task Runner?*

Distilled down to its simplest form, a task runner is a simple program to run other simple programs. I'll be using SASS as my example throughout these examples. SASS itself is a perfect example of a task. Since web browsers can't use a sass file directly (yet), they need to be compiled down to a CSS file. This is especially true if you plan on using the more powerful features of SASS, like mixins and maps. The original way was to use the command line. 

```term
$ gem install sass

$ sass --watch input.scss:output.scss
```

This first installs the ruby-sass gem on to your computer, the second line watches the `input.scss` file for changes, then complies it to `output.css`, this is easy enough, but what if you wanted sass to export a minified css file? You would need a `config.rb` to do so. Another problem with that is, Ruby isn't well supported on Windows. Now if we wanted to make sure the CSS we are using has the correct prefixes we need to maintain a library of mixins, and remember to update them each time a browser is released. 

Now lets throw in some JavaScript minification, concatenation, after running it through a JS Linter. There's a lot of work going on for even a simple site. 

Doing all these small tasks takes time. Even just taking the time to find the options in the UI of whatever program you're using reduces productivity, and its error prone. Check box settings will be the death of me. 


### Task Runners to the rescue 

Task runners do all these small things, the exact same way, every time I save a file. 

There are too many task runners to really compare right now. So I'll focus on the 2 most talked about ones. Grunt and Gulp. 

## Setups

### Installing

Since they are both available through NPM, installing them is identical, first theSecond CLI is installed so the terminal knows what to do when you type in `grunt` or `gulp`. Second is the task runner itself. 

Then to run the tasks it's simple as typing either `grunt` or `gulp`. This will run the "default" task unless you specify a different task such as `$ gulp watch`

|  | Grunt | Gulp |
|---|---|---|---|
| installing CLI|`$ npm install grunt-cli -g` | `$ npm install gulp -g `|
| installing Task Runner| `$ npm install grunt --save-dev` | `$ npm install gulp --save-dev` |
| Running Tasks  | `$ grunt` | `$ gulp` |

### setting up the task. 

1. compile
2. prefix
3. minify
4. watch

For demonstration purposes I'm limiting myself to these 4 tasks. Working with a sass I want to *compile* it down to a CSS file, *Prefix* that file, and have its output *minified*. I want all this to be done every time I save a sass file, and that's where the *Watch* task comes in. 

#### Boilerplate Task Files

Both Task runners depend on a file that tells your computer what tasks you want it to do. 

`Gruntfile.js`

```js
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        /* Task Configuration Wrapper */
    
    });
    /* load plugins */ 
    /* Register Tasks */
    grunt.registerTask('default', []);
};
``` 

`Gulpfile.js`

```js
// load plugins
var gulp = require('gulp');

// defining tasks
gulp.task('default', []);
```

Both of these files do nothing, but they are ready to create some tasks. 

### Finding and Installing Plugins

You can goto either Gruntjs.com, or Gulpjs.com and search their plugins. I’ve been able to find most of them on Github as well. For sass I want to use the faster Node based LibSASS plugin. a quick search for "grunt node sass" returns grunt-sass and the counter part is gulp-sass. So next I want to find an autoprefixer, and a way to watch the files for changes.

Searching turns up postcss and a watch plugins that are available for both Grunt and Gulp.

Again, installing is basically an identical process.

|Installation |Grunt|Gulp|
|---|---|---|
| Node Sass |`$ npm install --save-dev grunt-sass` | `$ npm install --save-dev gulp-sass` | 
| postcss | `$ npm install --save-dev grunt-postcss` |`$ npm install --save-dev gulp-postcss`|
| Watch | `$ npm install --save-dev grunt-contrib-watch` | `$ npm install --save-dev gulp-watch` |

Side notes: 

1. There are two Grunt Sass plugins, I'm using `grunt-sass` but there is `grunt-contrib-sass` also. both work well and are well supported, but anytime you see `contrib` in a plugin name, it was made by the grunt team themselves so it's safe to assume it's well supported. and in this case, `grunt-sass` is based on libSASS and `grunt-contrib-sass` is ruby based, so you'd need to install ruby and the sass gem to your computer to get it to work, and ruby is slower anyway. 
2. postcss has it's own plugins that need to be loaded. In this case I want to since i want to prefix and minify what the sass plugins spit out so the postcss plugins need to be loaded with `$ npm install --save-dev autoprefixer cssnano` 

Now I have the plugins ready to be told what to do. 

### Defining Tasks

Once the plugins have been copied into your project's `node_module` folder we can start accessing them from the task files. 

`Grunt` 

```js 
    /* load plugins */ 
    grunt.loadNpmTask('grunt-sass');
    grunt.loadNpmTask('grunt-postcss');
    grunt.loadNpmTask('grunt-contrib-watch');
```

`Gulp`

```js

var gulp = require('gulp'),
    /* load plugins */
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	watch = require('gulp-watch');
```

This is telling the task runners what plugins they should be using.
 
### Primary Differences 

Up to this point the code has been remarkably similar, this is where they start diverging away from each other.  

| Grunt | Gulp |
|---|---|
|Configuration over Code | Code over Configuration |
|synchronous | asynchronous |
|4,403 plugins | 2,093 plugins |

Grunt stores task settings as **objects,** and the patterns get repeated to other plugins. While setting up tasks, they are set up in order and will always work in that order. Like an assembly line. 

Gulp tasks are as **functions,** and the patterns are less repetitious than with Grunt. The upside is that there is much more customization for what you could do with a plugin. Since Gulp is based on Node, the developers decided to take advantage of Nodes asynchronous abilities, this means that when running Gulp tasks they'll all run at the same time. This is much quicker than. The downside is that tasks like autoprefixer shouldn't be run at the same time sass is compiling the stylesheet it needs to process. This isn't idea, but there are three ways to make task synchronous: 

1. using a callback
2. making a "promise"
3. creating dependency tasks

But since I'm only worried about one set of tasks at a time, I can still run three difference processes asynchronously, i.e., JavaScript, CSS, Image processing, and HTML manipulations. These are four different workflows that can be put through the same *pipe* all at once, with remarkable speed.
 
##### Setting Up Tasks

Before I even start getting knee deep into setting up my tasks, first I want to make sure that my source and destination files will be in the correct folders. I save the folder locations as variables in the file before I start. 

Grunt: this is contained inside of the wrapper above the `/* Task Configuration Wrapper */` marker.

```js
/* path variables */
paths: {
  src: './_src',
  dist: './_site'
},
```

Gulp: These I put in under the `/* loading plugins */` marker after the plugins. 

```js 
/* path variables */
src = './_src',
dist = './_site';
```


#### Grunt setup

Grunt tasks store the task settings as objects, and the patterns get repeated to other plugins.  

```js 
sass: {
  options: {
    sourceComments: true
  },
  files: {
    src: '<%= paths.src %>/sass/style.sass',
    dest: '<%= paths.dist %>/style.css'
  }
}
```

Within the SASS object, there are 2 nested objects telling the task what files to process, and how to process them (options). The options here are pulled from the Node Sass, but for other plugins always refer to the documentation, it's usually useful. 

Now the task has been told what to do, I need to make sure it knows when to do it. At the bottom of the Grunt file the task needs to be "registered."

```js 
/* Register Tasks */
grunt.registerTask('default', ['sass']);
```

so now in the command line I can enter

    $ grunt
    
Which will run the default task, which runs only the sass task. Or I can run the Sass task directly with 

    $ grunt sass

If this is all I wanted to do that would be a lot of work for something that the sass gem could have done with less setup, but adding a the postcss task and the task runner starts to carry its own weight. 

##### postcss

```js
// css post processer.
postcss: {
  options: {
    map: {
      inline: true // save all source maps as separate files...
    },
    processors: [
require('autoprefixer')({
        /* options */
        browsers: 'last 2 versions' // add vendor prefixes
      }),
require('cssnano')() // minify the result
]
  },
  files: {
    src: '<%= paths.dist %>/style.css',
    dest: '<%= paths.dist %>/style.css'
  }
}
```

The *postcss* task has the same options and files objects as the sass task did, but with different settings. 

Now the task can be "registered"

```js
    /* Register Tasks */
    grunt.registerTask('default', ['sass', 'postcss']);
```

And they will run in the order that they are entered here. 

##### Watch

Finally I'll add the watch command so I don't have to keep going back to the command line to type `$ grunt` after every time I save my work. 

```js 
watch: {
    dev: {
        files: [
            '<%= paths.src %>/sass/**/*'
        ],
        tasks: ['sass', 'postcss'],
        options: {
            livereload: true
        }
    }
}
```

This is set up to watch all folders, and files, in the sass folder and whenever Grunt detects a change, it runs the tasks specified, with the defined options. To get that started, I just goto my command line and use: 

    $ grunt watch
    

#### Gulp Setup

For this demonstration, I'm going to make a gulpfile that does the **exact** same thing as my grunt file. 

I've already loaded the Gulp plugins 

So here is the sass set up. 

```js
gulp.task('sass', function () {
  gulp.src(src + '/sass/style.sass')
    .pipe(sass({
      /* options */
      outputStyle: 'expanded'
    })
    .pipe(gulp.dest(dist));
});
```

When activated it looks for the file specified, and spits out a processed css file. 

The options available are the same Node-sass based options that you can pass in Grunt, in the same way. Now with the command line I can run;

    $ gulp sass
    
It will Run the Sass task, and spit out a CSS file. 

##### postcss

Setting up the postcss task is similar as the sass task. 

```js
gulp.task('postcss', function () {
  gulp.src(dist + '/style.css')
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      })
    ]))
    .pipe(gulp.dest(dist));
});
```

Now in the command line. 

    $ gulp postcss
    
Will add prefixes to whenever necessary to the style.css which the sass task spit out. 

I add this to the `default` task. 

```js
gulp.task('default', ['sass', 'postcss'])
```

##### Making them run Synchronously 

Running the default task now would run both the Sass and Postcss task asynchronously and sometimes they work right... but usually not. So to insure that they run in the correct order I need to make the run in  order (synchronously). I'll do this by making the postcss task dependent on the sass task. First I'll modify the postcss code. 

```js
gulp.task('postcss', ['sass'], function () {
  gulp.src(dist + '/style.css')
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      }),
      cssnano()
    ]))
    .pipe(gulp.dest(dist));
});
```

Now this task is looking to the 'sass' task before it runs its own function. 

The Sass code has to be modified slightly as well, by adding the keyword `return` this makes the function run synchronously. 

```js
gulp.task('sass', function () {
	return  gulp.src( src + '/sass/style.sass')
    .pipe(
    	sass({
	      /* options */
	      outputStyle: 'expanded'
	    })
    )
    .pipe( gulp.dest( dist ) )
});
```

##### Gulp Watch

Setting up the watch task is more of the same, here's the code. 

```js
gulp.task('watch', function () {
	gulp.watch(src + 'sass/**/*', ['postcss']);
});
```

It defines the folder to watch, and the task to run. Since postcss has a sass dependency both tasks will run in order, and have the same output as Grunt.

## Conclusion. 

Both of these tools where built to increase productivity, and deciding between the two will be a personal decision. Hopefully I've demystified both Grunt and Gulp to the point that someone will give them a try. 

# Modern Task Runners 

## Rewind. 

Websites used to be easy to make. A single html file, a few images, and a Geocities account, and you have yourself a website. Frames were the layout tool of choice, and soon after Tables, then Floats. Now we have Flex-box nearly ready for show time.

We also have abandoned Flash for Javascript and Canvas, and I haven't seen a Java Applet for a while. 

Some of these technologies have become simpler, some have be come more robust, and inherently more complex. 

While a Geocities site would still work on the website today, it'll show it's age like an 8-track tape. Where one person could be a "Webmaster" 15 years ago, today it takes a team of programers, designers, writers, and photographers, working together to maintain a site. The team can be small or huge, depending on the user base of the site. As a designer I focus on the look and feel of a website.  

## Abstraction. 

The Introduction of CSS as a separate file was the first abstraction of web technology that I had to figure out. Because learning implied structured teaching. JavaScript eluded me until more recently. 

Now there are *Preprocessors* that add another layer of abstraction to the core languages of front end design. 

- **CSS:** SASS / LESS / Stylus
- **JavaScript:** Coffescript / Typescript / Livescript / Bable
- **HTML:** HAML / Jade / slim

Since I started using these preprocessors I've found that I make less mistakes, especially the most annoying kind. Like hex code typos for colors, missing closing tags, missed semicolons, and so on. 

But they can also add another error prone process... since they have to be processed to spit out the language that a server expects. 

## What is a *Task Runner?*

Distilled down to its simplest form, a task runner is a simple program to run other simple programs. I'll be using SASS as my example throughout these examples. SASS itself is a perfect example of a task. Since web browsers can't use a sass file directly (yet), they need to be compiled down to a CSS file. This is especially true if you plan on using the more powerful features of SASS, like mixins and maps. The original way was to use the command line. 

```term
$ gem install sass

$ sass --watch input.scss:output.scss
```

This first installs the ruby-sass gem on to your computer, the second line watches the `input.scss` file for changes, then complies it to `output.css`, this is easy enough, but what if you wanted sass to export a minified css file? You would need a `config.rb` to do so. Another problem with that is, Ruby isn't well supported on Windows. Now if we wanted to make sure the CSS we are using has the correct prefixes we need to maintain a library of mixins, and remember to update them each time a browser is released. 

Now lets throw in some JavaScript minification, concatenation, after running it through a JS Linter. There's a lot of work going on for even a simple site. 

Doing all these small tasks takes time. Even just taking the time to find the options in the UI of whatever program you're using reduces productivity, and its error prone. Check box settings will be the death of me. 


### Task Runners to the rescue 

Task runners do all these small things, the exact same way, every time I save a file. 

There are too many task runners to really compare right now. So I'll focus on the 2 most talked about ones. Grunt and Gulp. 

## Setups

### Installing

Since they are both available through NPM, installing them is identical, first theSecond CLI is installed so the terminal knows what to do when you type in `grunt` or `gulp`. Second is the task runner itself. 

Then to run the tasks it's simple as typing either `grunt` or `gulp`. This will run the "default" task unless you specify a different task such as `$ gulp watch`

|  | Grunt | Gulp |
|---|---|---|---|
| installing CLI|`$ npm install grunt-cli -g` | `$ npm install gulp -g `|
| installing Task Runner| `$ npm install grunt --save-dev` | `$ npm install gulp --save-dev` |
| Running Tasks  | `$ grunt` | `$ gulp` |

### setting up the task. 

1. compile
2. prefix
3. minify
4. watch

For demonstration purposes I'm limiting myself to these 4 tasks. Working with a sass I want to *compile* it down to a CSS file, *Prefix* that file, and have its output *minified*. I want all this to be done every time I save a sass file, and that's where the *Watch* task comes in. 

#### Boilerplate Task Files

Both Task runners depend on a file that tells your computer what tasks you want it to do. 

`Gruntfile.js`

```js
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        /* Task Configuration Wrapper */
    
    });
    /* load plugins */ 
    /* Register Tasks */
    grunt.registerTask('default', []);
};
``` 

`Gulpfile.js`

```js
// load plugins
var gulp = require('gulp');

// defining tasks
gulp.task('default', []);
```

Both of these files do nothing, but they are ready to create some tasks. 

### Finding and Installing Plugins

You can goto either Gruntjs.com, or Gulpjs.com and search their plugins. Ib ve been able to find most of them on Github as well. For sass I want to use the faster Node based LibSASS plugin. a quick search for "grunt node sass" returns grunt-sass and the counter part is gulp-sass. So next I want to find an autoprefixer, and a way to watch the files for changes.

Searching turns up postcss and a watch plugins that are available for both Grunt and Gulp.

Again, installing is basically an identical process.

|Installation |Grunt|Gulp|
|---|---|---|
| Node Sass |`$ npm install --save-dev grunt-sass` | `$ npm install --save-dev gulp-sass` | 
| postcss | `$ npm install --save-dev grunt-postcss` |`$ npm install --save-dev gulp-postcss`|
| Watch | `$ npm install --save-dev grunt-contrib-watch` | `$ npm install --save-dev gulp-watch` |

Side notes: 

1. There are two Grunt Sass plugins, I'm using `grunt-sass` but there is `grunt-contrib-sass` also. both work well and are well supported, but anytime you see `contrib` in a plugin name, it was made by the grunt team themselves so it's safe to assume it's well supported. and in this case, `grunt-sass` is based on libSASS and `grunt-contrib-sass` is ruby based, so you'd need to install ruby and the sass gem to your computer to get it to work, and ruby is slower anyway. 
2. postcss has it's own plugins that need to be loaded. In this case I want to since i want to prefix and minify what the sass plugins spit out so the postcss plugins need to be loaded with `$ npm install --save-dev autoprefixer cssnano` 

Now I have the plugins ready to be told what to do. 

### Defining Tasks

Once the plugins have been copied into your project's `node_module` folder we can start accessing them from the task files. 

`Grunt` 

```js 
    /* load plugins */ 
    grunt.loadNpmTask('grunt-sass');
    grunt.loadNpmTask('grunt-postcss');
    grunt.loadNpmTask('grunt-contrib-watch');
```

`Gulp`

```js

var gulp = require('gulp'),
    /* load plugins */
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	watch = require('gulp-watch');
```

This is telling the task runners what plugins they should be using.
 
### Primary Differences 

Up to this point the code has been remarkably similar, this is where they start diverging away from each other.  

| Grunt | Gulp |
|---|---|
|Configuration over Code | Code over Configuration |
|synchronous | asynchronous |
|4,403 plugins | 2,093 plugins |

Grunt stores task settings as **objects,** and the patterns get repeated to other plugins. While setting up tasks, they are set up in order and will always work in that order. Like an assembly line. 

Gulp tasks are as **functions,** and the patterns are less repetitious than with Grunt. The upside is that there is much more customization for what you could do with a plugin. Since Gulp is based on Node, the developers decided to take advantage of Nodes asynchronous abilities, this means that when running Gulp tasks they'll all run at the same time. This is much quicker than. The downside is that tasks like autoprefixer shouldn't be run at the same time sass is compiling the stylesheet it needs to process. This isn't idea, but there are three ways to make task synchronous: 

1. using a callback
2. making a "promise"
3. creating dependency tasks

But since I'm only worried about one set of tasks at a time, I can still run three difference processes asynchronously, i.e., JavaScript, CSS, Image processing, and HTML manipulations. These are four different workflows that can be put through the same *pipe* all at once, with remarkable speed.
 
##### Setting Up Tasks

Before I even start getting knee deep into setting up my tasks, first I want to make sure that my source and destination files will be in the correct folders. I save the folder locations as variables in the file before I start. 

Grunt: this is contained inside of the wrapper above the `/* Task Configuration Wrapper */` marker.

```js
/* path variables */
paths: {
  src: './_src',
  dist: './_site'
},
```

Gulp: These I put in under the `/* loading plugins */` marker after the plugins. 

```js 
/* path variables */
src = './_src',
dist = './_site';
```


#### Grunt setup

Grunt tasks store the task settings as objects, and the patterns get repeated to other plugins.  

```js 
sass: {
  options: {
    sourceComments: true
  },
  files: {
    src: '<%= paths.src %>/sass/style.sass',
    dest: '<%= paths.dist %>/style.css'
  }
}
```

Within the SASS object, there are 2 nested objects telling the task what files to process, and how to process them (options). The options here are pulled from the Node Sass, but for other plugins always refer to the documentation, it's usually useful. 

Now the task has been told what to do, I need to make sure it knows when to do it. At the bottom of the Grunt file the task needs to be "registered."

```js 
/* Register Tasks */
grunt.registerTask('default', ['sass']);
```

so now in the command line I can enter

    $ grunt
    
Which will run the default task, which runs only the sass task. Or I can run the Sass task directly with 

    $ grunt sass

If this is all I wanted to do that would be a lot of work for something that the sass gem could have done with less setup, but adding a the postcss task and the task runner starts to carry its own weight. 

##### postcss

```js
// css post processer.
postcss: {
  options: {
    map: {
      inline: true // save all source maps as separate files...
    },
    processors: [
require('autoprefixer')({
        /* options */
        browsers: 'last 2 versions' // add vendor prefixes
      }),
require('cssnano')() // minify the result
]
  },
  files: {
    src: '<%= paths.dist %>/style.css',
    dest: '<%= paths.dist %>/style.css'
  }
}
```

The *postcss* task has the same options and files objects as the sass task did, but with different settings. 

Now the task can be "registered"

```js
    /* Register Tasks */
    grunt.registerTask('default', ['sass', 'postcss']);
```

And they will run in the order that they are entered here. 

##### Watch

Finally I'll add the watch command so I don't have to keep going back to the command line to type `$ grunt` after every time I save my work. 

```js 
watch: {
    dev: {
        files: [
            '<%= paths.src %>/sass/**/*'
        ],
        tasks: ['sass', 'postcss'],
        options: {
            livereload: true
        }
    }
}
```

This is set up to watch all folders, and files, in the sass folder and whenever Grunt detects a change, it runs the tasks specified, with the defined options. To get that started, I just goto my command line and use: 

    $ grunt watch
    

#### Gulp Setup

For this demonstration, I'm going to make a gulpfile that does the **exact** same thing as my grunt file. 

I've already loaded the Gulp plugins 

So here is the sass set up. 

```js
gulp.task('sass', function () {
  gulp.src(src + '/sass/style.sass')
    .pipe(sass({
      /* options */
      outputStyle: 'expanded'
    })
    .pipe(gulp.dest(dist));
});
```

When activated it looks for the file specified, and spits out a processed css file. 

The options available are the same Node-sass based options that you can pass in Grunt, in the same way. Now with the command line I can run;

    $ gulp sass
    
It will Run the Sass task, and spit out a CSS file. 

##### postcss

Setting up the postcss task is similar as the sass task. 

```js
gulp.task('postcss', function () {
  gulp.src(dist + '/style.css')
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      })
    ]))
    .pipe(gulp.dest(dist));
});
```

Now in the command line. 

    $ gulp postcss
    
Will add prefixes to whenever necessary to the style.css which the sass task spit out. 

I add this to the `default` task. 

```js
gulp.task('default', ['sass', 'postcss'])
```

##### Making them run Synchronously 

Running the default task now would run both the Sass and Postcss task asynchronously and sometimes they work right... but usually not. So to insure that they run in the correct order I need to make the run in  order (synchronously). I'll do this by making the postcss task dependent on the sass task. First I'll modify the postcss code. 

```js
gulp.task('postcss', ['sass'], function () {
  gulp.src(dist + '/style.css')
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      }),
      cssnano()
    ]))
    .pipe(gulp.dest(dist));
});
```

Now this task is looking to the 'sass' task before it runs its own function. 

The Sass code has to be modified slightly as well, by adding the keyword `return` this makes the function run synchronously. 

```js
gulp.task('sass', function () {
	return  gulp.src( src + '/sass/style.sass')
    .pipe(
    	sass({
	      /* options */
	      outputStyle: 'expanded'
	    })
    )
    .pipe( gulp.dest( dist ) )
});
```

##### Gulp Watch

Setting up the watch task is more of the same, here's the code. 

```js
gulp.task('watch', function () {
	gulp.watch(src + 'sass/**/*', ['postcss']);
});
```

It defines the folder to watch, and the task to run. Since postcss has a sass dependency both tasks will run in order, and have the same output as Grunt.

## Conclusion. 

Both of these tools where built to increase productivity, and deciding between the two will be a personal decision. Hopefully I've demystified both Grunt and Gulp to the point that someone will give them a try. 

## Update

a few days after i presented this talk at the meet up, i realized instead of making the post css task run seperatly from the sass task, i can put them in the same pipe, since Gulp runs the tasks in the pipe in the order it's defined (like grunt runs the specific tasks). so they run syncronously instead of as a dependentcy. this will work since i would rarely have to run postCSS without running SASS first. this is what the updated code looks like. 

```js
gulp.task('default', ['sass']);

gulp.task('sass', function () {
	gulp.src( src + '/sass/style.sass')
    .pipe(
    	sass({
	      /* options */
	      outputStyle: 'expanded'
	    })
    )
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      })
//      , cssnano
    ]))
    .pipe( gulp.dest( dist ) )
});

gulp.task('watch', function () {
    gulp.watch(src + 'sass/**/*', ['sass']);
});
```

-----

## Cited.

1. http://daverupert.com/2015/08/developing-on-windows/
2. https://github.com/sparklemotion/nokogiri/issues/1256
3. http://www.sitepoint.com/6-current-options-css-preprocessors/
4. http://blog.codepen.io/documentation/editor/using-js-preprocessors/
5. http://colorburned.com/differences-between-jade-haml-slim/
6. http://bodyflex.github.io/gruntfile-gen/
7. http://cssnano.co
9. https://github.com/sindresorhus/grunt-sass
10. https://github.com/gruntjs/grunt-contrib-watch
11. https://github.com/nDmitry/grunt-postcss
12. https://www.npmjs.com/package/gulp-sass
13. https://github.com/postcss/gulp-postcss
14. https://www.npmjs.com/package/gulp-watch
15. https://github.com/bchavezgd/task-runners-talk


Not cited but useful and relevant: 

http://daverupert.com/2015/04/davegoeswindows/



-----

## Cited.

1. http://daverupert.com/2015/08/developing-on-windows/
2. https://github.com/sparklemotion/nokogiri/issues/1256
3. http://www.sitepoint.com/6-current-options-css-preprocessors/
4. http://blog.codepen.io/documentation/editor/using-js-preprocessors/
5. http://colorburned.com/differences-between-jade-haml-slim/
6. http://bodyflex.github.io/gruntfile-gen/
7. http://cssnano.co
9. https://github.com/sindresorhus/grunt-sass
10. https://github.com/gruntjs/grunt-contrib-watch
11. https://github.com/nDmitry/grunt-postcss
12. https://www.npmjs.com/package/gulp-sass
13. https://github.com/postcss/gulp-postcss
14. https://www.npmjs.com/package/gulp-watch
15. https://github.com/bchavezgd/task-runners-talk


Not cited but useful and relevant: 

http://daverupert.com/2015/04/davegoeswindows/
