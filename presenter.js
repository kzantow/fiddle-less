$(function() {
  var $examples = $('.dropdown-menu');
  
  var pages = {};
  
  var loadPage = function(url) {
      if(url in pages) {
          var $page = $(pages[url]);
          var title = $page.find('title').text();
          var less = $page.find('script[type=less]').text().trim();
          var html = $page.find('script[type=html]').text().trim();
          lessEditor.setValue(less);
          htmlEditor.setValue(html);
  $('h1').html(title);
      } else {
          $.ajax({
             url: url,
             cache: false,
             dataType: 'html',
             success: function(data) {
                 var $page = $(data);
                 pages[url] = data;
                 loadPage(url);
             }
          });
      }
  };
  
  var getCurrentPage = function() {
      var hash = (''+window.location.hash);
      if(hash) {
          return hash.substring(1);
      }
  };
  
  $(window).on('hashchange', function() {
   loadPage(getCurrentPage());
  });
  
  $(document).on('click', '.examples .next, .examples .prev', function() {
    var $curr = $examples.find('a[href="#'+getCurrentPage()+'"]');
    if($(this).is('.next')) {
        window.location.hash = $curr.parent().next().children().attr('href');
    } else {
        window.location.hash = $curr.parent().prev().children().attr('href');
    }
  });

  var findPages = function(idx) {
  var url = 'pages/' + idx.join('.') + '.html';
      $.ajax({
        url: url,
        cache: false,
        dataType: 'html',
        success: function(data) {
            var $page = $(data);
            var title = $page.find('title').text();
            
            pages[url] = data;
            
            var $el = $('<li><a href="#' + url + '">' + title + '</a></li>');
              
            $examples.append($el);
            
             var $li = $examples.children('li').detach();
             $li.sort(function(e1,e2) {
              var s1 = $(e1).children().attr('href').replace(/\.html/g,'');
              var s2 = $(e2).children().attr('href').replace(/\.html/g,'')
              return s1 < s2 ? -1 : 1;
            });
             $examples.append($li);
  
            var sub = idx.slice();
            sub.push(1);
            findPages(sub); // test for subpages
            idx[idx.length-1] = idx[idx.length-1] + 1;
            findPages(idx); // test for next pages
        }
     });
  };
  
  findPages([1]);
  
  if(getCurrentPage()) {
      loadPage(getCurrentPage());
  }
});
