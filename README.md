jquery.autoreplace
==================

a regex auto replacement plugin for jQuery
------------------------------------------

Copyright (c) 2011 Al Twohill, http://hol.net.nz  
Licenced under some open licence to be decided later  
Version: 0.1

This plugin was created to scratch my own itch: I needed to format NZ phone numbers in a way that
is (hopefully) intuitive and easy to the eye. I've made in a way which I hope will be easy to
extend, but I'll happily accept requests for improvements - especially if they're accompanied by
patches ;)

The logical inspiration for this type of format entry is that of the iPhone dialer app, in that it
formats a number as-you-type, and the formatting is different based on whether it is a local, national,
free, or international number.

The closest I could find to what I wanted was the [jquery.maskedinput plugin](http://digitalbush.com/projects/masked-input-plugin/)
by Josh Bush. I used his code to develop my own plugin as it differs too much to be able to just patch
his code, hope that's ok ;)

Example Usage
-------------

You can do more than what I specify here, but the case I've developed for (my itch), works like this:

	$('.phone input').autoreplace('nzphones', {
			complete: function () { $(this).parent().addClass('complete').removeClass('incomplete invalid'); },
			incomplete: function () { $(this).parent().addClass('incomplete').removeClass('complete invalid'); },
			invalid: function () { $(this).parent().addClass('invalid').removeClass('complete incomplete'); }
	});
	
What this plugin does
---------------------

Generally, this plugin validates data against an array of regular expressions, then applies replacements on them.
More specifically, it can format a text field so that if a user types '035' it gets converted to '03 5', then when
they type '03 5451' it gets converted to '03 545 1', and so on. It's "smart" enough to know the difference between
'021' and '03 1'.

I currently have a set of regexes pre-developed for NZ local, national, mobile, free, and premium numbers, as well as 
VERY LIMITED support for international styles.

Callbacks are provided for when a number is complete, incomplete, or invalid. This can be used as above to provide
visual feedback. At the moment invalid text is reverted to the previous valid text, but I might change that to be
part of the callback in the future (depends on what other people think).

More information
----------------

If people ask questions or show interest, I'll write up some more doco. Otherwise, read the code - I've tried to document
it reasonably well.