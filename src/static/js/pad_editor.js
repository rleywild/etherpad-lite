/**
 * This code is mostly from the old Etherpad. Please help us to comment this code. 
 * This helps other people to understand this code better and helps them to improve it.
 * TL;DR COMMENTS ON THIS FILE ARE HIGHLY APPRECIATED
 */

/**
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var padcookie = require('./pad_cookie').padcookie;
var padutils = require('./pad_utils').padutils;

var padeditor = (function()
{
  var Ace2Editor = undefined;
  var pad = undefined;
  var settings = undefined;
  var self = {
    ace: null,
    // this is accessed directly from other files
    viewZoom: 100,
    init: function(readyFunc, initialViewOptions, _pad)
    {
      Ace2Editor = require('./ace').Ace2Editor;
      pad = _pad;
      settings = pad.settings;

      function aceReady()
      {
        $("#editorloadingbox").hide();
        if (readyFunc)
        {
          readyFunc();
        }
      }

      self.ace = new Ace2Editor();
      self.ace.init("editorcontainer", "", aceReady);
      self.ace.setProperty("wraps", true);
      if (pad.getIsDebugEnabled())
      {
        self.ace.setProperty("dmesg", pad.dmesg);
      }
      self.initViewOptions();
      self.setViewOptions(initialViewOptions);

      // view bar
      $("#viewbarcontents").show();
    },
    initViewOptions: function()
    {
      padutils.bindCheckboxChange($("#options-linenoscheck"), function()
      {
        pad.changeViewOption('showLineNumbers', padutils.getCheckbox($("#options-linenoscheck")));
      });
      padutils.bindCheckboxChange($("#options-colorscheck"), function()
      {
        padcookie.setPref('showAuthorshipColors', padutils.getCheckbox("#options-colorscheck"));
        pad.changeViewOption('showAuthorColors', padutils.getCheckbox("#options-colorscheck"));
      });
      $("#viewfontmenu").change(function()
      {
        pad.changeViewOption('useMonospaceFont', $("#viewfontmenu").val() == 'monospace');
      });

$("#viewstrikemenu").change(function()
{
  pad.changeViewOption('useHiddenFont', $("#viewstrikemenu").val() == 'hidden');
});
      
      html10n.bind('localized', function() {
        $("#languagemenu").val(html10n.getLanguage());
        // translate the value of 'unnamed' and 'Enter your name' textboxes in the userlist
        // this does not interfere with html10n's normal value-setting because html10n just ingores <input>s
        // also, a value which has been set by the user will be not overwritten since a user-edited <input>
        // does *not* have the editempty-class
        $('input[data-l10n-id]').each(function(key, input)
          {
            input = $(input);
            if(input.hasClass("editempty"))
              input.val(html10n.get(input.attr("data-l10n-id")));
          });
      })
      $("#languagemenu").val(html10n.getLanguage());
      $("#languagemenu").change(function() {
        pad.createCookie("language",$("#languagemenu").val(),null,'/');
        window.html10n.localize([$("#languagemenu").val(), 'en']);
      });
    },
    setViewOptions: function(newOptions)
    {
      function getOption(key, defaultValue)
      {
        var value = String(newOptions[key]);
        if (value == "true") return true;
        if (value == "false") return false;
        return defaultValue;
      }
      self.ace.setProperty("rtlIsTrue", settings.rtlIsTrue);

        // XXX all this getOption->setProperty/setCheckbox business should be:
        // handled by a library for dependency-tracking
        // the code should be in one place instead of strewn bw src/{templates/pad.html, locales/en.json, static/js/pad_editor.js, static/js/ace2_inner.js}
      var v;

      v = getOption('rtlIsTrue', false);
      self.ace.setProperty("rtlIsTrue", v);

      v = getOption('showLineNumbers', true);
      self.ace.setProperty("showslinenumbers", v);
      padutils.setCheckbox($("#options-linenoscheck"), v);

      v = getOption('showAuthorColors', true);
      self.ace.setProperty("showsauthorcolors", v);
      padutils.setCheckbox($("#options-colorscheck"), v);
      // Override from parameters if true
      if (settings.noColors !== false)
        self.ace.setProperty("showsauthorcolors", !settings.noColors);

      v = getOption('useMonospaceFont', false);
      self.ace.setProperty("textface", (v ? "monospace" : "Arial, sans-serif"));
      $("#viewfontmenu").val(v ? "monospace" : "normal");

v = getOption('useHiddenFont', false);
self.ace.setProperty("striketype", v ? true : false); // this must cohere w ace2_inner.js
$("#viewstrikemenu").val(v ? "hidden" : "normal"); // this must cohere w locales/en.json
    },
    dispose: function()
    {
      if (self.ace)
      {
        self.ace.destroy();
        self.ace = null;
      }
    },
    disable: function()
    {
      if (self.ace)
      {
        self.ace.setProperty("grayedOut", true);
        self.ace.setEditable(false);
      }
    },
    restoreRevisionText: function(dataFromServer)
    {
      pad.addHistoricalAuthors(dataFromServer.historicalAuthorData);
      self.ace.importAText(dataFromServer.atext, dataFromServer.apool, true);
    }
  };
  return self;
}());

exports.padeditor = padeditor;
