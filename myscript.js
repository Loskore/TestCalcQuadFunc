//myscript.js

(function() {
    var app = angular.module('myTestApp', []);
    app.controller('myRoots', function($scope) {
        $scope.resulttext = "";
        $scope.root_x1 = "";
        $scope.root_x2 = "";
        $scope.errormsg = false;
        $scope.calcQuadF = function() {
            //clear div element
            clearDIV("div_errormsg");
            var a, b, c = 0;
            var condcount = 0;
            $scope.showgraph = false;
            $scope.exists_root_x1 = false;
            $scope.exists_root_x2 = false;
            if (checkvalid($scope.coef_a) && checkvalid($scope.coef_b) && checkvalid($scope.coef_c)) {
                //check a
                a = parseInt($scope.coef_a);
                if (!isNaN(a) && Number.isInteger(a) && a !== 0) {
                    $scope.coef_a = a;
                    condcount = 1;
                } else {
                    $scope.resulttext = "";
                    $scope.errormsg = true;
                    createBootstrapClosingAlert("Некорректный коэффициент a ! Введите целое число!");
                    return;
                }
                //check b
                b = parseInt($scope.coef_b);
                if (condcount == 1 && !isNaN(b) && Number.isInteger(b)) {
                    $scope.coef_b = b;
                    condcount = 2;
                } else {
                    $scope.resulttext = "";
                    $scope.errormsg = true;
                    createBootstrapClosingAlert("Некорректный коэффициент b ! Введите целое число!");
                    return;
                }
                //check c
                c = parseInt($scope.coef_c);
                if (condcount == 2 && !isNaN(c) && Number.isInteger(c)) {
                    $scope.coef_c = c;
                    condcount = 3;
                } else {
                    $scope.resulttext = "";
                    $scope.errormsg = true;
                    createBootstrapClosingAlert("Некорректный коэффициент c ! Введите целое число!");
                    return;
                }
                //Try calc!
                if (condcount == 3) {
                    //Считаем дескриминант  
                    $scope.resulttext = get_froots(a, b, c).msg;
                    $scope.root_x1 = get_froots(a, b, c).x1;
                    $scope.root_x2 = get_froots(a, b, c).x2;
                    if (get_froots(a, b, c).x1 !== null) $scope.exists_root_x1 = true;
                    if (get_froots(a, b, c).x2 !== null) $scope.exists_root_x2 = true;
                    $scope.errormsg = false;
                    //Отрисовать функцию
                    if (get_froots(a, b, c).x1 !== null) {
                        $scope.showgraph = true;
                        Draw({
                            a: a,
                            b: b,
                            c: c
                        });
                    }
                }
            } else {
                $scope.resulttext = "";
                $scope.errormsg = true;
                createBootstrapClosingAlert("Введите корректные коэффициенты квадратичной функции!");
                return;
            }
        }
    });
    //end

    function get_froots(a, b, c) {
        var result = {
            msg: "",
            x1: null,
            x2: null
        };
        var d = 0.0;
        d = parseFloat((b * b) - (4 * a * c));
        if (d > 0) {
            var x1, x2 = 0;
            x1 = parseFloat((-b + Math.sqrt(d)) / (2 * a));
            x2 = parseFloat((-b - Math.sqrt(d)) / (2 * a));
            result.msg = "Два действительных корня: ";
            result.x1 = ((x1 > x2) ? x2 : x1);
            result.x2 = ((x1 > x2) ? x1 : x2);
        } else
        if (d == 0) {
            x1 = parseFloat(-b / (2 * a));
            result.msg = "Один действительный корень: ";
            result.x1 = ((x1 > x2) ? x2 : x1);
            result.x2 = null;
        } else {
            result.msg = "Нет действительных корней!";
            result.x1 = null;
            result.x2 = null;
        }

        return result;
    }

    function clearDIV(DOMid) {
        var element = document.getElementById(DOMid);
        if (element == null && element == undefined) return;
        if (element.childElementCount > 0)
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
    }

    function checkvalid(value) {
        return (value !== undefined && value !== null)
    }

    function createBootstrapClosingAlert(textmsg) {
        //DIV
        var div_errormsg = document.getElementById("div_errormsg");
        var div_alert_errormsg = document.createElement("div");
        div_alert_errormsg.className = "text-center alert alert-danger alert-dismissible";
        div_alert_errormsg.setAttribute("role", "alert");
        //btn -> x
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.className = "close";
        button.dataset.dismiss = "alert";
        button.setAttribute("aria-label", "Close");
        //text
        var span = document.createElement("span");
        span.setAttribute("aria-hidden", true);
        span.appendChild(document.createTextNode("x"));

        button.appendChild(span);
        div_alert_errormsg.appendChild(button);
        div_alert_errormsg.appendChild(document.createTextNode(textmsg));
        div_errormsg.appendChild(div_alert_errormsg);
    }


    //DRAW CANVAS
    function showAxes(ctx, axes) {
        var x0 = axes.x0,
            w = ctx.canvas.width;
        var y0 = axes.y0,
            h = ctx.canvas.height;
        var xmin = axes.doNegativeX ? 0 : x0;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(128,128,128)";
        ctx.moveTo(xmin, y0);
        ctx.lineTo(w, y0); // X axis
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, h); // Y axis
        ctx.stroke();
    }

    function funGraph(coefs, ctx, axes, color, thick) {
        var xx, yy, dx = 4,
            x0 = axes.x0,
            y0 = axes.y0,
            scale = axes.scale;
        var iMax = Math.round((ctx.canvas.width - x0) / dx);
        var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
        ctx.beginPath();
        ctx.lineWidth = thick;
        ctx.strokeStyle = color;

        for (var i = iMin; i <= iMax; i++) {
            xx = dx * i;
            yy = scale * calcYpoints(coefs, parseFloat(xx / scale));
            if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
            else {
                ctx.lineTo(x0 + xx, y0 - yy);
            }
        }
        ctx.stroke();
    }

    function Draw(coefs) {
        var canvas = document.getElementById("canvas");
        if (null == canvas || !canvas.getContext) return;

        var axes = {},
            ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear!
        axes.x0 = .5 + .5 * canvas.width; // x0 pixels from left to x=0
        axes.y0 = .5 + .5 * canvas.height; // y0 pixels from top to y=0
        axes.scale = 40; // 40 pixels from x=0 to x=1
        axes.doNegativeX = true;

        showAxes(ctx, axes);
        funGraph(coefs, ctx, axes, "rgb(66,44,255)", 2);
    };

    function calcYpoints(coefs, x) {
        return parseFloat(Math.round(coefs.a * x * x + coefs.b * x + coefs.c));
    }
}());