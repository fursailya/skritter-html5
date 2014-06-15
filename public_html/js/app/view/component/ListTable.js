define([
    'require.text!template/component-list-table.html'
], function(template) {
    /**
     * @class VocabListsTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(template);
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
        }
    });

    return View;
});