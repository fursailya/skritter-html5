/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/mobile/prompts/prompt-rdng.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRdng
     * @extends {Prompt}
     */
    var PromptRdng = Prompt.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            Prompt.prototype.initialize.call(this, options, controller, review);
        },
        /**
         * @method render
         * @returns {PromptRdng}
         */
        render: function() {
            app.timer.setLimits(30, 15);
            this.$el.html(this.compile(DesktopTemplate));
            Prompt.prototype.render.call(this);
            this.canvas.hideGrid().hide();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRdng}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            this.elements.fieldQuestion.hide();
            this.elements.fieldReading.html(this.vocab.getReading(null, {
                style: app.user.settings.get('readingStyle')
            }));
            this.elements.fieldWriting.html(this.vocab.getWriting());
            if (app.user.settings.get('audio') && this.vocab.getAudio()) {
                app.assets.playAudio(this.vocab.getAudio());
            }
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRdng}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            this.elements.fieldQuestion.html(app.strings.prompt['reading-question']);
            this.elements.fieldWriting.html(this.vocab.getWriting());
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            Prompt.prototype.handlePromptClicked.call(this, event);
            if (this.review.getAt('answered')) {
                this.next();
            } else {
                this.renderAnswer();
            }
        },
        /**
         * @method resize
         * @returns {PromptRdng}
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.$el.css({
                    height: contentHeight,
                    width: contentWidth
                });
            } else {
                this.$el.css({
                    height: canvasSize,
                    width: contentWidth
                });
            }
            return this;
        }
    });

    return PromptRdng;
});
