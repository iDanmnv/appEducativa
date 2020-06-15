import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.blue.darken1,
                secondary: colors.purple.darken1,
                accent: colors.shades.black,
                error: colors.red.darken1,
                success: colors.green.darken1,
                warning: colors.amber.accent3,
                info: colors.lightBlue.lighten2
            },
            dark: {
                primary: colors.teal.darken3,
                secondary: colors.yellow.darken1,
                accent: colors.shades.black,
                error: colors.red.darken1,
                success: colors.green.darken1,
                warning: colors.amber.accent3,
                info: colors.lightBlue.lighten2
            },
        }
    }
});
