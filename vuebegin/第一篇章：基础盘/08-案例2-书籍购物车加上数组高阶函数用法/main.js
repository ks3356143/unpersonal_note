const app = new Vue({
    el:"#app",
    data:{
        books:[
            {
                id:1,
                name:'《算法导论》',
                date:'2006-9',
                price:85.00,
                count:1
            },
            {
                id:2,
                name:'《UNIX编程艺术》',
                date:'2006-2',
                price:117.00,
                count:1
            },
            {
                id:3,
                name:'《I love》',
                date:'2016-5',
                price:23.00,
                count:1
            },
            {
                id:4,
                name:'《看板算法》',
                date:'2012-3',
                price:43.00,
                count:1
            },
            {
                id:5,
                name:'《无敌多么寂寞》',
                date:'2021-9',
                price:111.00,
                count:1
            },
        ]

    },
    methods:{
        getFinalPrice(price){
            return '¥' + price.toFixed(2)
        },
        increment(index){
            this.books[index].count ++
        },
        decrement(index){
            this.books[index].count --
        },
        removeHandle(index){
            this.books.splice(index,1)
        }
    },
    filters:{//过滤器一般为函数
        showprice(price){
            return '¥' + price.toFixed(2);
        }
    },
    computed:{
        totalPrice(){//计算属性需要return
            // let totalPrice = 0;
            // for(let i = 0 ; i < this.books.length; i++){
            //     totalPrice += this.books[i].price * this.books[i].count;
            // }
            // return totalPrice
            //另外循环
            //for(let i in/of this.books)
            //reduce
            let totalp = 0
            for(let i of this.books){
                totalp += i.price * i.count
            }
            return totalp
        }
    },
})

//高阶函数filter，主要针对数组
const nums = [100,52,98,444,111,202,149]

let newnums = nums.filter(function(n){
    return n<=100
})

console.log(newnums)

let new2 = nums.map(function(n){
    return 100
})

console.log(new2)