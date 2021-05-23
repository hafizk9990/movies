module.exports = {
    select: function(selected, options) {
        let i = 0;
        for (i; i < selected.length; i++) {
    
            return options.fn(this).replace(new RegExp(' value=\"'+ selected[i] + '\"'), '$&selected="selected"');
            // this is for genre options (but works only for one of the options sadly)
        }
    },
    select2: function(selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
        // this is for videoQuality options
    }
}
