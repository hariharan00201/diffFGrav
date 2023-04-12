# FGrav

[![Build Status](https://travis-ci.org/eBay/FGrav.svg?branch=master)](https://travis-ci.org/eBay/FGrav)

Flamegraph visualizations (and related tools) implemented in Javascript. 

This vanilla Javascript library is designed to **dynamically** create **[Flamegraph](https://github.com/brendangregg/FlameGraph)** and Flamegraph related visualizations in the browser from the **raw** [collapsed stack](./src/test/resources/collapsed/java.collapsed) file.

Because the FGrav visualizations are done dynamically within the browser, it offers a lot more customization options and allows the user to create many interactive features unavailable with a conventional SVG file (See [filters](#frame-filter), [color-schemes](#color-scheme), [overlays](#overlays)). 

As shown in this project, FGrav also provides a basis to compare related data visually by easily extending or embedding the JS flamegraph implementation - See [FlameGraph diff](#flamegraph-diff) and [FlameGraph comparison](#flamegraph-compare) views.  

__Created By:__ [Amir Langer](https://github.com/langera/)

__License:__ [Apache 2.0](LICENSE.txt)

__Thanks:__
  * Inspiration:
    * Brendan Gregg's [Flamegraph](https://github.com/brendangregg/FlameGraph) reference implementation
    * Mark Price's [grav](https://github.com/epickrram/grav) profiling results visualizations 
  * Dependencies: 
    * [JQuery](https://jquery.com/)
    * (Test code only) [Jasmine](https://jasmine.github.io/)
    * (Test code only) [Jasmine-Ajax](https://github.com/jasmine/jasmine-ajax)
    * (Presentation only under docs/presentation) [reveal.js](https://revealjs.com/)

__Visualizations:__
  * [FlameGraph](#flamegraph)
  * [FlameGraph Compare](#flamegraph-compare)
  * [FlameGraph Diff](#flamegraph-diff)   <!--  * [FlameGraph Transition](#flamegraph-transition) -->
  * [Calendar View](#calendar-view)
  
__Usage:__  
  * [Customizable Features](#features)
       * [Color Scheme](#color-scheme)
          * [Built-in color schemes](#built-in-color-schemes)
          * [Custom color schemes](#custom-color-schemes)
          * [Legend](#legend)
          * [Overlays](#legend)
       * [Frame Filter](#frame-filter)
          * [Built-in frame filters](#built-in-frame-filters)
          * [Custom frame filters](#custom-frame-filters)
       * [Configuration](#configuration)   
  * [Getting Started](#getting-started)
  * [Test](#test)

## FlameGraph

The ability to create the Flamegraph dynamically rather than using a static SVG file allows a lot more flexbility in visualizing and analysing the data such as:
1. dynamic [color scheme](#color-scheme)
1. dynamic [overlays](#overlays)
1. specific [frame filters](#frame-filter)
1. grouping of code paths (TODO) 

Showing FlameGraph is done by requesting [FG.svg](./src/main/FG.svg).

| Parameter  | Description                                       | Required  |
| ---------- |:-------------------------------------------------:| ---------:|
| url        | url of the collapsed stack file to visualize      | yes |
| config     | path to configuration file (default = fgrav.json) | no |
| color      | set specific [color scheme](#color-scheme) to use | no |
| frameFilter| set specific [frame filter](#frame-filter) to use | no |
| width      | set width for this visualization in pixels        | no |
| height     | set height for this visualization in pixels       | no |

![FlameGraph Example](img/FG.png? "FlameGraph Example")

## FlameGraph Compare

A view of Two FlameGraphs, left and right where the hovering, search and zoom capabilities are linked to both and allow the viewer to compare the two side by side.

![FlameGraph Compare Detail Example](img/FGCompareDetail.png? "FlameGraph Compare Detail Example")

Showing FlameGraph Comparison is done by requesting [FGCompare.svg](./src/main/FGCompare.svg).

| Parameter  | Description                                             | Required  |
| ---------- |:-------------------------------------------------------:| ---------:|
| left       | url of the left side collapsed stack file to visualize  | yes |
| right      | url of the right side collapsed stack file to visualize | yes |
| config     | path to configuration file (default = fgrav.json)       | no |
| color      | set specific [color scheme](#color-scheme) to use       | no |
| frameFilter| set specific [frame filter](#frame-filter) to use       | no |
| width      | set width for this visualization in pixels              | no |
| height     | set height for this visualization in pixels             | no |

![FlameGraph Compare Example](img/FGCompare.png? "FlameGraph Compare Example")

## FlameGraph Diff

A Differential FlameGraph similar but with a lot more options to the one suggested by [Brendan Gregg](http://www.brendangregg.com/blog/2014-11-09/differential-flame-graphs.html).

Like the original differential FlameGraph, this FlameGraph can also be generated from a collapsed stack file that contains two sample count values for every code path.
See [simplediff.collapsed](./src/test/resources/collapsed/simplediff.collapsed) for a simple example of such file.

**However**, our FlameGraph can also be generated from **two separate regular collapsed files**. It simply merges the code paths dynamically.
This gives us much more flexibility and allows us to decides what to "diff" from the browser.

The original suggestion used the difference in measurements to color the frames (blue/red) but the FlameGraph that was drawn was according the second measurement.

Our approach allows to choose dynamically between viewing the first, second graph or a graph which represent the sum of both measurements and can color only part of the frame to show the difference between the two measurements.

This allows us to:
1. See the difference between the two measurements **visually**.
1. Avoid having the blind spot of a frame which existed in the first measurement but was not measured at all in the second.

![FlameGraph Diff Detail Example](img/FGDiffDetail.png? "FlameGraph Diff Detail Example")

Showing Differential FlameGraph is done by requesting [FGDiff.svg](./src/main/FGDiff.svg).

| Parameter      | Description                                                         | Required             |
| -------------- |:-------------------------------------------------------------------:| --------------------:|
| url            | url of the differential collapsed stack file to visualize           | unless 1st, 2nd used |
| 1st            | url of first collapsed file in diff                                 | (with 2nd) unless url used |     
| 2nd            | url of second collapsed file in diff                                 | (with 1st) unless url used |     
| config         | path to configuration file (default = fgrav.json)                   | no |
| color          | set specific [color scheme](#color-scheme) to use (default = Diff)  | no |
| frameFilter    | set specific [frame filter](#frame-filter) to use                   | no |
| width          | set width for this visualization in pixels                          | no |
| height         | set height for this visualization in pixels                         | no |
| visual-diff    | if set to true, only relative part of frame is painted (default = true)| no |
| different-sides| if set to true (and visual-diff = true), paints relative growth from the right and relative reduction from the left (default = false)| no |

![FlameGraph Diff Example](img/FGDiff.png? "FlameGraph Diff Example")

We can generate a Differential FlameGraph from two sources:
![FlameGraph Diff Two Sources Example](img/FGDiff_from_two_sources.png? "FlameGraph Diff Two sources Example")

Selection between which graph to choose is done by clicking on the title:
![FlameGraph Diff Selection Example](img/FGDiff_select_graph.png? "FlameGraph Diff Selection Example")

After choosing the first graph, we get framges based on the first measurement:
![FlameGraph Diff 1st Graph Example](img/FGDiff_1st_graph.png? "FlameGraph Diff 1st Graph Example")


The dynamic nature of the FGrav library also allows us to switch with one click between the "diff" color scheme and any other color scheme, for example:

![FlameGraph Diff Example](img/FGDiff_other_color_scheme.png? "FlameGraph Diff color schemes Example")


## Calendar View 

Inspired by the [github contributions calendar](https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/viewing-contributions-on-your-profile#contributions-calendar).

Show a calendar view with a color scheme and links to (probably) FlameGraphs that were taken on those days.

Showing a Calendar view is done by requesting [CG.svg](./src/main/CG.svg).

| Parameter  | Description                                       | Required  |
| ---------- |:-------------------------------------------------:| ---------:|
| url        | url of the calendar events json file to visualize. The json must be an array of objects which must contain the following fields: date, type, region, samples, url. see [test example](./src/test/resources/events/test.json) | yes|
| color      | set specific [color scheme](#color-scheme) to use | no |
| width      | set width for this visualization in pixels        | no |
| height     | set height for this visualization in pixels       | no |

This view can be used to show previously captured FlameGraphs for a specific process/service or instance of it by day.   

![Calendar View Example](img/CG.png "Calendar View Example")

## Features

### Color Scheme

Unlike a static SVG which was created with a pre-determined color scheme, FGrav FlameGraphs SVG visualization is built to work in the browser and therefore we can control and modify the color scheme, and easily see the same data with a different scheme, which allows different view points to the same data.

color scheme is implemented as an object with function
 
`function colorFor(frame, totalSamples)`

from a frame object and optional number of samples to a string that represent a color e.g.

`"red"`  or `"rgb(" + r + "," + g + "," + b + ")"`

A utility function in FGravDraw.js

`function colorValueFor(palette, name, value)`

can be used to generate color values from a palette 
(supported values: "red", "green", "blue", "yellow", "purple", "aqua", "orange")
and optional name, value which are used to generate a consistent shade = variance to the color where it will have the exact same shade for the same name / value.

Color schemes can be configured via an HTTP request parameter (to the Flamegraph) and/or [configuration](#Configuration).

All FlameGraph SVG files accept parameter `color` as the name/path of the color scheme.
If color parameter is provided, on FG*.svg files, the code will attempt to load a JS file `js/color/FG_Color_${color}.js` where `${color}` is the value of the color parameter.
If that value started with a `/` then the code assumes this is a full path for the JS file and tries to load it. 

If no color parameter is defined on the HTTP request then 'Default' color scheme is used.
The default color scheme for the differential Flame graph is 'Diff' (red for growth, blue for reduction). 
For the other visualizations, the default color scheme is 'Clear' (i.e. no color = white).
  
#### Built-in color schemes

1. [Flames](./src/main/js/color/FG_Color_Flames.js) - Random color scheme similar to the one used in original Flamegraph project.
1. [Java](./src/main/js/color/FG_Color_Java.js) - Java specific color scheme
1. [Js](./src/main/js/color/FG_Color_Js.js) - Javascript specific color scheme
1. [Diff](https://github.com/eBay/FGrav/blob/57db304a8fddd05768ebf3ee2e31961d61d93ad7/src/main/js/MergedFGDraw.js#L105) - Color scheme for "growth" / "reduction" in frame
1. [Clear](https://github.com/eBay/FGrav/blob/020f3c18c6c09baffa2c725b6dca03476cb49957/src/main/js/FGDraw.js#L319) - default. No color = "white".
 
#### Custom color schemes

To build a custom color scheme, simply implement your own color scheme JS object (extend `FG_Color`).
Built-in color schemes can serve as an example of how to implement a color scheme JS file.
It must contain a function that returns the color given the frame and number of samples.
You can also optionally define a legend for your color scheme by setting an object (map of color to name) to `this.legend`.
  
Loading the color scheme JS file can be done by either:

1. name your JS file using the following convention pattern used for built-in functions (i.e. `js/color/FG_Color_${my_color}.js`) then dynamically request the `FG*.svg` file with parameter `color=${my_color}`.
1. name your JS file to any name you want and request the `FG*.svg` file with parameter `color=/${my_color}` (where `/${my_color}` is the path to your file) Note `/` at start of parameter value.

![Color scheme Example](img/ColorScheme_choose.png? "Color scheme Example")


#### Legend

An additional feature on top of the custom FlameGraph layout born out of the ability to dynamically switch between color schemes.

You can specify a legend for any color scheme by setting colorScheme.legend with a legend object e.g.:

```
colorScheme.legend = {
    lawngreen: 'Java',
    yellow: 'JVM (C++)',
    aqua: 'Inlined',
    orange: 'Kernel',
    red: 'User'
};
```

See [Java](./src/main/js/color/FG_Color_Java.js) color scheme for an example.

The legend is hidden by default but can be toggled by clicking on the **legend** button.

![Java Legend Example](img/Legend.png? "Java Legend Example")

#### Overlays

Color schemes can have overlays. 
This is a dynamic ability to highlight specific frames in the context of a particular scheme (or simply style some frames in a different way).

You can think of an overlay as an extended pre-defined search query that allows the user to highlight parts of the Flamegraph.
Because overlays are defined as a Javascript function, they can be much more powerful than a search regex. 
(They can even involve external data). They can also be easier to write, and of course they can be shared among users.
Because overlays are dynamic, specific overlays for your specific code can be easily integrated into the visualization.

Note that color schemes themselves can be overlays to other color schemes (which for example, allows us to switch between differential color scheme and language specific color schemes in the Differential Flamegraph).
In order to allow other configured color schemes to overlay on top of a specific color scheme, we must set its `colorsAsOverlays` field to true. 
See [Flames](./src/main/js/color/FG_Color_Flames.js) color scheme for an example.
If we allow other color schemes to overlay on top of our current scheme, the menu button is named `Color Schemes` instead of `Overlays`.

See [Java_Blocking](./src/main/js/color/overlay/FG_Overlay_Java_Blocking.js) overlay as an example for an overlay to highlight Java blocking code.

Choose an overlay from a drop down menu by clicking on the `Color Schemes` / `Overlays` button:
![Java Blocking Overlay Choose Example](img/Overlay_choose.png? "Java Blocking Overlay Choose Example")

Overlay applied:
![Java Blocking Overlay Example](img/Overlay_applied.png? "Java Blocking Overlay Example")

### Frame Filter

Dynamic Frame filter is a function called when parsing the collapsed stack file to separate code paths.

It can be used to filter entire paths  or manipulate the code path / stack trace before calculating the FlameGraph structure.

FGrav allows a user to define **multiple** frame filters for any FlameGraph. 
All FGrav SVG files accept an optional parameter `frameFilter` as a comma separated list of names/paths of the filters to use.
We can also choose to turn filters on or off from the `Filters` drop down menu.

#### Built-in Frame Filters

1. [Java8](./src/main/js/frame/FG_Filter_Java8.js) - Attempts to solve issue happening in Java 8+ when using `-XX:+UnlockDiagnosticVMOptions -XX:+ShowHiddenFrames` in Java. Without it you will not see lambdas as part of the stack trace, with those flags lambdas will show up as frames but it also assigns arbitrary numbers to lambdas which turn many occurrences of the same lambda code to show up in the stack trace as different frames. This frame filter will remove that arbitrary number causing the FlameGraph to show all those lambdas as the same frame. This is incredibly important in comparisons visualizations and aggregations.
1. [RemoveJavaGCThreads](./src/main/js/frame/FG_Filter_RemoveJavaGCThreads.js) - Removes all code paths related to running of Java GC processes.
1. [RemoveThreadFrame](./src/main/js/frame/FG_Filter_RemoveThreadFrame.js) - Removes the thread frame (first frame of any code path) which will consolidate all common paths from different threads into the same flame.

#### Custom Frame Filters

Just like the built-in filters, users can write their own filters in a JS file and load it.

Loading the filter JS file can be done by either:

1. Use the convention pattern used for built-in functions (i.e. `js/frame/FG_Filter_${my_filter}.js`).
1. Name your JS file to any name you want and request the `FG*.svg` file with parameter `frameFilter=/${my_filter_path}` (where `/${my_filter_path}` is the path to your JS file with an object with the same name and a function `filter`) **Note `/` at start of parameter value**.

![FrameFilter Example](img/FrameFilter.png? "FrameFilters Example")


### Configuration

FGrav must have a configuration file with the configuration of color schemes, frame filters and overlays.

This is done via a json file which any visualization can load. 
The default file is [fgrav.json](./src/main/fgrav.json) which configures the in-built color schemes, overlays and filters.
You can modify it or use a different file by passing its path in the `config` request parameter.
Using the configuration file you can define the URI path to color schemes + frame filters by name and define which overlays should belong to which color scheme.

## Getting Started

Deploy all src files and libs to an http server.

You can use [deploy.sh](./deploy.sh) as an example which will create a directory called **web** and copy all files to it.
You can then run an http server via docker with [serve.sh](./serve.sh). (**Note:** port is configured to **9090** in the script. Feel free to change)

Once the http server is up, request an SVG file from it on a browser.

You can use [FGrav playground page](http://localhost:9090/index.html) to construct requests.

FGrav playground page is the default root page. `http://${host}:${port}/`

![Playground Example](img/playground.png? "Playground Example")

FGrav playground page helps you build FGrav visualizations. 

You can also build the URL yourself. Here are templates for some URL examples:

`http://${host}:${port}/FG.svg?url=${raw-file}`

`http://${host}:${port}/FG.svg?url=${raw-file}&color=Java`

`http://${host}:${port}/FG.svg?url=${raw-file}&color=Java&frameFilter=Java8,RemoveJavaGCThreads`

`http://${host}:${port}/FG.svg?url=${raw-file}&color=${custom-color-scheme}&frameFilter=${custom-frame-filters}`

`http://${host}:${port}/FGCompare.svg?left=${raw-file1}&right=${raw-file2}`

`http://${host}:${port}/FGCompare.svg?left=${raw-file1}&right=${raw-file2}&color=Java`

`http://${host}:${port}/FGCompare.svg?left=${raw-file1}&right=${raw-file2}&color=Java&frameFilter=Java8,RemoveJavaGCThreads`

`http://${host}:${port}/FGCompare.svg?left=${raw-file1}&right=${raw-file2}&color=${custom-color-scheme}&frameFilter=${custom-frame-filters}`

`http://${host}:${port}/FGDiff.svg?url=${diff-raw-file}`

`http://${host}:${port}/FGDiff.svg?url=${diff-raw-file}&color=Diff`

`http://${host}:${port}/FGDiff.svg?url=${diff-raw-file}&color=Java&frameFilter=Java8,RemoveJavaGCThreads`

`http://${host}:${port}/FGDiff.svg?url=${diff-raw-file}&color=${custom-color-scheme}&frameFilter=${custom-frame-filters}`

###Presentation material

You can also see a presentation about FGrav (which uses [reveal.js](https://revealjs.com/) to show real live Flamegraphs) on your browser in `http://${host}:${port}/presentation/index.html`

###Presentations

[5 minute overview of FGrav at TLV community summit (English) - Youtube](https://youtu.be/_xFOlzZhEWs)


## Test

[![Build Status](https://travis-ci.org/eBay/FGrav.svg?branch=master)](https://travis-ci.org/eBay/FGrav)

github repo is tested using TravisCI.

All logic is tested using [Jasmine](https://jasmine.github.io/).

We use the [core jasmine](https://github.com/jasmine/jasmine) library and its [jasmine-ajax](https://github.com/jasmine/jasmine-ajax) extension.

To run the Jasmine tests we use [karma](https://karma-runner.github.io/0.12/index.html) as our test runner with [HeadlessChrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai#:~:text=Headless%20Chrome%20is%20a%20way,without%20the%20full%20browser%20UI.&text=Headless%20Chrome%20gives%20you%20a,a%20full%20version%20of%20Chrome.) as the browser.
All config is found in:
1. [package.json](package.json)
1. [karma.conf.js](karma.conf.js)


To run tests from a fresh clone using npm package manager run: 

1. `npm install`
1. `npm i --save-dev karma karma-chrome-launcher karma-cli karma-jasmine jasmine-ajax`
1. `$(npm bin)/karma init`  // follow instructions
1. `npm test`



# License Information
Copyright 2021 eBay Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
