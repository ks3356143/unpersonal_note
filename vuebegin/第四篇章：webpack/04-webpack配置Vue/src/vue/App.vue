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
        message:"我哈哈哈好！",
        name:"very ok"
        }
    },
    methods:{
        btnclick(){
            alert("devserver正常使用？")
        }
    },
}
</script>

<style>
    body{
        background: hotpink;
    }
</style>