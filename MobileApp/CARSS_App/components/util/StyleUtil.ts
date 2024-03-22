import constants from "../Constants.js";

const StyleUtil = {
    darkMode: true,

    getColorProp: function(prop: string) {
        let prefix = this.darkMode ? "Dark" : "Light";
        return prefix + prop;
    },

    getBackgroundColor: function() {
        return this.darkMode ? constants.ThemeColor.DarkBackground : constants.ThemeColor.LightBackground;
    },

    getForegroundColor: function() {
        return this.darkMode ? constants.ThemeColor.DarkForeground : constants.ThemeColor.LightForeground;
    },


};

export default StyleUtil;

