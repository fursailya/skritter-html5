/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/prompt-toolbar.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class PromptToolbar
     * @extends GelatoComponent
     */
    var PromptToolbar = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptToolbar}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .option-eraser': 'handleClickOptionEraser',
            'vclick .option-reveal': 'handleClickOptionReveal'
        },
        /**
         * @method handleClickOptionEraser
         * @param {Event} event
         */
        handleClickOptionEraser: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickOptionReveal
         * @param {Event} event
         */
        handleClickOptionReveal: function(event) {
            event.preventDefault();
        },
        /**
         * @method resize
         * @returns {PromptToolbar}
         */
        resize: function() {
            return this;
        }
    });

    return PromptToolbar;

});