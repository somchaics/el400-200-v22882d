

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
            margin :10
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
           
            var pading = this.config.pading.top;
            var margin = this.config.margin;
            var data = this.config.data;

            var catagory_axis = data.category;
            categoies = catagory_axis.length;

            maxVal = 12000;
            var stepSize = 1000;
            var value_axis = 50+pading;
            var ratio_heigh = 60;
            var value_ratio = data.ratio;

            ctx.fillStyle = "black"
            yscale = (can.height - value_axis - margin) / (maxVal);
            xscale = (can.width - ratio_heigh) / (categoies + 1);
            ctx.strokeStyle = "rgba(128,128,255, 0.5)"; // light blue line
            ctx.beginPath();

           // print title
            ctx.font = "20pt Arival";
            ctx.fillText(data.title, can.width / 2, pading+20);
            ctx.beginPath();
           
            // print  column value_ratio
            ctx.font = "14pt Helvetica";
            ctx.fillText(value_ratio, 0, value_axis - margin);
            // print row value_ratio and draw horizontal grid lines
            ctx.font = "12pt Helvetica";


            //draw scale
            var count = 0;
            for (scale = maxVal; scale >= 0; scale -= stepSize) {
                y = value_axis + (yscale * count * stepSize);
                ctx.fillText(scale, margin, y + margin);
                ctx.moveTo(ratio_heigh, y)
                ctx.lineTo(can.width, y)
                count++;
            }
            ctx.stroke();

            //lable category
            ctx.beginPath();
            ctx.font = "14pt Helvetica";
            ctx.textBaseline = "bottom";
          
            for (i = 0; i < categoies; i++) {
                y = can.height - data.value[i] * yscale;
                ctx.fillText(catagory_axis[i], xscale * (i + 1), y - margin);
            }

            // set a color and a shadow
            ctx.fillStyle = "green";
            ctx.shadowColor = 'rgba(128,128,128, 0.5)';
            ctx.shadowOffsetX = 20;
            ctx.shadowOffsetY = 1;
            //// translate to bottom of graph and scale x,y to match data
            ctx.translate(0, can.height - margin);
            ctx.scale(xscale, -1 * yscale);

            // draw bars
            for (i = 0; i < categoies; i++) {
                ctx.fillRect(i + 1, 0, 0.5, data.value[i]);
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

