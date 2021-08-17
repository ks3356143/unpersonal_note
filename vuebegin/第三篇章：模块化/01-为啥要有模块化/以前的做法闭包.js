var module1 = (function(){
    var obj = {}
    var name="小明";
    var age=18;
    
    function sum(num1,num2){
        return num1+num2;
    }

    var flag = true

    if(flag===true){
        console("flag is true")
    }

    obj.flag = flag;
    obj.sum =sum;

    return obj;
})()

