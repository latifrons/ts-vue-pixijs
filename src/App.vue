<template>
    <div id="app">
        <div>This is the text.</div>
        <!--        <kc-graph @xx="setX" id="toplayer" style="width: 300px; height: 200px;" :myx="this.x+30" :interactive="true"></kc-graph>-->
        <!--        <div style="height: 20px"></div>-->
<!--        <kc-graph ref="graph" v-bind:style="wh"></kc-graph>-->
<!--        <scrollpanetest style="width: 1500px; height: 400px"></scrollpanetest>-->
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component"
    import {Prop} from "vue-property-decorator"
    import Vue from 'vue';

    @Component
    export default class App extends Vue{
        get wh(): string{
            let w, h : number;
            if (this.$route.query["w"]){
                w = parseInt(this.$route.query["w"] as string);
            }else{
                w = 1340;
            }
            if (this.$route.query["h"]){
                h = parseInt(this.$route.query["h"] as string);
            }else{
                h = 640;
            }
            return `height: ${h}px; width: ${w}px;`;
        }
        // mounted(){
        //     console.log();
        //     let elem: HTMLElement= this.$refs["graph"] as HTMLElement;
        //     elem.setAttribute("style", "height: 300px; width: " + this.getW()+ "px")
        // }
    }
</script>

<style>
    #app {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
</style>
