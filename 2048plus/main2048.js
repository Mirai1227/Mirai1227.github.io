var board = new Array();
var score = 0;
var hasConflicted = new Array();//用于记录每个小格子是否已经发生过一次碰撞。
//如：2 2 4 8 原先会直接变成16，现在可以变成 4 4 8

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

//整个程序加载完后用的主函数
$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02*gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);//设置每个小方格
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius', 0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();

}

function init(){
    for(var i = 0;i < 4;i ++)
        for (var j = 0; j < 4; j ++) {
            //获取小格子的ID
            var gridCell = $('#grid-cell-'+i+"-"+j);
            //传入坐标值
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
            
        }

    for(var i = 0 ; i < 4;i ++){
        board[i] = new Array();//此时board变成了一个二维数组
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j ++){

            board[i][j]=0;
            hasConflicted[i][j] = false;//每个小格子开始时都没有进行过碰撞
        }
    }

    updateBoardView();

    score = 0 ; 
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i < 4;i ++)
       for (var j = 0; j < 4; j ++) {
           $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
           var theNumberCell = $('#number-cell-'+i+'-'+j);

           if (board[i][j] == 0) {
               theNumberCell.css('width','0px');
               theNumberCell.css('height','0px');
               theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
               theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
           }
           else{
                //预设好的变量不用加引号''！！！！！
                // theNumberCell.css('width','cellSideLength');
                // theNumberCell.css('height','cellSideLength');
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
           }

           hasConflicted[i][j] = false;
       
        }

        $('.number-cell').css('line-height',cellSideLength+'px');
        $('.number-cell').css('font-size', 0.6*cellSideLength+'px');

}

//随机位置生成数字的函数
function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }else{

        //随机一个位置
        var randx=parseInt(Math.floor(Math.random() * 4));//随机产生0-4之间的浮点数→整数→强制取整型
        var randy=parseInt(Math.floor(Math.random() * 4));

        //这是一个死循环，非常慢，如果地图上只有一个空格，计算机要随机好久才能找到那个数放上去
        // while (true) {
        //     if (board[randx][randy] == 0){//该位置为0时可以添加数字
        //         break;            
        //     }else{//否则重新生成坐标
        //         var randx=parseInt(Math.floor(Math.random() * 4));
        //         var randy=parseInt(Math.floor(Math.random() * 4));

        //     }
        // }

        //优化后的随机数生成算法(只让计算机循环50次)
        var  times = 0;
        while (times < 50) {
            if ( board[randx][randy] == 0) {
                break;
            }
            randx = parseInt( Math.floor( Math.random() * 4 ));
            randy = parseInt( Math.floor( Math.random() * 4 ));

            times ++;
        }
        if ( times == 50) {
            for( var i = 0 ; i< 4 ; i ++)
            for(var j = 0; j < 4 ; j ++){
                if ( board[i][j] == 0) {
                    randx = i;
                    randy = y;
                }
            }
        }

        //随机一个数字
        var randNumber = Math.random() <0.5 ? 2 : 4;
        //在随机位置显示随机数字
        board[randx][randy]= randNumber;
        showNumberWithAnimation(randx , randy ,randNumber);
        return true;

    }

  }

//网页端键盘操作
$(document).keydown(function (event) {
    // event.preventDefault();放在此处，所有按键的默认效果(如键盘操作时滚动条跟着移动)都消失了
    switch (event.keyCode) {
        case 37://left
        //如果可以向左移动，就生成数字/判断游戏是否结束
        event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };            
            break;
        case 38://up
        event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };                
            break;
        case 39://right
        event.preventDefault();      
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };          
            break;
        case 40://down
        event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };               
            break;
        default:
            break;
    }
    
});

//手机端触控模式实现——获取两个坐标，实现两个事件
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;//想象一个坐标系，x在0+→，y在↓0+
    var deltay = endy - starty;

    //有时用户只是点了一下，并没有想进行滑动操作
    //用以下函数判断
    if ( Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth) {
        return;//不进行后续操作
    }

    //滑动在X方向进行（即左右滑动）
    if ( Math.abs(deltax) >= Math.abs(deltay)) {
        if ( deltax > 0 ) {
            //向右滑动
            if ( moveRight() ) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        } else {
            //向左滑动
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }else{

        if ( deltay > 0) {
            //向下滑动
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };   
        }else{
            //向上滑动
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }   
        }
    }
});

//如果手指滑动无响应，是遇到工程上的bug了！
document.addEventListener('touchmove',function(event){
     event.preventDefault();
});

function isgameover() {
    if ( nospace(board) && nomove(board)) {//棋盘上没有空间或者不能进行任何移动操作
        gameover();
    }
}

function gameover() {
    alert('Game Over!');
}

//左移的函数
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;        
    }
    for(var i = 0 ; i < 4 ; i++)
    for(var j = 1 ; j < 4 ; j ++){
        if (board[i][j] != 0) {
            for(var k = 0 ; k < j ;k ++){
                //左边有空格可以移过去且移过去的路上没有障碍物
                if (board[i][k] == 0 && noBlockHorizontal(i, k ,j , board)) {
                    //move
                    showMoveAnimation(i ,j ,i ,k);
                    board[i][k] = board[i][j];//ik本来没有元素，现在有了ij的元素
                    board[i][j] = 0;//代表ij移动过去了
                    continue;
                    
                }
                //左移路上的数字相等且移过去的路上没有障碍物
                else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k ,j ,board) && !hasConflicted[i][k]) {
                    //move
                    showMoveAnimation(i ,j ,i ,k);
                    //add
                    // board[i][k] += board[i][j];
                    board[i][k] *=2;
                    board[i][j] = 0;
                    //add score 两个数字相同的块合在一起产生加分
                    //分数为块的数字
                    score += board[i][k];
                    //score发生改变了，但还没有通知前台，加一个通知前台的函数
                    updateScore( score );

                    hasConflicted[i][k] = true ;//这个位置不能再碰撞了
                    continue;
                }
            }
            
        }

    }
    setTimeout("updateBoardView()",200);
    return true;
}

//右移的函数
function moveRight(){
    if (!canMoveRight(board)) {
        return false;
    } 
    for(var i = 0 ; i< 4; i++)
        for(var j =  2; j >= 0 ; j--){
            if (board[i][j]!= 0) {
                for(var k = 3 ; k >j ; k --){
                    if (board[i][k] == 0 && noBlockHorizontal(i,j,k,board)) {//i,j,k,board
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] *= 2;
                        board[i][j]=0;
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }

        }
    setTimeout("updateBoardView()",200);
    return true;
    
}

//上移的函数
function moveUp(){
    if (!canMoveUp(board)) {
        return false;        
    }
    for(var j = 0 ; j < 4 ; j ++)
        for(var i = 1; i < 4 ; i ++){
            if(board[i][j] != 0){
                for(var k = 0 ;k < i ; k ++){
                    if (board[k][j] == 0 && noBlockVertical(j,k,i,board)) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
        
}

//下移的函数
function moveDown(){
    if (!canMoveDown(board)) {
        return false;
    }
    for(var j = 0 ; j < 4 ; j ++)
        for(var i = 2 ; i >= 0  ; i --){
            if (board[i][j] != 0 ) {
                for(var k = 3 ; k > i ; k --){
                    if (board[k][j] == 0 && noBlockVertical(j,i,k,board)) {//j,i,k,board                        
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){                        
                        showMoveAnimation(i,j,k,j);
                        board[k][j] *= 2;
                        board[i][j] = 0 ; 
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
