Object.defineProperty(exports, '__esModule', {
  value: true
});
/** @babel */

exports['default'] = {
  HtmlTemplete: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [],
    files: ['*.html'],
    dependencies: ['JavaScript', 'CoffeeScript', 'TypeScript', 'PHP']
  },

  JavaScriptTemplete: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [],
    files: ['*.jsx', '*.vue', '*.jade'],
    dependencies: ['JavaScript', 'CoffeeScript', 'TypeScript']
  },

  JavaScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)class\s+{word}(\s|$)/, /(^|\s){word}\s*\([^(]*?\)\s*\{/],
    files: ['*.js'],
    dependencies: ['CoffeeScript', 'TypeScript']
  },

  CoffeeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/],
    files: ['*.coffee'],
    dependencies: ['JavaScript', 'TypeScript']
  },

  TypeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)interface\s+{word}(\s|$)/, /(^|\s)class\s+{word}(\s|$)/, /(^|\s){word}\([^(]*?\)\s*\{/, /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/],
    files: ['*.ts'],
    dependencies: ['JavaScript', 'CoffeeScript']
  },

  Python: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}\s*\(/, /(^|\s)def\s+{word}\s*\(/],
    files: ['*.py']
  },

  PHP: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)trait\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/, /(^|\s)const\s+{word}(\s|=|;|$)/],
    files: ['*.php', '*.php3', '*.phtml']
  },

  ASP: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)(function|sub)\s+{word}\s*\(/],
    files: ['*.asp']
  },

  Hack: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/],
    files: ['*.hh']
  },

  Ruby: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s)module\s+{word}(\s|$)/, /(^|\s)def\s+(?:self\.)?{word}\s*\(?/, /(^|\s)scope\s+:{word}\s*\(?/, /(^|\s)attr_accessor\s+:{word}(\s|$)/, /(^|\s)attr_reader\s+:{word}(\s|$)/, /(^|\s)attr_writer\s+:{word}(\s|$)/, /(^|\s)define_method\s+:?{word}\s*\(?/],
    files: ['*.rb', '*.ru', '*.haml', '*.erb', '*.rake']
  },

  Puppet: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/],
    files: ['*.pp']
  },

  KRL: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)DEF\s+{word}\s*\(/, /(^|\s)DECL\s+\w*?{word}\s*=?/, /(^|\s)(SIGNAL|INT|BOOL|REAL|STRUC|CHAR|ENUM|EXT|\s)\s*\w*{word}.*/],
    files: ['*.src', '*.dat']
  },

  Perl: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)sub\s+{word}\s*\{/, /(^|\s)package\s+(\w+::)*{word}\s*;/],
    files: ['*.pm', '*.pl']
  },

  'C/C++': {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|:)/, /(^|\s)struct\s+{word}(\s|\{|$)/, /(^|\s)enum\s+{word}(\s|\{|$)/, /(^|\s)#define\s+{word}(\s|\(|$)/, /(^|\s)filesdef\s.*(\s|\*|\(){word}(\s|;|\)|$)/, /(^|\s|\*|:|&){word}\s*\(.*\)(\s*|\s*const\s*)(\{|$)/],
    files: ['*.c', '*.cc', '*.cpp', '*.cxx', '*.h', '*.hh', '*.hpp', '*.inc']
  },

  Java: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|:)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)enum\s+{word}(\s|\{|$)/, /(^|\s){word}\s*\(.*\)(\s*)(\{|$)/],
    files: ['*.java']
  },

  Shell: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s){word}\s*\(\)\s*\{/],
    files: ['*.sh']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBRWU7QUFDYixjQUFZLEVBQUU7QUFDWixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ2pCLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUM7R0FDbEU7O0FBRUQsb0JBQWtCLEVBQUU7QUFDbEIsUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixXQUFPLEVBQUUsRUFBRTtBQUNYLFNBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO0FBQ25DLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQztHQUMzRDs7QUFFRCxZQUFVLEVBQUU7QUFDVixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxDQUNQLHdDQUF3QyxFQUN4Qyw4QkFBOEIsRUFDOUIsNEJBQTRCLEVBQzVCLGdDQUFnQyxDQUNqQztBQUNELFNBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNmLGdCQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDO0dBQzdDOztBQUVELGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLEVBQzVCLGtEQUFrRCxDQUNuRDtBQUNELFNBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQztBQUNuQixnQkFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztHQUMzQzs7QUFFRCxZQUFVLEVBQUU7QUFDVixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxDQUNQLHdDQUF3QyxFQUN4Qyw4QkFBOEIsRUFDOUIsZ0NBQWdDLEVBQ2hDLDRC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L2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEh0bWxUZW1wbGV0ZToge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW10sXG4gICAgZmlsZXM6IFsnKi5odG1sJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnQ29mZmVlU2NyaXB0JywgJ1R5cGVTY3JpcHQnLCAnUEhQJ10sXG4gIH0sXG5cbiAgSmF2YVNjcmlwdFRlbXBsZXRlOiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXSxcbiAgICBmaWxlczogWycqLmpzeCcsICcqLnZ1ZScsICcqLmphZGUnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIEphdmFTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFxzKlxcKFteKF0qP1xcKVxccypcXHsvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5qcyddLFxuICAgIGRlcGVuZGVuY2llczogWydDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIENvZmZlZVNjcmlwdDoge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHN8XFwufEApe3dvcmR9XFxzKls6PV1cXHMqKFxcKFteKF0qP1xcKSk/XFxzKls9LV0+LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouY29mZmVlJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIFR5cGVTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccyl7d29yZH1cXChbXihdKj9cXClcXHMqXFx7LyxcbiAgICAgIC8oXnxcXHN8XFwufEApe3dvcmR9XFxzKls6PV1cXHMqKFxcKFteKF0qP1xcKSk/XFxzKls9LV0+LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoudHMnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnXSxcbiAgfSxcblxuICBQeXRob246IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpZGVmXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5weSddLFxuICB9LFxuXG4gIFBIUDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpaW50ZXJmYWNlXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpdHJhaXRcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykoc3RhdGljXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxzKyk/KHN0YXRpY1xccyspP2Z1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccyljb25zdFxccyt7d29yZH0oXFxzfD18O3wkKS8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnBocCcsICcqLnBocDMnLCAnKi5waHRtbCddLFxuICB9LFxuXG4gIEFTUDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKShmdW5jdGlvbnxzdWIpXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5hc3AnXSxcbiAgfSxcblxuICBIYWNrOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykoc3RhdGljXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxzKyk/KHN0YXRpY1xccyspP2Z1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5oaCddLFxuICB9LFxuXG4gIFJ1Ynk6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpbW9kdWxlXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylkZWZcXHMrKD86c2VsZlxcLik/e3dvcmR9XFxzKlxcKD8vLFxuICAgICAgLyhefFxccylzY29wZVxccys6e3dvcmR9XFxzKlxcKD8vLFxuICAgICAgLyhefFxccylhdHRyX2FjY2Vzc29yXFxzKzp7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpYXR0cl9yZWFkZXJcXHMrOnt3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylhdHRyX3dyaXRlclxccys6e3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWRlZmluZV9tZXRob2RcXHMrOj97d29yZH1cXHMqXFwoPy8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnJiJywgJyoucnUnLCAnKi5oYW1sJywgJyouZXJiJywgJyoucmFrZSddLFxuICB9LFxuXG4gIFB1cHBldDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5wcCddLFxuICB9LFxuXG4gIEtSTDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKURFRlxccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpREVDTFxccytcXHcqP3t3b3JkfVxccyo9Py8sXG4gICAgICAvKF58XFxzKShTSUdOQUx8SU5UfEJPT0x8UkVBTHxTVFJVQ3xDSEFSfEVOVU18RVhUfFxccylcXHMqXFx3Knt3b3JkfS4qLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouc3JjJywgJyouZGF0J10sXG4gIH0sXG5cbiAgUGVybDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKXN1Ylxccyt7d29yZH1cXHMqXFx7LyxcbiAgICAgIC8oXnxcXHMpcGFja2FnZVxccysoXFx3Kzo6KSp7d29yZH1cXHMqOy8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnBtJywgJyoucGwnXSxcbiAgfSxcblxuICAnQy9DKysnOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3w6KS8sXG4gICAgICAvKF58XFxzKXN0cnVjdFxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKWVudW1cXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykjZGVmaW5lXFxzK3t3b3JkfShcXHN8XFwofCQpLyxcbiAgICAgIC8oXnxcXHMpZmlsZXNkZWZcXHMuKihcXHN8XFwqfFxcKCl7d29yZH0oXFxzfDt8XFwpfCQpLyxcbiAgICAgIC8oXnxcXHN8XFwqfDp8Jil7d29yZH1cXHMqXFwoLipcXCkoXFxzKnxcXHMqY29uc3RcXHMqKShcXHt8JCkvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5jJywgJyouY2MnLCAnKi5jcHAnLCAnKi5jeHgnLCAnKi5oJywgJyouaGgnLCAnKi5ocHAnLCAnKi5pbmMnXSxcbiAgfSxcblxuICBKYXZhOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3w6KS8sXG4gICAgICAvKF58XFxzKWludGVyZmFjZVxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKWVudW1cXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccyl7d29yZH1cXHMqXFwoLipcXCkoXFxzKikoXFx7fCQpLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouamF2YSddLFxuICB9LFxuXG4gIFNoZWxsOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFxzKlxcKFxcKVxccypcXHsvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5zaCddLFxuICB9LFxufTtcbiJdfQ==