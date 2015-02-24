Tracing.directive.('slLineGraph', [
  function() {
    return {
      controller: ['$scope', '$log', function($scope, $log) {


        /*
        *
        * SCHEMA
        *
        * */


        function Schema(options){
          var self = this;
          if (!(self instanceof Schema)){
            return new Schema(options)
          }

          self.base = (options && options.keySchema) || {};
          self.color =  options.color || d3.scale.category10();

          //keep helper functions in the closure so that the d3 'this' pointer can be used
          self.y = function y(d){
            return (self.base[d.name] && self.base[d.name].y) || 'y';
          };

          self.lineClass = function lineClass(d){
            return (self.base[d.name] && self.base[d.name].class) || 'gradientLine';
          };

          self.stroke = function stroke(d){
            return self.color(d.name);
          };

          self.type = function type(d){
            return self.typeByKey(d.name);
          };

          self.typeByKey = function typeByKey(key){
            return (self.base[key] && self.base[key].type) || 'line';
          };

          self.formatByKey = function formatByKey(key){
            var y = self.y({name: key});
            if (options.format && options.format[y] && format[options.format[y]]) {
              return format[options.format[y]];
            } else {
              return format.num;
            }
          };
        }


        //var d3           = require('d3')
        //var EventEmitter = require('events').EventEmitter
        //var inherits     = require('util').inherits
        //var Schema       = require('./lib/schema')
        //var format       = require('cxviz-format')
        //var Draw         = require('./lib/draw')

        //module.exports = Line;
        /*
        *
        * DRAW
        *
        * */

        //'use strict';
        //var d3 = require('d3')

        function Draw(self){
          var drawfun = drawItems
          function drawItems(sel){
            // the this pointer will come from d3.call
            var ret = sel.each(function(d){
              var type = self.schema.type(d)
              var itemSel = d3.select(this)
              if( type == 'line'){
                drawfun.line(itemSel)
              } else if (type == 'rect') {
                drawfun.rect(itemSel)
              } else if( type == 'range') {
                drawfun.range(itemSel)
              }
            })
            return ret
          }
          drawfun.line = function line(sel){
            sel.append('path')
              .attr('d', function (d) { return self[d.type](d.values) })
              .attr('class', self.schema.lineClass)
              .style('stroke', self.schema.stroke)
          };
          drawfun.rect = function rect(sel){
            var g = sel.append('g')
            var update = g.selectAll('.cxviz-timeseries-rect').data(function(d) { return d.values})
            update.enter()
              .append('rect')
              .attr('x', function(d) { return leftx(self, d)})
              .attr('y', function(d) { return y(self, d, 'max')})
              .attr('width', function(d){ return width(self, d)})
              .attr('height', function(d){ return height(self, d)})
              .attr('class', self.schema.lineClass)
              .style('stroke', self.schema.stroke)
          };
          drawfun.range = function range(sel){
            var seriesg = sel.append('g')
            var update = seriesg.selectAll('.cxviz-timeseries-rect').data(function(d) { return d.values})
            var g = update.enter()
              .append('g')
              .attr('class', self.schema.lineClass)
            g.append('line')
              .attr('x1', function(d) { return x(self, d)})
              .attr('y1', function(d) { return y(self, d, 'max')})
              .attr('x2', function(d){ return x(self, d)})
              .attr('y2', function(d){ return y(self, d, 'min')})
              .attr('class', 'cxviz-timeseries-range-vertical')
              .style('stroke', self.schema.stroke)
            g.append('line')
              .attr('x1', function(d) { return leftx(self, d) })
              .attr('y1', function(d) { return y(self, d, 'max')})
              .attr('x2', function(d){ return rightx(self, d)})
              .attr('y2', function(d){ return y(self, d, 'max')})
              .attr('class', 'cxviz-timeseries-range-endcap')
              .style('stroke', self.schema.stroke)
            g.append('line')
              .attr('x1', function(d) { return leftx(self, d)})
              .attr('y1', function(d) { return y(self, d, 'min')})
              .attr('x2', function(d){ return rightx(self, d)})
              .attr('y2', function(d){ return y(self, d, 'min') })
              .attr('class', 'cxviz-timeseries-range-endcap')
              .style('stroke', self.schema.stroke)
          };
          return drawfun
        }

        function leftx(viz, d){
          return viz.x(d.date) - (width(viz, d) / 2)
        }

        function rightx(viz, d){
          return viz.x(d.date) + (width(viz, d) / 2)
        }

        function x(viz, d){
          return viz.x(d.date)
        }

        function y(viz, d, key){
          return viz[viz.schema.y(d)](key ? d.val[key] : d.val)
        }

        function width(viz, d){
          var computed = viz.raw.length / viz.innerWidth
          if( computed < 7 ){
            return 7
          } else if (computed > 20 ){
            return 20
          } else {
            return computed
          }
        }

        function height(viz, d){
          var h = y(viz, d, 'min') - y(viz, d, 'max')
          return (h < 2 ) ? 2 : h
        }











        /*
        *
        * LINE
        *
        * */
        var MAX_SERIES = 500;
        var MAX_RECORDS = 5000;

        var ONE_MIN_MS = 1000 * 60;
        var ONE_HOUR_MS = ONE_MIN_MS * 60;
        var ONE_DAY_MS = ONE_HOUR_MS * 24;
        var ONE_WEEK_MS = ONE_DAY_MS * 7;
        var DEFAULT_RATIO = 5;

        var _dateBisect = d3.bisector(function(d) { return d._t; }).left;
// options:
//   type -- line, sparkline, miniline
//   height -- in px, [uses ratio of 2.5]
//   ratio -- ratio of width to height [2.5]
//   width -- in px, [parent width]
//   margin -- obj, in px, {top: 30, right: 50, bottom: 30, left: 50};
//   showXAxis -- bool [default depends on type]
//   showYAxis -- bool [default depends on type]
//   xGridTicks -- count [0]
//   yGridTicks -- count [1] (depending on type)
//   scale -- linear, log [linear]
//   interactive -- bool [default depends on graph type]
//   legend -- bool [default depends on graph type]
//   yMin -- value [undef] (override minimum to show on graph)
//   yMax -- value [undef] (override maximum to show on graph)
//   yMaxSoft -- soft max y value. Uses if max Y value < yMaxSoft [undef]
//   yMaxPaddingPct -- pct padding above the max Y value
//   gradient -- obj [undef] ({low: value, high: value}, threshold for gradient. included values are 'good')
//      TODO -- specify gradient from mean value?
// TODO other options:
//       bounding ranges/series? color options? error ranges?
//   formatter -- formatting function for data
        function Line(parent, options) {
          var component = this;
          if (!(component instanceof Line)) return new Line(parent, options);
          component.parent = d3.select(parent);
          component.options = options
          component.schema = new Schema(options)
          component.reset(options);
          //EventEmitter.call(component);
        }
        //inherits(Line, EventEmitter);

// This is a harder reset than redraw() -- it actually removes the svg element in #parent and makes a new one.
        Line.prototype.reset = function (options) {
          var component = this;
          var svgElement = component.parent.selectAll('svg');
          options = options || {};
          svgElement.remove()

          component.raw = [];
          component.series = [];
          component.timeseries = [];

          // TODO ability to change chart size upon redraw()
          component.type = 'line';
          component.parentNode = component.parent.node()
          component.width = (component.parentNode && component.parentNode.offsetWidth) || 1000;
          component.height = Math.round(component.width / DEFAULT_RATIO);
          component.margin = {top: 20, right: 80, bottom: 30, left: 80}; // TODO better defaults?

          component.showXAxis = true;
          component.showYAxis = true;
          component.xGridTicks = 0;
          component.yGridTicks = 1;
          component.yAxisTicks = 10;

          component.bgfill = 'none'

          component.formatter = options.formatter;

          component.yMin = options.yMin;
          component.yMax = options.yMax;
          if (options.yMaxPaddingPct != null) {
            component.yMaxPaddingPct = (options.yMaxPaddingPct < 1) ? options.yMaxPaddingPct : options.yMaxPaddingPct / 100;
          }

          component.scale = 'linear'; // TODO other scales, e.g. log
          component.interactive = true;
          component.legend = true;

          component.color = (options.color && options.color.moduleColor) || d3.scale.category10()

          // TODO y gridlines based on data extent?

          // Now that the defaults are set, override
          component.redraw(options);

          component.innerWidth = component.width - component.margin.right - component.margin.left;
          component.innerHeight = component.height - component.margin.top - component.margin.bottom;

          component.x = d3.time.scale()
            .range([0, component.innerWidth]);

          component.y = d3.scale.linear()
            .range([component.innerHeight, 0])
          component.y1 = d3.scale.linear()
            .range([component.innerHeight, 0])

          component.xAxis = d3.svg.axis()
            .scale(component.x)
            .orient('bottom');

          component.xGrid = d3.svg.axis()
            .scale(component.x)
            .orient('bottom')
            .ticks(component.xGridTicks)
            .tickSize(-component.innerHeight, 0, 0)
            .tickFormat('');

          component.yAxis = component._yAxis('y')
          component.y1Axis = component._yAxis('y1')

          component.yGrid = d3.svg.axis()
            .scale(component.y)
            .orient('left')
            .ticks(component.yGridTicks)
            .tickSize(-component.innerWidth, 0, 0)
            .tickFormat('');

          component.formatDate = d3.time.format('%Y-%m-%d %H:%M:%S.%L');

          var self = this;
          self.line = d3.svg.line()
            .x(function(d) { return self.x(d.date); })
            .y(function(d) { return self[self.schema.y(d)](d.val) })
            .defined(function(d) { return (d.val != null && !isNaN(d.val)) });
          self.area = d3.svg.area()
            .x(function(d){ return self.x(d.date);})
            .y0(function(d){ return self[self.schema.y(d)](d.val.min)})
            .y1(function(d){ return self[self.schema.y(d)](d.val.max)})

          self.svg = self.parent.append('svg')
            .attr('width', self.width)
            .attr('height', self.height);

          self.graph = self.svg.append('g')
            .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');

          self.graph.append('rect')
            .attr('class', 'underlay')
            .attr('width', self.innerWidth)
            .attr('height', self.innerHeight)
            //.style('fill-opacity', 0.25)
            .style('fill', self.bgfill);


        };


// The initial draw of the data
        Line.prototype.draw = function (data) {
          var self = this

          if (!data || data.length === 0) {
            return new Error('No records to show.');
          }
          if (data.length > MAX_RECORDS) {
            return new Error('Too many records for Line.');
          }

          //if our width is different, hard reset
          //TODO--make resize more dynamic
          var tempwidth = (self.parentNode && self.parentNode.offsetWidth) || 1000;
          if( tempwidth != self.width ){
            self.reset(self.options)
          }
          self.raw = data;
          var series = [];
          var records = data.length;
          for (var i = 0; i < records; i++) {
            var record = data[i];
            if (series.length > MAX_SERIES) break;
            Object.keys(record).forEach(function (key) {
              if (series.length > MAX_SERIES){
                return
              }
              if (key === '_t' || key === 'date'){
                return
              }
              if( key === '__data'){
                return
              }
              if (series.indexOf(key) < 0 && record[key] != null ){
                series.push(key)
              }
            });
            record.date = new Date(record._t);
          }

          if (series.length > MAX_SERIES) {
            console.log('Refusing to plot line graph with %s series', series.length)
            return new Error('Too many series detected');
          }

          var timeseries = series.map(function (name) {
            return {
              name: name,
              type: typeof record[name] == 'object' ? 'area' : 'line',
              values: data.filter(function (record) { return record[name] != null })
                .map(function (record) { return {name: name, date: record.date, val: isNaN(record[name]) ? record[name] : +record[name]} })
            };
          });

          var yMin = (self.yMin == null) ? d3.min(timeseries.filter(function(d){ return self.schema.y(d) == 'y'}), function (s) { return d3.min(s.values, function (v) { return isNaN(v.val) ? v.val.min : v.val ; })}) : self.yMin;
          var yMax = (self.yMax == null) ? d3.max(timeseries.filter(function(d){ return self.schema.y(d) == 'y'}), function (s) { return d3.max(s.values, function (v) { return isNaN(v.val) ? v.val.max : v.val; })}) : self.yMax;

          var y1Min = (self.yMin == null) ? d3.min(timeseries.filter(function(d){ return self.schema.y(d) == 'y1'}), function (s) { return d3.min(s.values, function (v) { return isNaN(v.val) ? v.val.min : v.val ; })}) : self.yMin;
          var y1Max = (self.yMax == null) ? d3.max(timeseries.filter(function(d){ return self.schema.y(d) == 'y1'}), function (s) { return d3.max(s.values, function (v) { return isNaN(v.val) ? v.val.max : v.val; })}) : self.yMax;

          if (self.yMaxPaddingPct != null) {
            yMax = (self.yMaxPaddingPct + 1) * (yMax - yMin);
          }

          if (self.yMaxSoft != null && yMax < self.yMaxSoft) {
            yMax = self.yMaxSoft;
          }

          self.x.domain([data[0].date, data[data.length - 1].date]);
          self.y.domain([yMin, yMax]);
          self.y1.domain([y1Min, y1Max]);

          self.series = series;
          self.timeseries = timeseries;

          self._draw();

          var anomalies = self.graph.append('g')
            .attr('class', 'anomalies')
            .selectAll('path').data(data.filter(function(d, i){ return !!d.__data.lm_a }))
          anomalies.enter().append('path')
            .on('mouseover', anomalyHover)
            .on('click', anomalyClick)
          anomalies
            .attr('fill', function(d){ return d.__data.lm_a == 1 ? 'red' : '#ff7518' })
            .attr('stroke', 'none')
            .attr('d', triangle)
          anomalies.exit().remove()

          // Triangles
          function triangle(d) {
            var x = self.x(d.date)
            var y = self.innerHeight
            var top = 'M ' + x + ' ' + (y + 3)
            var bottomLeft = 'L ' + (x - 5) + ' ' + (y + 13)
            var bottomRight = 'L ' + (x + 5) + ' ' + (y + 13)
            return top + ' ' + bottomLeft + ' ' + bottomRight + ' Z'
          }

          function anomalyHover(d) {
            self.hoverAt(d._t)
          }

          function anomalyClick(d) {
            self.emit('click', d.__data)
          }
        };

// Redraw the data with different options
// Or if not drawn yet, simply set options
        Line.prototype.redraw = function (options) {
          var self = this;
          // Apply type-specific defaults
          var type = options.type || self.type;
          switch (type) {
            case 'line':
              self.showXAxis = true;
              self.showYAxis = true;
              self.xGridTicks = 0;
              self.yGridTicks = 3;
              break;
            case 'miniline':
              self.showXAxis = false;
              self.showYAxis = true;
              self.xGridTicks = 0;
              self.yGridTicks = 0;
              self.yAxisTicks = 3;
              self.yTickSize = 0;
              self.margin = {top: 0, right: 0, bottom: 0, left: 35};
              self.interactive = false;
              self.legend = false;
              self.ratio = 7;
              self.bgfill = '#fff';
              self.yMaxPaddingPct = 0.1;
              break;
            case 'sparkline':
              self.showXAxis = false;
              self.showYAxis = false;
              self.xGridTicks = 0;
              self.yGridTicks = 0;
              self.yAxisTicks = 0;
              self.margin = {top: 0, right: 0, bottom: 0, left: 0};
              self.interactive = false;
              self.legend = false;
              self.ratio = 10;
              self.bgfill = '#fff';
              break;
            default:
              return new Error('Unknown chart type.');
          };
          // Simple options clobber. TBD: consider validity checks
          Object.keys(options).forEach(function (o) { self[o] = options[o] });
          if( self.color.moduleColor ) {
            self.color = this.color.moduleColor
          };

          if (self.ratio && !options.width) {
            self.height = Math.round(self.width / self.ratio);
          };

          self.yAxis = self._yAxis();

          if (self.legend) {
            // TBD maybe make this more dynamic
            // Force 20 pixel margin at the top for the legend
            self.margin.top = 20;
          }

          // Don't attempt to re-draw if it hasn't been drawn yet (or no data)
          if (!self.timeseries.length) return;
          self._draw();
        };

// New incoming data, transition in/transition out old
// Line.prototype.update = function (delta) {
//   // TODO...
// }
        Line.prototype.update = Line.prototype.draw;


        Line.prototype._draw = function () {
          var self = this;

          // TODO consider transitioning these out.
          self.graph.selectAll('.axis').remove();
          self.graph.selectAll('.grid').remove();
          self.graph.selectAll('.timeline').remove();
          self.graph.selectAll('#gradient').remove();
          self.graph.selectAll('.hover-line').remove();
          self.graph.selectAll('.select-line').remove();
          self.graph.selectAll('.overlay').remove();
          self.svg.selectAll('.x-legend').remove();
          self.svg.selectAll('.y-legend').remove();

          self.svg.selectAll('.underlay')
            .style('fill', self.bgfill);

          // Maybe add in some axes.
          if (self.showXAxis) {
            self.graph.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + self.innerHeight + ')')
              .call(self.xAxis);
          }

          if (self.showYAxis) {
            self.graph.append('g')
              .attr('class', 'y axis')
              .call(self.yAxis)
          }
          if( true /*this.showY1Axis*/){
            self.graph.append('g')
              .attr('class', 'y1 axis')
              .attr('transform', 'translate(' + (self.innerWidth) + ', 0)')
              .call(self.y1Axis);
          }

          if (self.yGridTicks > 0) {
            self.graph.append('g')
              .attr('class', 'y grid')
              .call(self.yGrid);
          }

          if (self.xGridTicks > 0) {
            self.graph.append('g')
              .attr('class', 'x grid')
              .attr('transform', 'translate(0,' + self.innerHeight + ')')
              .call(self.xGrid);
          }

          if (self.legend) {
            var earliest = self.raw[0]._t;
            var last = self.raw[self.raw.length - 1]._t;
            // Avg number of milli gap per record. Can be off if data is unevenly spaced.
            var avgGap = (last - earliest) / self.raw.length;
            if (avgGap > ONE_WEEK_MS) {
              self.formatDate = d3.time.format('%b %Y');
            }
            else if (avgGap > ONE_HOUR_MS * 12) {
              self.formatDate = d3.time.format('%Y-%m-%d (%a)');
            }
            else if (avgGap > ONE_MIN_MS * 30) {
              self.formatDate = d3.time.format('%Y-%m-%d (%a) %H:%M');
            }
            else if (avgGap > 1000 * 30) {
              // Bigger than 30s on average
              self.formatDate = d3.time.format('%Y-%m-%d %H:%M:%S');
            }

            // TODO checks related to total svg width

            self.xLegend = self.svg.append('g')
              .attr('class', 'x-legend')
              .attr('transform', 'translate(8, 15)');

            self.xLegend.append('text')
              .attr('class', 'legend-text');

            var nextX = 0;
            self.svg.append('g')
              .attr('class', 'y-legend')
              .attr('transform', 'translate(8, 15)')
              .selectAll('g')
              .data(self.series)
              .enter()
              .append('text')
              .attr('class', 'legend-text')
              .text(function (d) { return d; })
              .attr('x', function (d, i) {
                var offset = nextX;
                nextX += (d.length + 1) * 8;
                return offset;
              })
              .style('fill', function (d) { return self.color(d) });
          }

          switch(self.type) {
            case 'line':
            case 'miniline':
            case 'sparkline':
              return self._line();
            default:
              return new Error('Unknown chart type.');
          }

        };

        Line.prototype._yAxis = function (type) {
          var axis = d3.svg.axis()
            .scale(self[type])
            .orient(type == 'y' ? 'left' : 'right');

          if (self.tickFormat) {
            axis.tickFormat(this.tickFormat);
          }
          else if (self.options.format && self.options.format[type] ) {
            axis.tickFormat(format[self.options.format[type]])
          } else {
            axis.tickFormat(format.mb);
          }

          if (self.yAxisTicks != null) {
            axis.ticks(self.yAxisTicks);
          }

          if (self.yAxisValues != null) {
            axis.tickValues(self.yAxisValues);
          }

          if (self.yTickSize != null) {
            axis.tickSize(self.yTickSize);
          }

          return axis;
        };

// Draw the loaded data as a line graph
        Line.prototype._line = function () {
          var self = this;
          var draw = Draw(self)
          self.graph.selectAll('.timeline')
            .data(self.timeseries)
            .enter().append('g')
            .attr('class', 'timeline')
            .call(draw)

          if (self.interactive) {
            // TODO enable interactivity hooks/listeners
            self.hoverLineGroup = self.graph.append('g')
              .attr('class', 'hover-line');

            self.hoverLine = self.hoverLineGroup.append('line')
              // TODO x1 to 0/0, or max/max?
              .attr('x1', self.innerWidth).attr('x2', self.innerWidth)
              .attr('y1', 0).attr('y2', self.innerHeight);

            self.selectLineGroup = self.graph.append('g')
              .attr('class', 'select-line')
              .attr('style', self.selectionX ? 'display: visible' : 'display: none')

            self.selectLine = self.selectLineGroup.append('line')
              // TODO x1 to 0/0, or max/max?
              .attr('x1', self.selectionX || self.innerWidth).attr('x2', self.selectionX || self.innerWidth)
              .attr('y1', 0).attr('y2', self.innerHeight);

            self.graph.append('rect')
              .attr('class', 'overlay')
              .attr('width', self.innerWidth)
              .attr('height', self.innerHeight)
              .on('mousemove', getHoverX)
              .on('click', handleClick)
          }
          function handleClick(){
            var coords = d3.mouse(this)
            var ts = self.x.invert(coords[0]).getTime()
            var rec = self.getRecordAt(ts)
            var x = self.x(rec.date) | 0;
            self.selectionX = x
            self.selectLine
              .attr('x1', x).attr('x2', x)
              .attr('style', 'display: visible')
            self.emit('click', rec.__data)
          }

          function getHoverX() {
            var coords = d3.mouse(this);
            var ts = self.x.invert(coords[0]).getTime();
            self.hoverAt(ts);
            self.emit('hover', ts);
          }
        }

        Line.prototype.clearSelection = function clearSelection(){
          delete this.selectionX
        }


        Line.prototype.getRecordAt = function getRecordAt(timestamp){
          var self = this;
          var record = self.raw.slice(-1)[0];
          if (timestamp < record._t) {
            var entry = _dateBisect(self.raw, timestamp, 1);
            var left = self.raw[entry - 1];
            var right = self.raw[entry];
            if (!left || !right) return right || left
            record = (timestamp - left._t > right._t - timestamp) ? right : left;
          }
          return record
        }

// TODO emit/listen for highlight events when other graphs are highlighting
        Line.prototype.hoverAt = function (timestamp) {
          var self = this;

          var record = self.getRecordAt(timestamp)

          var x = self.x(record.date) | 0;

          self.hoverLine
            .attr('x1', x)
            .attr('x2', x)
            .attr('stroke', function (d, i) { return record.__data.lm_a ? 'red' : 'black' })
            .attr('stroke-width', 1)

          var formattedDate = self.formatDate(record.date);

          var colors = [];
          var legendValues = self.series.slice(0).sort(function(a, b) {
            if (record[a] == null){
              return b
            }
            if (record[b] == null) {
              return a
            }
            return record[b] - record[a]
          }).map(function (key) {
            var value;
            var f = self.schema.formatByKey(key)
            if( (record[key] !== undefined) && record[key] !== null) {
              if( typeof record[key] == 'object' ){
                value = [f(record[key].min), f(record[key].max)].join('/')
              } else {
                value = f(record[key])
              }
            } else {
              value = 'N/A'
            }
            colors.push(self.color(key))
            return key + ': ' + value
          });

          // TODO better handling when it runs off the end
          self.svg.selectAll('.y-legend')
            .attr('transform', 'translate(' + (formattedDate.length + 2) * 8 + ', 15)')
          var nextX = 0
          self.svg.selectAll('.y-legend > .legend-text')
            .text(function (d, i) {
              return legendValues[i]
            })
            .attr('x', function (d, i) {
              var offset = nextX;
              nextX += (legendValues[i].length + 1) * 8;
              return offset;
            })
            .style('fill', function (d, i) { return colors[i] })


          self.xLegend.select('text').text(formattedDate)
        }

      }]
    };
  }
]);
Tracing.directive('slTracingLineGraph', [
  '$log',
  'TracingFormat',
  function($log, TracingFormat) {
    return {
      restrict: 'E',
      template: '<div><div id="cpu-history-cont" data-hook="cpumonitor"></div>{{currentTimeline}}</div>',
      link: function(scope, el, atrs) {

        var component = {};
        var colormap = {
          'Process Heap Total': 'rgba(63,182,24, 1)',
          'Process Heap Used': 'rgba(255,117,24, 1)',
          'Process RSS': 'rgba(39,128,227, 1)',
          'Load Average': 'rgba(39,128,227, 1)',
          'Uptime': 'rgba(255,117,24, 1)'
        };


        function convertTimeseries(t){
          var ret = {};
          ret.mem = t.map(function(d){
            var item = {
              _t: moment(d.ts).unix()*1000,
              'Process Heap Total': d.p_mt,
              'Process Heap Used': d.p_mu,
              'Process RSS': d.p_mr,
              __data: d
            };
            return item
          });
          ret.mem = ret.mem.sort(function(a,b){ return a._t - b._t;});

          ret.cpu = t.map(function(d){
            var item = {
              _t: moment(d.ts).unix()*1000,
              'Load Average': d['s_la'],
              'Uptime': d['p_ut'],
              __data: d
            };
            return item;
          });
          ret.cpu = ret.cpu.sort(function(a,b){ return a._t - b._t;});
          return ret;
        }

        function mbFormat(val){
          return numeral(val).format('0.0 b');
        }

        function color(name){
          return colormap[name] || '#00000';
        }


          var memGraphOptions = {
          yMin: 0,
          color: color,
          formatter: TracingFormat
        };

        var cpuGraphOptions = {
          color: color,
          format: {
            'y': 'num',
            'y1': 's'
          },
          keySchema: {
            'Load Average': {
              class: 'cx-monitor-loadavg',
              type: 'line',
              y: 'y'
            },
            'Uptime': {
              class: 'cx-monitor-uptime',
              type: 'line',
              y: 'y1'
            }
          }
        };

        //var d3           = require('d3')
        //var EventEmitter = require('events').EventEmitter
        //var inherits     = require('util').inherits
        var Schema = function(options){
          if (!(this instanceof Schema)){
            return new Schema(options);
          }
          var self = this;
          self.base = (options && options.keySchema) || {};
          self.color =  options.color || d3.scale.category10();

          //keep helper functions in the closure so that the d3 'this' pointer can be used
          self.y = function y(d){
            return (self.base[d.name] && self.base[d.name].y) || 'y';
          };

          self.lineClass = function lineClass(d){
            return (self.base[d.name] && self.base[d.name].class) || 'gradientLine';
          };

          self.stroke = function stroke(d){
            return self.color(d.name);
          };

          self.type = function type(d){
            return self.typeByKey(d.name);
          };

          self.typeByKey = function typeByKey(key){
            return (self.base[key] && self.base[key].type) || 'line';
          };

          self.formatByKey = function formatByKey(key){
            var y = self.y({name: key});
            if (options.format && options.format[y] && TracingFormat.format[options.format[y]]) {
              return TracingFormat.format[options.format[y]];
            } else {
              return TracingFormat.num;
            }
          }
        };












        var Draw = function(self){
          var drawfun = drawItems;
          function drawItems(sel){
            // the this pointer will come from d3.call
            var ret = sel.each(function(d){
              var type = self.schema.type(d);
              var itemSel = d3.select(this);
              if( type == 'line'){
                drawfun.line(itemSel);
              } else if (type == 'rect') {
                drawfun.rect(itemSel);
              } else if( type == 'range') {
                drawfun.range(itemSel);
              }
            });
            return ret;
          }
          drawfun.line = function line(sel){
            sel.append('path')
              .attr('d', function (d) { return self[d.type](d.values) })
              .attr('class', self.schema.lineClass)
              .style('stroke', self.schema.stroke);
          };

          drawfun.rect = function rect(sel){
            var g = sel.append('g');
            var update = g.selectAll('.cxviz-timeseries-rect').data(function(d) { return d.values});
            update.enter()
              .append('rect')
              .attr('x', function(d) { return leftx(self, d)})
              .attr('y', function(d) { return y(self, d, 'max')})
              .attr('width', function(d){ return width(self, d)})
              .attr('height', function(d){ return height(self, d)})
              .attr('class', self.schema.lineClass)
              .style('stroke', self.schema.stroke);
          };

          drawfun.range = function range(sel){
            var seriesg = sel.append('g');
            var update = seriesg.selectAll('.cxviz-timeseries-rect').data(function(d) { return d.values});
            var g = update.enter()
              .append('g')
              .attr('class', self.schema.lineClass);
            g.append('line')
              .attr('x1', function(d) { return x(self, d)})
              .attr('y1', function(d) { return y(self, d, 'max')})
              .attr('x2', function(d){ return x(self, d)})
              .attr('y2', function(d){ return y(self, d, 'min')})
              .attr('class', 'cxviz-timeseries-range-vertical')
              .style('stroke', self.schema.stroke);
            g.append('line')
              .attr('x1', function(d) { return leftx(self, d) })
              .attr('y1', function(d) { return y(self, d, 'max')})
              .attr('x2', function(d){ return rightx(self, d)})
              .attr('y2', function(d){ return y(self, d, 'max')})
              .attr('class', 'cxviz-timeseries-range-endcap')
              .style('stroke', self.schema.stroke);
            g.append('line')
              .attr('x1', function(d) { return leftx(self, d)})
              .attr('y1', function(d) { return y(self, d, 'min')})
              .attr('x2', function(d){ return rightx(self, d)})
              .attr('y2', function(d){ return y(self, d, 'min') })
              .attr('class', 'cxviz-timeseries-range-endcap')
              .style('stroke', self.schema.stroke);
          };

          return drawfun;
        };

        function leftx(viz, d){
          return viz.x(d.date) - (width(viz, d) / 2);
        }

        function rightx(viz, d){
          return viz.x(d.date) + (width(viz, d) / 2);
        }

        function x(viz, d){
          return viz.x(d.date);
        }

        function y(viz, d, key){
          return viz[viz.schema.y(d)](key ? d.val[key] : d.val);
        }

        function width(viz, d){
          var computed = viz.raw.length / viz.innerWidth;
          if( computed < 7 ){
            return 7;
          } else if (computed > 20 ){
            return 20;
          } else {
            return computed;
          }
        }

        function height(viz, d){
          var h = y(viz, d, 'min') - y(viz, d, 'max');
          return (h < 2 ) ? 2 : h;
        }













        var MAX_SERIES = 500;
        var MAX_RECORDS = 5000;

        var ONE_MIN_MS = 1000 * 60;
        var ONE_HOUR_MS = ONE_MIN_MS * 60;
        var ONE_DAY_MS = ONE_HOUR_MS * 24;
        var ONE_WEEK_MS = ONE_DAY_MS * 7;
        var DEFAULT_RATIO = 5;

        var _dateBisect = d3.bisector(function(d) { return d._t; }).left;
// options:
//   type -- line, sparkline, miniline
//   height -- in px, [uses ratio of 2.5]
//   ratio -- ratio of width to height [2.5]
//   width -- in px, [parent width]
//   margin -- obj, in px, {top: 30, right: 50, bottom: 30, left: 50};
//   showXAxis -- bool [default depends on type]
//   showYAxis -- bool [default depends on type]
//   xGridTicks -- count [0]
//   yGridTicks -- count [1] (depending on type)
//   scale -- linear, log [linear]
//   interactive -- bool [default depends on graph type]
//   legend -- bool [default depends on graph type]
//   yMin -- value [undef] (override minimum to show on graph)
//   yMax -- value [undef] (override maximum to show on graph)
//   yMaxSoft -- soft max y value. Uses if max Y value < yMaxSoft [undef]
//   yMaxPaddingPct -- pct padding above the max Y value
//   gradient -- obj [undef] ({low: value, high: value}, threshold for gradient. included values are 'good')
//      TODO -- specify gradient from mean value?
// TODO other options:
//       bounding ranges/series? color options? error ranges?
//   formatter -- formatting function for data
        function Line(parent, options) {
          if (!(this instanceof Line)) return new Line(parent, options);
          component = this;
          component.parent = d3.select(parent);
          component.options = options
          component.schema = new Schema(options)
          component.reset(options);
          //EventEmitter.call(this);
        }

       // inherits(Line, EventEmitter);

// This is a harder reset than redraw() -- it actually removes the svg element in #parent and makes a new one.
        Line.prototype.reset = function (options) {

          var svg = d3.select("#cpu-history-cont");
          //var districts = svg.selectAll("path");
          var svgElement = svg.selectAll('svg');
          options = options || {};
          svgElement.remove();

          component.raw = [];
          component.series = [];
          component.timeseries = [];

          // TODO ability to change chart size upon redraw()
          component.type = 'line';
          component.parentNode = component.parent.node()
          component.width = (component.parentNode && component.parentNode.offsetWidth) || 1000;
          component.height = Math.round(component.width / DEFAULT_RATIO);
          component.margin = {top: 20, right: 80, bottom: 30, left: 80}; // TODO better defaults?

          component.showXAxis = true;
          component.showYAxis = true;
          component.xGridTicks = 0;
          component.yGridTicks = 1;
          component.yAxisTicks = 10;

          component.bgfill = 'none';

          component.formatter = options.formatter;

          component.yMin = options.yMin;
          component.yMax = options.yMax;
          if (options.yMaxPaddingPct != null) {
            component.yMaxPaddingPct = (options.yMaxPaddingPct < 1) ? options.yMaxPaddingPct : options.yMaxPaddingPct / 100;
          }

          component.scale = 'linear'; // TODO other scales, e.g. log
          component.interactive = true;
          component.legend = true;

          component.color = (options.color && options.color.moduleColor) || d3.scale.category10()

          // TODO y gridlines based on data extent?

          // Now that the defaults are set, override
          component.redraw(options);

          component.innerWidth = component.width - component.margin.right - component.margin.left;
          component.innerHeight = component.height - component.margin.top - component.margin.bottom;

          component.x = d3.time.scale()
            .range([0, component.innerWidth]);

          component.y = d3.scale.linear()
            .range([component.innerHeight, 0]);
          component.y1 = d3.scale.linear()
            .range([component.innerHeight, 0]);

          component.xAxis = d3.svg.axis()
            .scale(component.x)
            .orient('bottom');

          component.xGrid = d3.svg.axis()
            .scale(component.x)
            .orient('bottom')
            .ticks(component.xGridTicks)
            .tickSize(-component.innerHeight, 0, 0)
            .tickFormat('');

          component.yAxis = component._yAxis('y');
          component.y1Axis = component._yAxis('y1');

          component.yGrid = d3.svg.axis()
            .scale(component.y)
            .orient('left')
            .ticks(component.yGridTicks)
            .tickSize(-component.innerWidth, 0, 0)
            .tickFormat('');

          component.formatDate = d3.time.format('%Y-%m-%d %H:%M:%S.%L');

          var self = this;
          this.line = d3.svg.line()
            .x(function(d) { return self.x(d.date); })
            .y(function(d) { return self[self.schema.y(d)](d.val) })
            .defined(function(d) { return (d.val != null && !isNaN(d.val)) });
          component.area = d3.svg.area()
            .x(function(d){ return self.x(d.date);})
            .y0(function(d){ return self[self.schema.y(d)](d.val.min)})
            .y1(function(d){ return self[self.schema.y(d)](d.val.max)})

         // this.svg = $("#cpu-history-cont").append('svg')
          component.svg = jQuery('#cpu-histrory-cont').append('svg')
            .attr('width', component.width)
            .attr('height', component.height);

          component.graph = component.svg.append('g')
            .attr('transform', 'translate(' + component.margin.left + ',' + component.margin.top + ')');

          component.graph.append('rect')
            .attr('class', 'underlay')
            .attr('width', component.innerWidth)
            .attr('height', component.innerHeight);
            //.style('fill-opacity', 0.25)
           // .style('fill', this.bgfill);


        };


// The initial draw of the data
        Line.prototype.draw = function (data) {
          var self = this;

          if (!data || data.length === 0) {
            return new Error('No records to show.');
          }
          if (data.length > MAX_RECORDS) {
            return new Error('Too many records for Line.');
          }

          //if our width is different, hard reset
          //TODO--make resize more dynamic
          var tempwidth = (component.parentNode && component.parentNode.offsetWidth) || 1000;
          if( tempwidth != component.width ){
            this.reset(component.options)
          }
          this.raw = data;
          var series = [];
          var records = data.length;
          for (var i = 0; i < records; i++) {
            var record = data[i];
            if (series.length > MAX_SERIES) break;
            Object.keys(record).forEach(function (key) {
              if (series.length > MAX_SERIES){
                return
              }
              if (key === '_t' || key === 'date'){
                return
              }
              if( key === '__data'){
                return
              }
              if (series.indexOf(key) < 0 && record[key] != null ){
                series.push(key)
              }
            });
            record.date = new Date(record._t);
          }

          if (series.length > MAX_SERIES) {
            console.log('Refusing to plot line graph with %s series', series.length)
            return new Error('Too many series detected');
          }

          var timeseries = series.map(function (name) {
            return {
              name: name,
              type: typeof record[name] == 'object' ? 'area' : 'line',
              values: data.filter(function (record) { return record[name] != null })
                .map(function (record) { return {name: name, date: record.date, val: isNaN(record[name]) ? record[name] : +record[name]} })
            };
          });

          var yMin = (this.yMin == null) ? d3.min(timeseries.filter(function(d){ return self.schema.y(d) == 'y'}), function (s) { return d3.min(s.values, function (v) { return isNaN(v.val) ? v.val.min : v.val ; })}) : this.yMin;
          var yMax = (this.yMax == null) ? d3.max(timeseries.filter(function(d){ return self.schema.y(d) == 'y'}), function (s) { return d3.max(s.values, function (v) { return isNaN(v.val) ? v.val.max : v.val; })}) : this.yMax;

          var y1Min = (this.yMin == null) ? d3.min(timeseries.filter(function(d){ return self.schema.y(d) == 'y1'}), function (s) { return d3.min(s.values, function (v) { return isNaN(v.val) ? v.val.min : v.val ; })}) : this.yMin;
          var y1Max = (this.yMax == null) ? d3.max(timeseries.filter(function(d){ return self.schema.y(d) == 'y1'}), function (s) { return d3.max(s.values, function (v) { return isNaN(v.val) ? v.val.max : v.val; })}) : this.yMax;

          if (component.yMaxPaddingPct != null) {
            yMax = (this.yMaxPaddingPct + 1) * (yMax - yMin);
          }

          if (component.yMaxSoft != null && yMax < component.yMaxSoft) {
            yMax = this.yMaxSoft;
          }

          component.x.domain([data[0].date, data[data.length - 1].date]);
          component.y.domain([yMin, yMax]);
          component.y1.domain([y1Min, y1Max]);

          component.series = scope.currentTimeline;
          component.timeseries = timeseries;

          component._draw();

          var anomalies = self.graph.append('g')
            .attr('class', 'anomalies')
            .selectAll('path').data(data.filter(function(d, i){ return !!d.__data.lm_a }))
          anomalies.enter().append('path')
            .on('mouseover', anomalyHover)
            .on('click', anomalyClick)
          anomalies
            .attr('fill', function(d){ return d.__data.lm_a == 1 ? 'red' : '#ff7518' })
            .attr('stroke', 'none')
            .attr('d', triangle)
          anomalies.exit().remove()

          // Triangles
          function triangle(d) {
            var x = self.x(d.date)
            var y = self.innerHeight
            var top = 'M ' + x + ' ' + (y + 3)
            var bottomLeft = 'L ' + (x - 5) + ' ' + (y + 13)
            var bottomRight = 'L ' + (x + 5) + ' ' + (y + 13)
            return top + ' ' + bottomLeft + ' ' + bottomRight + ' Z'
          }

          function anomalyHover(d) {
            self.hoverAt(d._t)
          }

          function anomalyClick(d) {
            self.emit('click', d.__data)
          }
        };

// Redraw the data with different options
// Or if not drawn yet, simply set options
        Line.prototype.redraw = function (options) {
          var self = this;
          // Apply type-specific defaults
          var type = options.type || this.type;
          switch (type) {
            case 'line':
              component.showXAxis = true;
              component.showYAxis = true;
              component.xGridTicks = 0;
              component.yGridTicks = 3;
              break;
            case 'miniline':
              component.showXAxis = false;
              component.showYAxis = true;
              component.xGridTicks = 0;
              component.yGridTicks = 0;
              component.yAxisTicks = 3;
              component.yTickSize = 0;
              component.margin = {top: 0, right: 0, bottom: 0, left: 35};
              component.interactive = false;
              component.legend = false;
              component.ratio = 7;
              component.bgfill = '#fff';
              component.yMaxPaddingPct = 0.1;
              break;
            case 'sparkline':
              component.showXAxis = false;
              component.showYAxis = false;
              component.xGridTicks = 0;
              component.yGridTicks = 0;
              component.yAxisTicks = 0;
              component.margin = {top: 0, right: 0, bottom: 0, left: 0};
              component.interactive = false;
              component.legend = false;
              component.ratio = 10;
              component.bgfill = '#fff';
              break;
            default:
              return new Error('Unknown chart type.');
          }
          // Simple options clobber. TBD: consider validity checks
          Object.keys(options).forEach(function (o) { self[o] = options[o] });
          if( component.color.moduleColor ) {
            component.color = component.color.moduleColor
          }

          if (component.ratio && !options.width) {
            component.height = Math.round(component.width / this.ratio);
          }

          this.yAxis = component._yAxis();

          if (component.legend) {
            // TBD maybe make this more dynamic
            // Force 20 pixel margin at the top for the legend
            component.margin.top = 20;
          }

          // Don't attempt to re-draw if it hasn't been drawn yet (or no data)
          if (!component.timeseries.length) return;
          component._draw();
        };

// New incoming data, transition in/transition out old
// Line.prototype.update = function (delta) {
//   // TODO...
// }
        Line.prototype.update = Line.prototype.draw;


        Line.prototype._draw = function () {
          var self = this;

          // TODO consider transitioning these out.
          component.graph.selectAll('.axis').remove();
          component.graph.selectAll('.grid').remove();
          component.graph.selectAll('.timeline').remove();
          component.graph.selectAll('#gradient').remove();
          component.graph.selectAll('.hover-line').remove();
          component.graph.selectAll('.select-line').remove();
          component.graph.selectAll('.overlay').remove();
          component.svg.selectAll('.x-legend').remove();
          component.svg.selectAll('.y-legend').remove();

          component.svg.selectAll('.underlay')
            .style('fill', component.bgfill);

          // Maybe add in some axes.
          if (component.showXAxis) {
            component.graph.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + component.innerHeight + ')')
              .call(component.xAxis);
          }

          if (component.showYAxis) {
            component.graph.append('g')
              .attr('class', 'y axis')
              .call(component.yAxis)
          }
          if (true /*this.showY1Axis*/) {
            component.graph.append('g')
              .attr('class', 'y1 axis')
              .attr('transform', 'translate(' + (component.innerWidth) + ', 0)')
              .call(component.y1Axis)
          }

          if (component.yGridTicks > 0) {
            component.graph.append('g')
              .attr('class', 'y grid')
              .call(component.yGrid);
          }

          if (component.xGridTicks > 0) {
            component.graph.append('g')
              .attr('class', 'x grid')
              .attr('transform', 'translate(0,' + component.innerHeight + ')')
              .call(component.xGrid);
          }

          if (component.legend) {
            var earliest = component.raw[0]._t;
            var last = component.raw[component.raw.length - 1]._t;
            // Avg number of milli gap per record. Can be off if data is unevenly spaced.
            var avgGap = (last - earliest) / component.raw.length;
            if (avgGap > ONE_WEEK_MS) {
              component.formatDate = d3.time.format('%b %Y');
            }
            else if (avgGap > ONE_HOUR_MS * 12) {
              component.formatDate = d3.time.format('%Y-%m-%d (%a)');
            }
            else if (avgGap > ONE_MIN_MS * 30) {
              component.formatDate = d3.time.format('%Y-%m-%d (%a) %H:%M');
            }
            else if (avgGap > 1000 * 30) {
              // Bigger than 30s on average
              component.formatDate = d3.time.format('%Y-%m-%d %H:%M:%S');
            }

            // TODO checks related to total svg width

            component.xLegend = component.svg.append('g')
              .attr('class', 'x-legend')
              .attr('transform', 'translate(8, 15)');

            component.xLegend.append('text')
              .attr('class', 'legend-text');

            var nextX = 0;
            component.svg.append('g')
              .attr('class', 'y-legend')
              .attr('transform', 'translate(8, 15)')
              .selectAll('g')
              .data(component.series)
              .enter()
              .append('text')
              .attr('class', 'legend-text')
              .text(function (d) {
                return d;
              })
              .attr('x', function (d, i) {
                var offset = nextX;
                nextX += (d.length + 1) * 8;
                return offset;
              })
              .style('fill', function (d) {
                return self.color(d)
              });
          }

          switch (component.type) {
            case 'line':
            case 'miniline':
            case 'sparkline':
              return component._line();
            default:
              return new Error('Unknown chart type.');
          }

        };

        Line.prototype._yAxis = function (type) {
          var axis = d3.svg.axis()
            .scale(component[type])
            .orient(type == 'y' ? 'left' : 'right');

          if (component.tickFormat) {
            axis.tickFormat(this.tickFormat);
          }
          else if (component.options.format && component.options.format[type] ) {
            axis.tickFormat(TracingFormat.format[component.options.format[type]])
          } else {
            axis.tickFormat(TracingFormat.mb);
          }

          if (component.yAxisTicks != null) {
            axis.ticks(component.yAxisTicks);
          }

          if (component.yAxisValues != null) {
            axis.tickValues(component.yAxisValues);
          }

          if (component.yTickSize != null) {
            axis.tickSize(component.yTickSize);
          }

          return axis;
        };

// Draw the loaded data as a line graph
        Line.prototype._line = function () {
          var self = this;
          var draw = Draw(self)
          self.graph.selectAll('.timeline')
            .data(self.timeseries)
            .enter().append('g')
            .attr('class', 'timeline')
            .call(draw)

          if (self.interactive) {
            // TODO enable interactivity hooks/listeners
            self.hoverLineGroup = self.graph.append('g')
              .attr('class', 'hover-line');

            self.hoverLine = self.hoverLineGroup.append('line')
              // TODO x1 to 0/0, or max/max?
              .attr('x1', self.innerWidth).attr('x2', self.innerWidth)
              .attr('y1', 0).attr('y2', self.innerHeight);

            self.selectLineGroup = self.graph.append('g')
              .attr('class', 'select-line')
              .attr('style', self.selectionX ? 'display: visible' : 'display: none')

            self.selectLine = self.selectLineGroup.append('line')
              // TODO x1 to 0/0, or max/max?
              .attr('x1', self.selectionX || self.innerWidth).attr('x2', self.selectionX || self.innerWidth)
              .attr('y1', 0).attr('y2', self.innerHeight);

            self.graph.append('rect')
              .attr('class', 'overlay')
              .attr('width', self.innerWidth)
              .attr('height', self.innerHeight)
              .on('mousemove', getHoverX)
              .on('click', handleClick)
          }
          function handleClick(){
            var coords = d3.mouse(component)
            var ts = self.x.invert(coords[0]).getTime()
            var rec = self.getRecordAt(ts)
            var x = self.x(rec.date) | 0;
            self.selectionX = x
            self.selectLine
              .attr('x1', x).attr('x2', x)
              .attr('style', 'display: visible')
            self.emit('click', rec.__data)
          }

          function getHoverX() {
            var coords = d3.mouse(component);
            var ts = self.x.invert(coords[0]).getTime();
            self.hoverAt(ts);
            self.emit('hover', ts);
          }
        };

        Line.prototype.clearSelection = function clearSelection(){
          delete component.selectionX
        };


        Line.prototype.getRecordAt = function getRecordAt(timestamp){
          var self = this;
          var record = self.raw.slice(-1)[0];
          if (timestamp < record._t) {
            var entry = _dateBisect(self.raw, timestamp, 1);
            var left = self.raw[entry - 1];
            var right = self.raw[entry];
            if (!left || !right) return right || left
            record = (timestamp - left._t > right._t - timestamp) ? right : left;
          }
          return record
        };

// TODO emit/listen for highlight events when other graphs are highlighting
        Line.prototype.hoverAt = function (timestamp) {
          var self = this;

          var record = self.getRecordAt(timestamp)

          var x = self.x(record.date) | 0;

          self.hoverLine
            .attr('x1', x)
            .attr('x2', x)
            .attr('stroke', function (d, i) { return record.__data.lm_a ? 'red' : 'black' })
            .attr('stroke-width', 1)

          var formattedDate = self.formatDate(record.date);

          var colors = [];
          var legendValues = self.series.slice(0).sort(function(a, b) {
            if (record[a] == null){
              return b
            }
            if (record[b] == null) {
              return a
            }
            return record[b] - record[a]
          }).map(function (key) {
            var value
            var f = self.schema.formatByKey(key)
            if( (record[key] !== undefined) && record[key] !== null) {
              if( typeof record[key] == 'object' ){
                value = [f(record[key].min), f(record[key].max)].join('/')
              } else {
                value = f(record[key])
              }
            } else {
              value = 'N/A'
            }
            colors.push(self.color(key))
            return key + ': ' + value
          });

          // TODO better handling when it runs off the end
          self.svg.selectAll('.y-legend')
            .attr('transform', 'translate(' + (formattedDate.length + 2) * 8 + ', 15)')
          var nextX = 0
          self.svg.selectAll('.y-legend > .legend-text')
            .text(function (d, i) {
              return legendValues[i]
            })
            .attr('x', function (d, i) {
              var offset = nextX;
              nextX += (legendValues[i].length + 1) * 8;
              return offset;
            })
            .style('fill', function (d, i) { return colors[i] })


          self.xLegend.select('text').text(formattedDate)
        };








        //timelineUpdate(scope.currentTimeline);
        scope.$watch('currentTimeline', function(newVal, oldVal) {
          if (newVal.hosts && newVal.hosts['Seans-MacBook-Air-2.local']) {

            var chart = Line(jQuery(el)[0], cpuGraphOptions);
            this.records = convertTimeseries(newVal.hosts['Seans-MacBook-Air-2.local'][9403]);

            chart.draw(this.records.cpu);

          }
        });


















      }
    }
  }
]);
Tracing.directive('slTracingMonitorView', [
  function() {
    return {
      templateUrl: '',
      link: function(scope, el, attrs) {
        var colormap = {
          'Process Heap Total': 'rgba(63,182,24, 1)',
          'Process Heap Used': 'rgba(255,117,24, 1)',
          'Process RSS': 'rgba(39,128,227, 1)',
          'Load Average': 'rgba(39,128,227, 1)',
          'Uptime': 'rgba(255,117,24, 1)'
        };


        function color(name){
          return colormap[name] || '#00000'
        };

        function Monitor(cpuel, memel, app) {
          if (!(this instanceof Monitor)) return new Monitor();
          this.cpuel = cpuel;
          this.memel = memel;
          this.app = app;
          this.memGraphOptions = {
            yMin: 0,
            color: color,
            formatter: mbFormat
          };

          this.cpuGraphOptions = {
            color: color,
            format: {
              'y': 'num',
              'y1': 's'
            },
            keySchema: {
              'Load Average': {
                class: 'cx-monitor-loadavg',
                type: 'line',
                y: 'y'
              },
              'Uptime': {
                class: 'cx-monitor-uptime',
                type: 'line',
                y: 'y1'
              }
            }
          };
          // this.memgraph = LineGraph(this.memel, this.memGraphOptions);
          this.cpugraph = LineGraph(this.cpuel, this.cpuGraphOptions);

          //handle timeline loads
          //this.memgraph.on('click', this.rewind.bind(this));
          this.cpugraph.on('click', this.rewind.bind(this));
          return this;
        }

        Monitor.prototype.render = function render(trace){
          if(this.records){
            $('#stats-history-wait').hide();
            $('#memory-history-cont').show();
            this.memgraph.draw(this.records.mem);
            this.cpugraph.draw(this.records.cpu);
          } else {
            $('#stats-history-wait').show();
            $('#memory-history-cont').hide();
          }
        };

        Monitor.prototype.timelineUpdate = function timelineUpdate(points){
          this.records = convertTimeseries(points);
          this.render()
        };

        Monitor.prototype.rewind = function rewind(e){
          page(path.join(history.state.basePath, history.state.project, 'trace', encodeURIComponent(e.pfkey)), { expanded: {} })
        };

        Monitor.prototype.clearSelection = function clearSelection(){
          this.memgraph.clearSelection()
          this.cpugraph.clearSelection()
        };

        function convertTimeseries(t){
          var ret = {};
          ret.mem = t.map(function(d){
            var item = {
              _t: m(d.ts).unix()*1000,
              'Process Heap Total': d.p_mt,
              'Process Heap Used': d.p_mu,
              'Process RSS': d.p_mr,
              __data: d
            };
            return item
          });
          ret.mem = ret.mem.sort(function(a,b){ return a._t - b._t;});

          ret.cpu = t.map(function(d){
            var item = {
              _t: m(d.ts).unix()*1000,
              'Load Average': d['s_la'],
              'Uptime': d['p_ut'],
              __data: d
            };
            return item;
          });
          ret.cpu = ret.cpu.sort(function(a,b){ return a._t - b._t;});
          return ret;
        }

        function mbFormat(val){
          return numeral(val).format('0.0 b');
        }
      }
    };
  }
]);
