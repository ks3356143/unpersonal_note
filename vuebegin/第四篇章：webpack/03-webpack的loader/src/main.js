console.log("aaa");
console.log("bbb");

import {add,mul} from './js/mathutils'

console.log(add(50,50));
console.log(mul(100,100));

import {name,age,height} from './js/info'

console.log(name,age,height);//模块化方式

//3.以来css文件
require('./css/normal.css')