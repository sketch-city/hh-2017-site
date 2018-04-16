function makeHeaderAnimation(selector) {
  var svg = d3.select(selector),
    svgDOM = svg.node(),
    angles = d3.range(0, 2 * Math.PI, Math.PI / 200),
    path;

  function initialize() {
    path = svg
      .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
          .data(["#0088fe", "#0462d7", "#041781"])
          .enter().append("path")
            .attr("stroke", function(d) { return d; })
            .datum(function(d, i) {
              return d3.radialLine()
                .curve(d3.curveLinearClosed)
                .angle(function(a) { return a; })
                .radius(function(a) {
                  var t = d3.now() / 1000;
                  return 190 + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32;
                });
            });

    return path;
  }

  function animate() {
    return d3.timer(function() {
      path.attr("d", function(d) {
        return d(angles);
      });
    });
  }

  function resize() {
    var svgRect = svgDOM.parentNode.getBoundingClientRect(),
      width = svgRect.width,
      height = svgRect.height;

    return svg
      .select("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  }

  return {
    initialize: initialize,
    animate: animate,
    resize: resize
  }
}

function makeLogo(selector, circles) {
  var svg = d3.select(selector),
    svgDOM = svg.node();

  var circles = circles || this.defaultCircles;

  function initialize() {
    return svg
      .attr("viewBox", "-53 -53 106 106")
      .attr("fill", "none")
      .selectAll("circle")
        .data(circles)
        .enter().append("circle")
          .attr("fill", function (d) { return d.fill || 'none'; })
          .attr("cx", function (d) { return d.cx; })
          .attr("cy", function (d) { return d.cy; })
          .attr("r", function (d) { return d.r; })
          .attr("stroke-width", function (d) { return d.stroke; })
          .style("stroke", function(d) { return d.color; });
  }

  return {
    initialize: initialize
  }
}

makeLogo.defaultCircles = [
  { stroke: 5, cx: -14.75, cy: 13.25, r: 15.75, color: '#0624C1'},
  { stroke: 5, cx: -8.5, cy: 6.5, r: 26, color: '#0624C1'},
  { stroke: 5, cx: 0, cy: 0, r: 37.5, color: '#0624C1'}
];

function setCircleShowing() {
  document.body.classList.add('circle-showing');
  document.body.classList.remove('circle-hiding');
}

function setCircleHiding() {
  document.body.classList.add('circle-hiding');
  document.body.classList.remove('circle-showing');
}

function afterPageRender(){
  if (document.getElementById('animatey')) {
    var headerAnimation = makeHeaderAnimation('#animatey');
    headerAnimation.initialize();
    headerAnimation.resize();
    headerAnimation.animate();

    window.onresize = function() {
      headerAnimation.resize();
    }
  }

  var logo = makeLogo('#logo-image', _.concat([{ stroke: 5,
    cx: 0,
    cy: 0,
    r: 48,
    color: 'rgba(2, 10, 65, 1)',
    fill: 'rgba(2, 10, 65, 1)'
  }], makeLogo.defaultCircles));
  logo.initialize();

  inView.offset(50);
  inView('header')
    .on('enter', setCircleShowing)
    .on('exit', setCircleHiding);

  if ((document.querySelector('header') && !inView.is(document.querySelector('header'))) || !document.querySelector('header')) {
    setCircleHiding();
  }

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 100
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 50
    }
  });
}

function goToHash(hash){
  var $topic = $(hash);
  if($topic) {
    $('html, body').stop().animate({
      scrollTop: ($topic.offset().top - 50)
    }, 1250, 'easeInOutExpo');
  }
}

function getContentPath(){
  return window.location.origin + window.location.pathname + 'content.html';
}

function renderPartners(container){
  var partners = [
    {
      img: "City-of-Houston-Seal.gif",
      url: "http://www.houstontx.gov/"
    },
    {
      img: "controllerseal180.jpg",
      url: "http://www.houstontx.gov/controller/"
    },
    {
      img: "HCSO-LOGO2.png",
      url: "http://www.harriscountyso.org/"
    },
    {
      img: "cannon-logo.png",
      url: "https://thecannonhouston.com/"
    },
    {
      img: "code-park.png",
      url: "https://codeparkhouston.org"
    },
    {
      img: "techforjustice.png",
      url: "https://www.techforjustice.org"
    },
    {
      img: "houston-useRs-med.png",
      url: "https://houstonusers.github.io/"
    },
    {
      img: "CPanel_logo.svg.png",
      url: "https://cpanel.com/"
    },
    {
      img: "aiga_hou.png",
      url: "https://houston.aiga.org/"
    },
    {
      img: "ESRI.jpg",
      url: "https://houston.aiga.org/"
    },
    {
      img: "HCA.png",
      url: "https://houstontxcodingacademy.com/"
    },
    {
      img: "houston-data-vis.png",
      url: "https://houstondatavis.github.io/data-jams/"
    }
  ];

  var partnersHTML = partners.map(function(partner, index){
    var partnerHTML = '<div class="col-xs-4 col-sm-2 partner">\
    <a href="' + partner.url + '" target="_blank">\
    <img class="img-responsive" src="' + window.location.origin + '/img/partners/' + partner.img + '">\
    </a>\
    </div>';
    if ((index + 1) % 6 == 0){
      partnerHTML += '<div class="clearfix hidden-xs"></div>';
    }
    if ((index + 1) % 3 == 0){
      partnerHTML += '<div class="clearfix visible-xs-block"></div>';
    }
    return partnerHTML;
  }).join('');

  container.innerHTML = partnersHTML;
}

function handleLinkClicks(){
  var $links = $('a');
  var $parent = $('html, body');

  $links.filter('.page-scroll').each(function(menuItem){
    var $link = $(this);
    var href = $link.attr('href');
    var hash = new URI(href).hash();
    var $target = $(hash);
    if ($target.length) {
      $link.attr('href', hash);
    }
  });

  $links.filter('[href="' + window.location.href + '"]').parent().addClass('active');

  $links.on('click', function(clickEvent){
    var $link = $(this);
    var href = $link.attr('href');
    var url = new URI(href);

    if ($link.hasClass('page-scroll')) {
      var $target = $(url.hash());
      if($target.length) {
        clickEvent.preventDefault();
        $parent.stop().animate({
          scrollTop: $target.offset().top - 50
        }, 1250, 'easeInOutExpo');
      }
    }

  });
}

$(function() {

  var contentContainer = document.getElementById('content');

  $.get(getContentPath())
    .then(function(response){
      contentContainer.innerHTML = response;

      if(partnersContainer = document.getElementById('partners-content')){
        renderPartners(partnersContainer);
      }

      contentContainer.dataset.rendered = true;
      return response;
    })
    .then(afterPageRender)
    .then(handleLinkClicks)
    .then(function(){
      if(window.location.hash) {
        goToHash(window.location.hash);
      }
    });

});
