/*
	Regex auto replacement plugin for jQuery
	Copyright (c) 2011 Al Twohill, http://hol.net.nz
	Licenced under some licence to be decided later
	Version: 0.1
	
	Based off ideas from jquery.maskedinput plugin 
	Copyright (c) 2007-2010 Josh Bush (digitalbush.com)
*/
(function($) {
	var pasteEventName = ($.browser.msie ? 'paste' : 'input') + ".autoreplace";
	
	$.autoreplace = {
		//Predefined replacement definitions
		predefined: {
			'nzphones': [
				{ reg: "^(\\d{0,2}) ?$" }, // up to the first two digits plus a space
				{ reg: "^([1-9]\\d{1,2}) ?$" }, // start of local number or three digit number
				{ reg: "^([1-9]\\d{2}) ?(\\d{1,3})$", replace: "$1 $2" }, // second part of local number
				{ reg: "^([1-9]\\d{2}) ?(\\d{4})$", replace: "$1 $2", complete: true }, // local number once completed
				{ reg: "^(0[589]0?[08]) ?$"}, // start of premium or free number
				{ reg: "^(0[589]0?[08]) ?(\\d{1,3} ?)$", replace: "$1 $2" }, // second part of premium/free number
				{ reg: "^(0[589]0?[08]) ?(\\d{3}) ?(\\d{1,2})$", replace: "$1 $2 $3" }, // third part of premium/free number
				{ reg: "^(0[589]0?[08]) ?(\\d{3}) ?(\\d{3})$", replace: "$1 $2 $3", complete: true }, // premium/free number once completed
				{ reg: "^(0[134679]) ?(\\d{0,3} ?)$", replace: "$1 $2" }, // middle part of national number - not 02, 05 or 08
				{ reg: "^(0[134679]) ?(\\d{3}) ?(\\d{1,3})$", replace: "$1 $2 $3" }, // third part of national number
				{ reg: "^(0[134679]) ?(\\d{3}) ?(\\d{4})$", replace: "$1 $2 $3", complete: true }, // national number once completed
				{ reg: "^(02\\d) ?$" }, // first three digits of cellphone
				{ reg: "^(02\\d) ?(\\d{0,3} ?)$", replace: "$1 $2" }, // second part of cellphone
				{ reg: "^(02\\d) ?(\\d{3}) ?(\\d{0,2})$", replace: "$1 $2 $3" }, // third part of cellphone
				{ reg: "^(02\\d) ?(\\d{3}) ?(\\d{3,8})$", replace: "$1 $2 $3", complete: true }, // completed cellphone (allows for varying digits)
				{ reg: "^(?:00 ?|\\+)$", replace: "+" }, // start of an international number
				{ reg: "^(?:00 ?|\\+)([1-9]\\d{0,1} ?)$", replace: "+$1" }, // country code
				{ reg: "^(?:00 ?|\\+)([1-9]\\d) ?([134679]|2\\d? ?)$", replace: "+$1 $2" }, // area code (single digit for most, or 2 for cell)
				{ reg: "^(?:00 ?|\\+)([1-9]\\d) ?([134679]|2\\d) ?(\\d{1,3} ?)$", replace: "+$1 $2 $3" }, // region code
				{ reg: "^(?:00 ?|\\+)([1-9]\\d) ?([134679]|2\\d) ?(\\d{3}) ?(\\d{0,2})$", replace: "+$1 $2 $3 $4" }, // last part of number
				{ reg: "^(?:00 ?|\\+)([1-9]\\d) ?([134679]|2\\d) ?(\\d{3}) ?(\\d{3,10})$", replace: "+$1 $2 $3 $4", complete: true } // int complete!
			]
		}
	};
	$.fn.extend({
		unautoreplace: function() { return this.trigger("unautoreplace"); },
		autoreplace: function(replacements, settings) {
			settings = $.extend({
				incomplete: null,
				complete: null,
				invalid: null
			}, settings);
			
			var rules = [];
			//replacements can either be a definition array of regex rule objects, or a string
			// for a pre-defined definition
			if (replacements instanceof Array) {
				rules = replacements;
			} else {
				rules = $.autoreplace.predefined[replacements];
			}
			
			return this.trigger("unautoreplace").each(function() {
				var input = $(this);
				var focusText = input.val();
				var prevText;

				function keyup(e) {
					checkVal();
				}
				function checkVal() {
					// Loop through the rules array looking for a match
					var x = 0;
					var rule;
					var val = input.val();
					var reg;
					do {
						reg = new RegExp(rules[x].reg);
						if (reg.test(val)) {
							rule = rules[x];
							console.log('Value "' + val + '" Matched ' + rule.reg);
						}
						x++;
					} while (!rule && x < rules.length);
					//Found a match, replace with preferred format
					if (rule) {
						var newText;
						if (rule.replace) {
							newText = val.replace(reg, rule.replace);
							
							input.val(newText);
						}
						prevText = input.val();
						input.data('status', rule.complete ? 'complete' : 'incomplete');
						if (rule.complete && settings.complete) {
							settings.complete.call(input);
						} else if (settings.incomplete) {
							settings.incomplete.call(input);
						}
					} else {
						console.log("No match: '" + val + "'");
						if (settings.invalid) {
							settings.invalid.call(input);
						}
						input.data('status', 'invalid');
						input.val(prevText);
					}
					return input.val().length;
				}
				if (!input.attr("readonly")) {
					input
					.one("unautoreplace", function() {
						input
							.unbind(".autoreplace");
					})
					.bind("focus.autoreplace", function() {
						focusText = input.val();
					})
					.bind("blur.autoreplace", function() {
						checkVal();
						if (input.val() !== focusText) {
							input.change();
						}
						// on blur incomplete numbers are invalid
						if (settings.invalid && input.val().length !== 0 && input.data('status') == 'incomplete') {
							input.data('status', 'invalid');
							settings.invalid.call(input);
						}
					})
					.bind("keyup.autoreplace", keyup)
					.bind(pasteEventName, function() {
						setTimeout(function() { checkVal(); }, 0);
					});
				}
			});
		}
	});
	
})(jQuery);