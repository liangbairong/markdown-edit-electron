import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState("common", {
      gitChangeList: state => state.gitChangeList,
      projectPath: state => state.projectPath,
      gitLoading: state => state.gitLoading,
    })
  },
  methods: {
    ...mapActions("common", ["getGitChangeList"]),
    ...mapMutations("common", ["setProjectPath", "setGitLoading"]),
  },
};
