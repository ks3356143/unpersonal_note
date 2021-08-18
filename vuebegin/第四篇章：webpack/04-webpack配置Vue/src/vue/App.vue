<template>
    <div>
        <h2>{{message}}</h2>
        <button @click="btnclick">点击按钮</button>
        <h2>{{name}}</h2>
    </div>
</template>

<script>
export default {
    name:"App",
    data(){
    return {
        message:"我不好！",
        name:"very ok"
        }
    },
    methods:{
        btnclick(){
            alert("不会正确使用？")
        }
    },
}
</script>

<style>
    .title {
        color:greenyellow;
        color:green;
    }
    .h2 {
        color: hotpink;
    }
</style>