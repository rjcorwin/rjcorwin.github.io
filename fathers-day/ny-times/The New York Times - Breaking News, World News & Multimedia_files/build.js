define('nyt5/analytics',[],function() {

  var canonical = document.querySelector("link[rel='canonical']").href,
      pageview = ['_trackPageview'];

  if (canonical) {
    var a = document.createElement("a");
    a.href = canonical;
    if (a.pathname != document.location.pathname) pageview.push(a.pathname);
  }

  _gaq = [['_setAccount', 'UA-9262032-1'], pageview];

  require(['https://www.google-analytics.com/ga.js']);

});

/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. *
 */
/**
 * jquery.balancetext.js
 *
 * Author: Randy Edmunds
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery, $ */

/*
 * Copyright (c) 2007-2009 unscriptable.com and John M. Hann
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name(s) of the above
 * copyright holders (unscriptable.com and John M. Hann) shall not be
 * used in advertising or otherwise to promote the sale, use or other
 * dealings in this Software without prior written authorization.
 *
 * http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
 *
 */

define('lib/text-balancer',[
  'jquery/nyt'
  ], function($) {

     "use strict";
    var sr = "smartresize";

    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap) {
                    func.apply(obj, args);
                }
                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    $.fn[sr] = function (fn) {  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    var style = document.documentElement.style,
        hasTextWrap = (style.textWrap || style.WebkitTextWrap || style.MozTextWrap || style.MsTextWrap || style.OTextWrap),
        wsMatches;

    function NextWS_params() {
        this.reset();
    }
    NextWS_params.prototype.reset = function () {
        this.index = 0;
        this.width = 0;
    };

    /**
     * Returns true iff char at index is a space character outside of HTML < > tags.
     */
    var isWS = function (txt, index) {
        var re = /\s(?![^<]*>)/g,
            match;

        if (!wsMatches) {
            // Only calc ws matches once per line
            wsMatches = [];
            while ((match = re.exec(txt)) !== null) {
                wsMatches.push(match.index);
            }
        }

        return wsMatches.indexOf(index) !== -1;
    };

    var removeTags = function ($el) {
        $el.find('br[data-owner="balance-text"]').replaceWith(" ");
        var $span = $el.find('span[data-owner="balance-text"]');
        if ($span.length > 0) {
            var txt = "";
            $span.each(function () {
                txt += $(this).text();
                $(this).remove();
            });
            $el.html(txt);
        }
    };

    /**
     * Checks to see if we should justify the balanced text with the
     * element based on the textAlign property in the computed CSS
     *
     * @param $el        - $(element)
     */
    var isJustified = function ($el) {
        style = $el.get(0).currentStyle || window.getComputedStyle($el.get(0), null);
        return (style.textAlign === 'justify');
    };

    /**
     * Add whitespace after words in text to justify the string to
     * the specified size.
     *
     * @param txt      - text string
     * @param conWidth - container width
     */
    var justify = function ($el, txt, conWidth) {
        txt = $.trim(txt);
        var words = txt.split(' ').length;
        txt = txt + ' ';

        // if we don't have at least 2 words, no need to justify.
        if (words < 2) {
            return txt;
        }

        // Find width of text in the DOM
        var tmp = $('<span></span>').html(txt);
        $el.append(tmp);
        var size = tmp.width();
        tmp.remove();

        // Figure out our word spacing and return the element
        var wordSpacing = Math.floor((conWidth - size) / (words - 1));
        tmp.css('word-spacing', wordSpacing + 'px')
            .attr('data-owner', 'balance-text');

        return $('<div></div>').append(tmp).html();
    };

    /**
     * In the current simple implementation, an index i is a break
     * opportunity in txt iff it is 0, txt.length, or the
     * index of a non-whitespace char immediately preceded by a
     * whitespace char.  (Thus, it doesn't honour 'white-space' or
     * any Unicode line-breaking classes.)
     *
     * @precondition 0 <= index && index <= txt.length
     */
    var isBreakOpportunity = function (txt, index) {
        return ((index === 0) || (index === txt.length) ||
                (isWS(txt, index - 1) && !isWS(txt, index)));
    };

    /**
     * Finds the first break opportunity (@see isBreakOpportunity)
     * in txt that's both after-or-equal-to index c in the direction dir
     * and resulting in line width equal to or past clamp(desWidth,
     * 0, conWidth) in direction dir.  Sets ret.index and ret.width
     * to the corresponding index and line width (from the start of
     * txt to ret.index).
     *
     * @param $el      - $(element)
     * @param txt      - text string
     * @param conWidth - container width
     * @param desWidth - desired width
     * @param dir      - direction (-1 or +1)
     * @param c        - char index (0 <= c && c <= txt.length)
     * @param ret      - return object; index and width of previous/next break
     *
     */
    var findBreakOpportunity = function ($el, txt, conWidth, desWidth, dir, c, ret) {
        var w;

        for(;;) {
            while (!isBreakOpportunity(txt, c)) {
                c += dir;
            }

            $el.html(txt.substr(0, c));
            w = $el.width();

            if ((dir < 0)
                    ? ((w <= desWidth) || (w <= 0) || (c === 0))
                    : ((desWidth <= w) || (conWidth <= w) || (c === txt.length))) {
                break;
            }
            c += dir;
        }
        ret.index = c;
        ret.width = w;
    };

    /**
     * Detects the width of a non-breaking space character, given the height of
     * the element with no-wrap applied.
     *
     * @param $el      - $(element)
     * @param h         - height
     *
     */
    var getSpaceWidth = function ($el, h) {
        var container = document.createElement('div');

        container.style.display = "block";
        container.style.position = "absolute";
        container.style.bottom = 0;
        container.style.right = 0;
        container.style.width = 0;
        container.style.height = 0;
        container.style.margin = 0;
        container.style.padding = 0;
        container.style.visibility = "hidden";
        container.style.overflow = "hidden";

        var space = document.createElement('span');

        space.style.fontSize = "2000px";
        space.innerHTML = "&nbsp;";

        container.appendChild(space);

        $el.append(container);

        var dims = space.getBoundingClientRect();
        container.parentNode.removeChild(container);

        var spaceRatio = dims.height / dims.width;

        return (h / spaceRatio);
    };

    // Selectors to watch; calling balanceText() on a new selector adds it to this list.
    var balancedElements = ['.balance-text'];

    // Call the balanceText plugin on the elements with "balance-text" class. When a browser
    // has native support for the text-wrap property, the text balanceText plugin will let
    // the browser handle it natively, otherwise it will apply its own text balancing code.
    var applyBalanceText = function () {
        var selector = balancedElements.join(',');
        $(selector).balanceText(true);
    };

    $.fn.balanceTextUpdate = applyBalanceText;

    $.fn.balanceText = function (skipResize) {
        var selector = this.selector;

        if (!skipResize && balancedElements.indexOf(selector) === -1) {
            // record the selector so we can re-balance it on resize
            balancedElements.push(selector);
        }

        if (hasTextWrap) {
            // browser supports text-wrap, so do nothing
            return this;
        }

        return this.each(function () {
            var $this = $(this);

            // In a lower level language, this algorithm takes time
            // comparable to normal text layout other than the fact
            // that we do two passes instead of one, so we should
            // be able to do without this limit.
            var maxTextWidth = 5000;

            removeTags($this);                        // strip balance-text tags

            // save line-height if set via inline style
            var oldLH = '';
            if ($this.attr('style') &&
                    $this.attr('style').indexOf('line-height') >= 0) {
                oldLH = $this.css('line-height');
            }

            // remove line height before measuring container size
            $this.css('line-height', 'normal');

            var containerWidth = $this.width();
            var containerHeight = $this.height();

            // save settings
            var oldWS = $this.css('white-space');
            var oldFloat = $this.css('float');
            var oldDisplay = $this.css('display');
            var oldPosition = $this.css('position');

            // temporary settings
            $this.css({
                'white-space': 'nowrap',
                'float': 'none',
                'display': 'inline',
                'position': 'static'
            });

            var nowrapWidth = $this.width();
            var nowrapHeight = $this.height();

            // An estimate of the average line width reduction due
            // to trimming trailing space that we expect over all
            // lines other than the last.

            var spaceWidth = ((oldWS === 'pre-wrap') ? 0 : getSpaceWidth($this, nowrapHeight));

            if (containerWidth > 0 &&                  // prevent divide by zero
                    nowrapWidth > containerWidth &&    // text is more than 1 line
                    nowrapWidth < maxTextWidth) {      // text is less than arbitrary limit (make this a param?)

                var remainingText = $this.html();
                var newText = "";
                var lineText = "";
                var shouldJustify = isJustified($this);
                var totLines = Math.round(containerHeight / nowrapHeight);
                var remLines = totLines;

                // Determine where to break:
                while (remLines > 1) {

                    // clear whitespace match cache for each line
                    wsMatches = null;

                    var desiredWidth = Math.round((nowrapWidth + spaceWidth)
                                                  / remLines
                                                  - spaceWidth);

                    // Guessed char index
                    var guessIndex = Math.round((remainingText.length + 1) / remLines) - 1;

                    var le = new NextWS_params();

                    // Find a breaking space somewhere before (or equal to) desired width,
                    // not necessarily the closest to the desired width.
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, -1, guessIndex, le);

                    // Find first breaking char after (or equal to) desired width.
                    var ge = new NextWS_params();
                    guessIndex = le.index;
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, +1, guessIndex, ge);

                    // Find first breaking char before (or equal to) desired width.
                    le.reset();
                    guessIndex = ge.index;
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, -1, guessIndex, le);

                    // Find closest string to desired length
                    var splitIndex;
                    if (le.index === 0) {
                        splitIndex = ge.index;
                    } else if ((containerWidth < ge.width) || (le.index === ge.index)) {
                        splitIndex = le.index;
                    } else {
                        splitIndex = ((Math.abs(desiredWidth - le.width) < Math.abs(ge.width - desiredWidth))
                                           ? le.index
                                           : ge.index);
                    }

                    // Break string
                    lineText = remainingText.substr(0, splitIndex);
                    if (shouldJustify) {
                        newText += justify($this, lineText, containerWidth);
                    } else {
                        newText += lineText.replace(/\s$/, "");
                        newText += '<br data-owner="balance-text" />';
                    }
                    remainingText = remainingText.substr(splitIndex);

                    // update counters
                    remLines--;
                    $this.html(remainingText);
                    nowrapWidth = $this.width();
                }

                if (shouldJustify) {
                    $this.html(newText + justify($this, remainingText, containerWidth));
                } else {
                    $this.html(newText + remainingText);
                }
            }

            // restore settings
            $this.css({
                'position': oldPosition,
                'display': oldDisplay,
                'float': oldFloat,
                'white-space': oldWS,
                'line-height': oldLH
            });
        });
    };

    return function(selectors) {
        if ($.isArray(selectors)) selectors = selectors.join(', ');
        function applyBalanceText() {
            $(selectors)
                .each(function() {
                    // look for html nodes in this element
                    var el = $(this), updated, related;
                    if (el.hasClass('interactive-leadin')) {
                        // save dateline and related link
                        updated = el.find('time.dateline');
                        related = el.find('a.related-link');
                        el.data('updated', updated.get(0))
                            .data('related', related.get(0))
                            .data('filter', $.trim((updated.text() + ' ' + related.text()).replace(/[ \n\t]+/g, ' ')));
                    } else if (el.hasClass('g-intro')) { 
                        // special treatment for stacks
                        updated = el.find('.g-updated');
                        related = el.find('.g-related-link');
                        el.data('updated', updated.get(0))
                            .data('related', related.get(0))
                            .data('filter', $.trim((updated.text() + (related.get(0) ? ' ' + related.text() : '')).replace(/[ \n\t]+/g, ' ')));
                        console.log(el.data('filter'), related.get(0));
                    }
                })
                .balanceText()
                .each(function() {
                    var el = $(this), filter, summary, nobr;
                    if (el.hasClass('interactive-leadin')) {
                        el.find('.dateline,.related-link').remove();
                        filter = el.data('filter');
                        summary = el.html().replace(/[ \n\t]+/g, ' ').replace(filter, '');
                        el.html('<span class="summary-text">'+summary+'</span>');
                        nobr = $('<span />')
                            .css('white-space', 'nowrap')
                            .appendTo(el);
                        nobr.append(el.data('updated'));
                        nobr.append(' ');
                        nobr.append(el.data('related'));
                    } else if (el.hasClass('g-intro')) {
                        // special treatment for stacks
                        el.find('.g-updated,.g-related-link').remove();
                        filter = el.data('filter');
                        summary = el.html().replace(/[ \n\t]+/g, ' ').replace(filter, '');
                        el.html('<span class="summary-text">'+summary+'</span>');
                        nobr = $('<span />')
                            .css('white-space', 'nowrap')
                            .appendTo(el);
                        nobr.append(el.data('updated'));
                        if (el.data('related')) {
                            nobr.append(' ');
                            nobr.append(el.data('related'));
                        }
                    }
                    
                });
        }
        // Apply on DOM ready
        $(window).ready(applyBalanceText);
        // Reapply on resize
        $(window).smartresize(applyBalanceText);
    };

});

require([
  '_nytg/2016-10-31-tips-hp/assets',
  '_nytg/2016-10-31-tips-hp/big-assets',
  'jquery/nyt',
  'underscore/1.6',
  'foundation/views/page-manager',
  'nyt5/analytics',
  'lib/text-balancer' // uncomment to balance headlines
  // 'd3/3',
  // 'queue/1'
  // 'resizerScript'     // uncomment this line to include resizerScript
  // 'templates'         // uncomment to use src/templates
  ], function(NYTG_ASSETS, NYTG_BIG_ASSETS, $, _, PageManager, Analytics, balanceText) {

  // begin code for your graphic here:








  // uncomment to balance headline and leadin
  // balanceText('.interactive-headline, .interactive-leadin');

  // templates
  // var html = Templates.jst.example_template({ text: "yo" });

  // custom sharetools
  // <div class="sharetools g-sharetools" data-url="http://www.nytimes.com" data-title="Custom Title"></div>
  // require(['interactive/main'], function() {
  //   require(['shared/sharetools/views/share-tools-container'], function(ShareTools) {
  //     $(".g-sharetools").each(function() {
  //       new ShareTools({ el: $(this) });
  //     });
  //   });
  // });

}); // end require
;
define("script", function(){});

