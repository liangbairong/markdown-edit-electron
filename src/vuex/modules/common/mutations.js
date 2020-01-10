
export default {


  setGitChangeList: (state, list=[]) => {
    state.gitChangeList = list;
  },

  setProjectPath: (state, projectPath) => {
    window.localStorage.setItem('projectPath',projectPath)
    state.projectPath = projectPath;
  },

  setGitLoading: (state, gitLoading) => {
    state.gitLoading = gitLoading;
  },

};