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

if (document.getElementById('animatey')) {
  var headerAnimation = makeHeaderAnimation('#animatey');
  headerAnimation.initialize();
  headerAnimation.resize();
  headerAnimation.animate();
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

if (document.querySelector('header') && !inView.is(document.querySelector('header'))) {
  setCircleHiding();
}

var player;
var youtubeButton = document.getElementById('youtube-play');
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'DNWHZRafoXI',
    events: {
      'onReady': onPlayerReady
    }
  });
}
function onPlayerReady(playerEvent) {
  youtubeButton.addEventListener('click', function(){
    playerEvent.target.playVideo();
    youtubeButton.parentNode.classList.add('active');
  });
}
$(function() {
  window.onresize = function() {
    headerAnimation.resize();
  }

  if(window.location.hash) {
    var $topic = $(window.location.hash);
    if($topic) {
      setTimeout(function(){
        $('html, body').stop().animate({
          scrollTop: ($topic.offset().top - 50)
        }, 1250, 'easeInOutExpo');
      }, 500);
    }
  }
})