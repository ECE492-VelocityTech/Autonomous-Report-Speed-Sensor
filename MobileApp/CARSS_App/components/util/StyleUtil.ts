import constants from "../Constants.js";

const StyleUtil = {
    darkMode: true,

    getColorProp: function(prop: string) {
        let prefix = this.darkMode ? "Dark" : "Light";
        return prefix + prop;
    },

    getBackgroundColor: function() {
        return {
            backgroundColor: this.darkMode ?
                constants.ThemeColor.DarkBackground : constants.ThemeColor.LightBackground
        }
    },

    getForegroundColor: function() {
        return {
            color: this.darkMode ?
                constants.ThemeColor.DarkForeground : constants.ThemeColor.LightForeground
        }
    },

    getBackgroundAndForegroundColor: function() {
        return {
            backgroundColor: this.darkMode ?
                constants.ThemeColor.DarkBackground : constants.ThemeColor.LightBackground,
            color: this.darkMode ?
                constants.ThemeColor.DarkForeground : constants.ThemeColor.LightForeground
        }
    },

    getButtonBackgroundColor: function() {
        return {
            backgroundColor: this.darkMode ?
                constants.ThemeColor.DarkButtonBackground : constants.ThemeColor.LightButtonBackground
        };
    },

    getTileBackground: function() {
        return {
            backgroundColor: this.darkMode ?
                constants.ThemeColor.DarkTileBackground : constants.ThemeColor.LightTileBackground
        }
    }
};

export default StyleUtil;

