let VueUtilsMixin = {
  methods: {
    arrayUnique(arr) {
      if (!Array.isArray(arr)) {
        throw new TypeError("array-unique expects an array");
      }

      let len = arr.length;
      let i = -1;

      while (i++ < len) {
        let j = i + 1;

        for (; j < arr.length; ++j) {
          if (arr[i] === arr[j]) {
            arr.splice(j--, 1);
          }
        }
      }
      return arr;
    },
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    highlightSearchTerms(str, terms) {
      if (!terms || terms.length < 1) {
        return VueUtilsMixin.methods.escapeHtml(str);
      }
      let strLower = str.toLowerCase();
      let ranges = [];
      let breakpoints = [];
      for (let term of terms) {
        let pos = strLower.indexOf(term);
        if (pos !== -1) {
          ranges.push([pos, pos + term.length - 1]);
          breakpoints.push(pos);
          breakpoints.push(pos + term.length);
        }
      }
      breakpoints.push(str.length);
      VueUtilsMixin.methods.arrayUnique(breakpoints);
      breakpoints.sort((a, b) => a - b);
      let ret = "";
      let currentlyHighlighting = false;
      let prevPos = 0;
      for (let i of breakpoints) {
        let highlight = false;
        for (let range of ranges) {
          if (prevPos >= range[0] && prevPos <= range[1]) {
            highlight = true;
            break;
          }
        }
        if (!currentlyHighlighting && highlight) {
          ret += '<span class="highlight-string">';
          currentlyHighlighting = true;
        } else if (currentlyHighlighting && !highlight) {
          ret += "</span>";
          currentlyHighlighting = false;
        }
        if (i > 0) {
          ret += VueUtilsMixin.methods.escapeHtml(str.substring(prevPos, i));
          prevPos = i;
        }
      }
      if (currentlyHighlighting) {
        ret += "</span>";
      }
      return ret;
    },
  },
};

export default VueUtilsMixin.methods.highlightSearchTerms;
