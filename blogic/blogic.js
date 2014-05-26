/*
 * Blogic.js - v.0.1.0
 *
 * Copyright (C) 2014, Brent Bessemer
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this
 * list of conditions and the following disclaimer in the documentation and/or other
 * materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may
 * be used to endorse or promote products derived from this software without specific
 * prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
(function (global, dir) {

	// Check for jQuery; if it is not present, fetch and add it.
	if (!jQuery) {
		try {
			r = new XMLHttpRequest();
			r.open("GET", "http://code.jquery.com/jquery-1.11.1.min.js", false);
			r.send();
			eval(r.responseText);
		} catch (e) {
			console.log("jQuery was not present and could not be loaded");
			console.log(e);
		}
	}
	
	// Create the local copy of the Blogic library.
	var bl = new Object();
	
	// Load the preferences file.
	r = new XMLHttpRequest();
	r.open("GET", dir+"/.blogic/preferences.json", false);
	r.send();
	bl.prefs = JSON.parse(r.responseText);
	
	// Basic function: post.
	bl.post = function (url, container, options) {
		if (bl.prefs.timeZone == "local") {
			date = new Date(options.date.UTC()+(new Date(0)).setUTCMinutes(-(new Date).getTimeZoneOffset())));
		} else {
			date = new Date(options.date.UTC()+(new Date(0)).setUTCMinutes(bl.prefs.timeZone.offset)));
		}
		switch (bl.prefs.dateFormat) {
			case "dmy":
				dateString = bl.prefs.days[date.getUTCDay()] + date.getUTCDate() + bl.prefs.months[date.getUTCMonth()] + date.getUTCFullYear();
			case "mdy":
				dateString = bl.prefs.days[date.getUTCDay()] + bl.prefs.months[date.getUTCMonth()] + date.getUTCDate() + date.getUTCFullYear();
			default:
				dateString = date.toISOString();
		}
		switch (bl.prefs.timeFormat) {
			case "24":
				timeString = date.getUTCHours() + ':' + date.getUTCMinutes() + bl.prefs.timeZone.name;
			default:
				timeString = "";
		}
		
		$.get(url, function (content) {
			$post = $('<div class="-b-post"></div>');
			raw = $.parseHTML(content);
			$post.append(raw);
			$(".-b-post-title", $post).wrapInner(
				'<a href="'+dir+'/posts?id='+options.postId+'></a>'
			);
			if (bl.prefs.meta) {
				$(".-b-post-title", $post).after(
					'<header class="-b-post-header">'+
					'<p class="-b-post-author"><span>Author: </span></p>'+
					'<p class="-b-post-date"><span>Posted on </span></p></header>'
				);
				$(".-b-post-author", $post).append(options.author);
				$(".-b-post-date", $post).append(dateString + timeString);
				$(".-b-post-content", $post).after(
					'<footer class="-b-post-tags"><span>Tags: </span></footer>'
				);
				for (i=0;i<options.tags.length;i++) {
					$(".-b-post-tags").append('a href="'+dir+'/tag?l='+options.tags[i]+'>#'+options.tags[i]+'</a>&nbsp;');
				}
			}
			$post.prependTo(container);
		});
	}
	
	bl.postList = function (url, container) {
		$.get(dir+url, function (list) {
			//var list = $.parseXML(raw);
			var posts = $("post", list);
			for (i=0;i<posts.length;i++) {
				var opts = new Object();
				opts.tags = $(posts[i]).find("tag");
				opts.author = $(posts[i]).find("author").text();
				opts.date = new Date(eval($(posts[i]).attr("date")+"*10000"));
				opts.postId = $(posts[i]).attr("id");
				var postUrl = $(posts[i]).attr("src");
				bl.post(dir+postUrl, container, opts);
			}
		});
	}
	
	// Add the library and an alias to the window object.
	global.blog = bl;
	global._b = bl;
	
})(window, '.');
