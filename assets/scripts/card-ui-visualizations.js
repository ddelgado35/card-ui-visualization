$(function() {
  $('.card-block').each(function () {
    var $block = $(this);
    var options = {
      'add-click-callback': $block.attr('data-add-click-callback'),
      'add-count': $block.attr('data-add-count') ? parseInt($block.attr('data-add-count')) : 1,
      'row-fill': $block.hasClass('row-fill'),
      'row-size': $block.attr('data-row-size') ? parseInt($block.attr('data-row-size')) : 10,
      'stack': $block.hasClass('stack'),
      'stack-card-offset': $block.attr('data-stack-card-offset') ? parseInt($block.attr('data-stack-card-offset')) : 0,
      'stack-descend': $block.hasClass('stack-descend'),
      'data': $block.attr('data-set')
    };
    if (options.data === undefined) {
      // no data set provided ergo nothing to display
      return;
    }
    if (options['add-click-callback'] === undefined) {
      options['add-click-callback'] = _.identity;
    }
    
    // create shallow copy of array
    options.data = _.clone(window[options.data]);
    options['original-data-length'] = options.data.length;

    // add Add objects to array
    var counter = options['add-count'];
    if (options['row-fill'] === true) {
      counter = options['row-size'] - options['original-data-length'] % options['row-size'];
      if (counter <= 0) {
        counter = options['add-count'];
      }
    }
    for (var i = 0; i < counter; ++i) {
      options.data.push({ "type":["add"] });
    }
    options['data-length'] = options.data.length;

    // generate the mark-up
    var $row = null;
    _.each(options.data, function (element, index) {
      if (index % options['row-size'] === 0) {
        $row = $('<div>', { class: 'card-block-row' });
        $block.append($row);
        if (options['stack'] === true) {
          $block.append($('<div>', { class: 'clearfix' }));
        }
      }
      element['type'].push('card');
      if (options['stack-descend'] === true) {
        element['type'].push('descend');
      }
      var $node = null;
      if (_.contains(element.type, 'add')) {
        // Add button
        $node = $('<button>', { class: element['type'].join(' ') });
        $node.click(function (event) {
          window[options['add-click-callback']]($node);
        });
      } else {
        // data node
        $node = $('<img>', { class: element['type'].join(' '), src: element['img-uri'], alt: element['title'] });
      }
      if (options['stack'] === true) {
        if (options['stack-descend'] === false) {
          $node.attr('style', _.str.sprintf('left: calc(%dpx * %d);', options['stack-card-offset'], index));
        } else {
          $node.attr('style', _.str.sprintf('left: calc(%dpx * %d); z-index: %d', options['stack-card-offset'], index, (options['data-length'] - 1 - index)));
        }
      }
      $row.append($node);
    });
  });

  $('.card-ring').each(function () {
    $ring = $(this);
    var options = {
      'add-click-callback': $ring.attr('data-add-click-callback'),
      'add-count': $ring.attr('add-count') ? parseInt($ring.attr('add-count')) : 1,
      'clockwise': $ring.hasClass('clockwise'),
      'ring-fill': $ring.hasClass('ring-fill'),
      'ring-size': $ring.attr('data-ring-size') ? parseInt($ring.attr('data-ring-size')) : 0,
      'data': $ring.attr('data-set')
    };
    if (options['add-click-callback'] === undefined) {
      options['add-click-callback'] = _.identity;
    }
    var diameter = $ring.innerWidth();
    var clockwise = $ring.hasClass('clockwise');
    var radius = diameter / 2;
    var children = $ring.children();
    var size = $ring.attr('data-ring-size');
    var count = size === undefined ? children.length : parseInt(size);
    var theta = (clockwise ? 1 : -1) * 2 * Math.PI / count;
    var thetaOffset = -(Math.PI / 2);
    children.each(function (index, node) {
      var offset = $(node).outerWidth() / 2;
      var x = (radius - offset) + (radius * Math.cos(thetaOffset + (theta * (index + 1))));
      var y = (radius - offset) + (radius * Math.sin(thetaOffset + (theta * (index + 1))));
      $(node).css('left', x);
      $(node).css('top', y);
    });
  });
});