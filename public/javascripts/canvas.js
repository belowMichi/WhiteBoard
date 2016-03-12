/**
 * Created by Administrator on 2016/1/23.
 */


var PositionArr = [];
var tempArr = [];
var cancelArr = [];
var changeto = function (type) {
    token = type;

};
var clearAll = function () {
    clearContext(ctx);
}

//set up the canvas and context
var canvas = document.getElementById("myCanvas");
var jq_canvas = $("#myCanvas");
var ctx = canvas.getContext("2d");
var canvas_tmp = document.getElementById("myCanvas_tmp");
var jq_canvas_tmp = $("#myCanvas_tmp");
var ctx_tmp = canvas_tmp.getContext("2d");
var begin, end;
var size = 5;
var isDrawing = false;
var token = 2;
var color = 'rgba(0,0,255,0.2)';
var speed_rw = 50;
var rewrite = function () {
    var point = 0;
    ctx.beginPath();
    ctx_tmp.beginPath();
    setInterval(function () {
        if (PositionArr[point] == "next") {
            clearContext(ctx_tmp);
            ctx.stroke();
            ctx.beginPath();
            ctx_tmp.beginPath();
            point++;
        }
        else if (point < PositionArr.length) {

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = size;
            ctx.strokeStyle = color;

            ctx_tmp.lineCap = "round";
            ctx_tmp.lineJoin = "round";
            ctx_tmp.lineWidth = size;
            ctx_tmp.strokeStyle = color;

//                clearContext(ctx_tmp);
            ctx_tmp.beginPath();
            ctx_tmp.moveTo(PositionArr[point].x, PositionArr[point].y);
            ctx_tmp.lineTo(PositionArr[point + 1].x, PositionArr[point + 1].y);
//                ctx.lineTo(PositionArr[point].x, PositionArr[point].y);
            ctx_tmp.closePath();
            ctx_tmp.stroke();

            point++;

        }
    }, speed_rw);
};


var mm = function (evt) {

    if (token == "line") {
        if (isDrawing) {
            var now = getMousePos(canvas, evt);
            ctx_tmp.beginPath();
            clearContext(ctx_tmp);
            ctx_tmp.moveTo(begin.x, begin.y);
            ctx_tmp.lineTo(now.x, now.y);
            ctx_tmp.stroke();
        }
    }
    if (token == "pencil") {
        ctx_tmp.lineCap = "round";
        ctx_tmp.lineJoin = "round";
        ctx_tmp.lineWidth = size;
        ctx_tmp.strokeStyle = color;

        if (isDrawing) {


            clearContext(ctx_tmp);
            end = getMousePos(canvas, evt);
            PositionArr.push(end);
            tempArr.push(end);

            ctx_tmp.lineTo(end.x, end.y);

            ctx_tmp.stroke();

            end.roomId=group;
            socket.emit('pencilMm', end);

        }
    }
    if (token == "brush") {
        ctx_tmp.lineWidth = size;
        if (isDrawing) {
            clearContext(ctx_tmp);
            end = getMousePos(canvas, evt);
            PositionArr.push(end);

            ctx_tmp.lineTo(end.x, end.y);
            ctx_tmp.strokeStyle = color;
            ctx_tmp.stroke();
        }
        else {
            clearContext(ctx_tmp);
            ctx_tmp.beginPath();
            end = getMousePos(canvas, evt);
            ctx_tmp.strokeStyle = color;
            ctx_tmp.fillStyle = color;
            ctx_tmp.arc(end.x, end.y, size / 2, 0, 2 * Math.PI, false);
            // ctx_tmp.stroke();
            ctx_tmp.fill();
            ctx_tmp.beginPath();
            ctx_tmp.restore();
        }

    }
    // if (token == "喷枪") {
    //     if (isDrawing) {
    //     	// ctx_tmp.save();
    //     	ctx_tmp.beginPath();
    //         end = getMousePos(canvas, evt);

    //         ctx_tmp.strokeStyle=color;
    //         ctx_tmp.fillStyle=color;
    //         ctx_tmp.arc(end.x,end.y,size,0,2*Math.PI,false);

    //        ctx_tmp.fill();

    //         ctx_tmp.restore();
    //     }

    // }
};
var md = function (evt) {
    isDrawing = true;
//        ctx_tmp.lineWidth = size;
    // ctx.beginPath();
    // ctx_tmp.beginPath();

    if (token == "line") {
        ctx.beginPath();
        ctx_tmp.beginPath();
        begin = getMousePos(canvas, evt);


    }
    if (token == "pencil") {
        ctx.beginPath();
        ctx_tmp.beginPath();

        socket.emit('pencilMd', {
            lineCap: "round",
            lineJoin: "round",
            lineWidth: size,
            strokeStyle: color,
            roomId:group
        });

    }
    if (token == "brush") {
        console.log(123);

    }
};

var mu = function (evt) {
    if (token == "line") {
        // canvas.removeEventListener("mousedown",md_line,false);
        isDrawing = false;
        ctx.beginPath();
        clearContext(ctx_tmp);
        var end = getMousePos(canvas, evt);
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    if (token == "pencil") {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        isDrawing = false;
        PositionArr.push("next");
        clearContext(ctx_tmp);
        ctx.beginPath();
        for (var i in tempArr) {
            ctx.lineTo(tempArr[i].x, tempArr[i].y);

        }
        ctx.stroke();
        tempArr.length = 0;
var end={};
        end.roomId=group;
        socket.emit('pencilMu', end);
    }

    if (token == "brush") {
        isDrawing = false;
        clearContext(ctx_tmp);
        for (var point in PositionArr) {
            ctx.lineTo(PositionArr[point].x, PositionArr[point].y);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;

            ctx.arc(PositionArr[point].x, PositionArr[point].y, size / 2, 0, 2 * Math.PI, false);

            ctx.fill();

        }
    }
};
var main = function () {
    jq_canvas_tmp.bind("mousemove", mm);
    jq_canvas_tmp.bind("mousedown", md);
    jq_canvas_tmp.bind("mouseup", mu);
};//main end


//Get Mouse Position
var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left - (rect.width - canvas.width) / 2,
        y: evt.clientY - rect.top - (rect.height - canvas.height) / 2
    }
};

var clearContext = function (ctx) {
    // console.log(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


};
//  http://www.cnblogs.com/zhwl/p/3530088.html
// function redraw(){
//   canvas.width = canvas.width; // Clears the canvas

//   context.strokeStyle = "#df4b26";
//   context.lineJoin = "round";
//   context.lineWidth = 5;

//   for(var i=0; i < clickX.length; i++)
//   {
//     context.beginPath();
//     if(clickDrag[i] && i){//当是拖动而且i!=0时，从上一个点开始画线。
//       context.moveTo(clickX[i-1], clickY[i-1]);
//      }else{
//        context.moveTo(clickX[i]-1, clickY[i]);
//      }
//      context.lineTo(clickX[i], clickY[i]);
//      context.closePath();
//      context.stroke();
//   }
// }

main();


