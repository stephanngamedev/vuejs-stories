var api_url = 'http://localhost:3000/';

Vue.component('story', {
  template: '#template-story-raw',
  props: ['story'],
  methods: {
    storeStory: function (story) {
      this.$http.post(api_url + 'stories', { story: story }).then(function (response) {
        story.editing = false;
        Vue.set(story, 'id', response.data.id)
      });
    },

    upvoteStory: function (story) {
      story.upvotes++;

      this.$http.patch(
        api_url + 'stories/' + story.id,
        { story: { upvotes: story.upvotes } }
      );
    },

    editStory: function (story) {
      story.editing = true;
    },

    updateStory: function (story) {
      this.$http.patch(
        api_url + 'stories/' + story.id,
        { story: story }
      )
      story.editing = false;
    },

    deleteStory: function (story) {
      var index = vm.stories.indexOf(story);
      vm.stories.splice(index, 1);
      this.$http.delete(api_url + 'stories/' + story.id);
    }
  }
});

var vm = new Vue({
  el: '#app',
  data: {
    stories: [],
  },
  methods: {
    createStory: function () {
      var newStory = {
        plot: '',
        upvotes: 0,
        editing: true
      };
      this.stories.push(newStory);
    },

    fetchStories: function () {
      this.$http.get(api_url + 'stories').then(function (response) {
        var storiesReady = response.data.map(function (story) {
          story.editing = false;
          return story
        });
        Vue.set(vm, 'stories', storiesReady);
      });
    }
  },
  mounted: function () {
    this.fetchStories();
  }
});
