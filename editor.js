$(function() {
	var theme = 'solarized';
    //theme = 'xq-light';
	var height = $('textarea[name=less]').height();
	
	lessEditor = CodeMirror.fromTextArea($('textarea[name=less]')[0], {
		mode: "text/x-less",
		theme: theme,
		indentWithTabs: true
	});

	cssEditor = CodeMirror.fromTextArea($('textarea[name=css]')[0], {
		mode: "css",
		theme: theme,
		indentWithTabs: true,
		readOnly: true
	});

	htmlEditor = CodeMirror.fromTextArea($('textarea[name=html]')[0], {
		mode: 'xml',
		theme: theme,
		indentWithTabs: true
	});
	
	$(document).on('click','#rendered a,#rendered input[type=submit]',function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
	
	var changed = true;
	
	lessEditor.on('change', function() { changed = true });
	
	htmlEditor.on('change', function() { changed = true });
	
	var checkForUpdates = function() {
		if(changed) {
			compileLess();
			changed = false;
		}
	};
	
	var run = function() {
		try {
			checkForUpdates();
		} catch(e) {}
		window.setTimeout(run, 1000)
	}
	
	run();
});

var compileLess = function() {
	var lessText = lessEditor.getValue();
	var parser = new less.Parser();
	var cssText
	var error
	try {
		parser.parse(lessText, function (err, tree) {
			if (err) { error = err; return }
			cssText = tree.toCSS();
		});
	} catch(err) {
		error = err
	}
    
    var $doc = $($('#rendered iframe')[0].contentWindow.document);
    var $head = $doc.find('head');
    var $body = $doc.find('body');

    $.ajax({
       url: 'editor.css',
       cache: false,
       dataType: 'text',
       success: function(data) {
           $head.html('<style type="text/css">'+data+'body{padding:10px;}</style>');
       }
   });
	if(error) {
		$body.html('<div class="error">'+error+'</div>');
	} else {
		cssEditor.setValue(cssText);
        $body.html('<style type="text/css">'+cssText+'</style>' + htmlEditor.getValue());
	}
};

