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
	
If people ask questions or show interest, I'll write up some more doco.