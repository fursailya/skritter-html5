define([], function() {
    /**
     * @class Prompt
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
        }
    });
    
    return View;
});