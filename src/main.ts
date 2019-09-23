import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

// Vue.component('kc-graph', require('./components/KcGraph.vue').default);
// Vue.component('scrollpanetest', require('./components/ScrollPaneTest').default);


new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
