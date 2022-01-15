import mixitup from 'mixitup';

const containerEl = document.querySelector('.collections');
const mixer = mixitup(containerEl, {
  callbacks: {
    onMixStart: function(state,futureState){
    }
  }
});