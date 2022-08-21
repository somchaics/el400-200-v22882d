

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
            var chartHeight,
                chartWidth,
                xMax,
                yMax,
                maxYValue = 0;

            var ele = document.getElementById(this.$el.attr("id"));

            var can = document.createElement("canvas");
            can.width = this.config.width;
            can.height = this.config.height;
            ele.appendChild(can);
            var ctx = can.getContext("2d");
            ele.width = this.config.width + 50;

            var margin = this.config.margin;
            var data = this.config.data;

            chartHeight = can.height;
            chartWidth = can.width;
            xMax = chartWidth - (margin.left + margin.right);
            yMax = chartHeight - (margin.top + margin.bottom);

            ctx.fillStyle = "black"
            ctx.font = "14pt Helvetica"

            //Title
            var title = "Pie Chart";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.fillText(title, (chartWidth / 2), (margin.top / 2) + 6);

            var color; colors = [];
            var total = 0;
            var legendHTML = "";
            for (var i = 0; i < data.length; i++) {
                total += data[i].value;
                //color = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
                //colors[i] = color;
                legendHTML += "<div><span style='margin-left:-50px; display:inline-block;width:20px;background-color:" + data[i].color + ";'>&nbsp;</span> " + data[i].name + "</div>";
            }
            // var leg = document.getElementById("leg");
            $(legendHTML).appendTo('#id-leg');

            var slice_angle = 0;
            var start_angle = 0;

            var sizew = can.width - margin.left - 20;
            var sizeh = can.height - margin.top - 30;
            var radius = Math.min(sizew, sizeh) / 2;
            sizew += 140; sizeh += 80;
            var center = [sizew / 2, sizeh / 2];

            var start_angle = 0;

            for (var i = 0; i < data.length; i++) {
                var val = data[i].value;
                var slice_angle = 2 * Math.PI * val / total;

                ctx.beginPath();
                ctx.moveTo(center[0], center[1]); // center of the pie
                ctx.arc(  // draw next arc
                    center[0],
                    center[1],
                    radius,
                    start_angle,
                    start_angle + slice_angle,
                    false
                );

                ctx.lineTo(center[0], center[1]); // line back to the center
                ctx.closePath();
                ctx.fillStyle = data[i].color;    // color
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();



                //draw lable
                var pieRadius = Math.min(sizew / 2, sizeh / 2);
                var labelX = sizew / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
                var labelY = sizeh / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

                var labelText = Math.round(100 * val / total);
                ctx.fillStyle = "white";
                ctx.font = "bold 15px Arial";
                ctx.fillText(labelText + "%", labelX, labelY);

                start_angle += slice_angle;
            }
        }
    }
    

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

