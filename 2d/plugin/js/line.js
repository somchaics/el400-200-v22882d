

(function (window, $) {
    var Chart = function (el, options) {
        this.el = el; //id
        this.$el = $(el); //attr;
        this.options = options;
    };

    Chart.prototype = {
        //default variable
        defaults: {
            width: 600,
            height: 400,
        },

        init: function () {
            this.config = $.extend({
                // eventname: 'customEvent'
            }, this.defaults, this.options);
          
            this.int_chart();
            return this;
        },

        int_chart: function () {
            var  minVal, maxVal,
                xscale, yscale,
                categoies, y;

            var ele = document.getElementById(this.$el.attr("id"));

            var can = document.createElement("canvas");
            can.width = this.config.width;
            can.height = this.config.height;
            ele.appendChild(can);
            var ctx = can.getContext("2d");
           
            var margin = this.config.margin;
            var data = this.config.data;

            categoies = data.length;
            maxVal = 100;
            minVal = -30;
            var stepSize = 10;
            var title = 50; //row height
            var value_axis = 50; //width 

            var catagory_axis = data.category;
            categoies = catagory_axis.length;

            ctx.fillStyle = "black"
            ctx.font = "14pt Helvetica"
            // set vertical scalar to available height / data points
            can_height = can.height - margin.bottom;
            can_width = can.width - margin.right;

            yscale = (can_height - title) / (maxVal - minVal);
            // set horizontal scalar to available width / number of samples
            xscale = (can_width - value_axis) / categoies;

            //   ctx.strokeStyle = "rgba(128, 128, 255, 0.5)"; // light blue lines
            ctx.beginPath();
            // print  column catagory_axis and draw vertical grid lines
            var xc = (can_width / 2) - value_axis;
            ctx.moveTo(xc, 0);
            ctx.save();
            //  ctx.setTransform(1, 0, 0.2, 1, 0, 0);
            ctx.font = 'bold 24px Arial';
            ctx.fillText("Line Chart", xc, title / 2);
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.restore();

            // draw vertical grid lines
            for (i = 0; i <= categoies; i++) {
                ctx.beginPath();
                ctx.strokeStyle = "#e9e9e9";
                var x = i * xscale + value_axis;
                ctx.moveTo(x, title);
                ctx.lineTo(x, can_height);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = "#a2e0a2";
                ctx.moveTo(x + xscale / 2, title);
                ctx.lineTo(x + xscale / 2, can_height);
                ctx.stroke();
            }

            // print row catagory_axis and draw horizontal grid lines
            var start_y = 0;
            var count = 0;
            for (scale = maxVal; scale >= minVal; scale -= stepSize) {
                ctx.beginPath();
                var y = title + (yscale * count * stepSize);
                ctx.fillText(scale, 0, y + 5);

                if (scale == 0) {
                    ctx.strokeStyle = "#000000";
                    start_y = title + (yscale * count * stepSize);
                }
                else {
                    ctx.strokeStyle = "#e6e8e6";
                }
                ctx.moveTo(value_axis, y)
                ctx.lineTo(can_width, y)
                ctx.stroke();
                count++;
            }

            // footer
            var l = can_height + 20; //20 spacing
            for (i = 0; i < categoies; i++) {
                var x = i * xscale + value_axis + 10; //10 : spacing
                ctx.moveTo(x, l);
                ctx.fillText(catagory_axis[i], x, l);
            }
            ctx.stroke();

            //draw point to connect 
            ctx.translate(value_axis, start_y);

            ctx.beginPath();
            ctx.strokeStyle = 'orange';
            var x1 = 0;
            var vdata = data.value[0] * yscale * -1;
            ctx.moveTo(xscale / 2, vdata);
            for (i = 0; i < categoies - 1; i++) {
                vdata = data.value[i + 1] * yscale * -1;
                x1 = (i + 1) * xscale;
                ctx.lineTo(x1 + xscale / 2, vdata);
            }

            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = '#ebb842';
            for (i = 0; i < categoies; i++) {
                var vdata = data.value[i] * yscale * -1;
                var x = i * xscale;
                ctx.beginPath();
                ctx.arc(x + xscale / 2, vdata, 4, 0, 2 * Math.PI);  // Start point
                ctx.fill();
            }

        },

    };

    $.fn.Chart = function (option) {
        var arg = arguments,
            options = typeof option == 'object' && option;

        return this.each(function () {
            var $this = $(this),
                data = $this.data('chart');
          
            if (!data) $this.data('chart', (data = new Chart(this, options)).init());
            if (typeof option === 'string') {
                if (arg.length > 1) {
                    var a = Array.prototype.slice.call(arg, 1);
                    data[option](a);
                } else {
                    data[option]();
                }
            }

        });
    };

    window.Chart = Chart;

}) (window, jQuery);

