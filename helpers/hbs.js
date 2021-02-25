const moment = require("moment");

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, "");
    },
    select: function (selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp(">" + selected + "</option>"),
                ' selected="selected"$&'
            );
    },
};
