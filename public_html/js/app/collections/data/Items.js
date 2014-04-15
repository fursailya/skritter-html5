/**
 * @module Skritter
 * @submodule Collections
 * @param Item
 * @author Joshua McFarland
 */
define([
    'models/data/Item'
], function(Item) {
    /**
     * @class DataItems
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.schedule = [];
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method due
         * @param {Boolean} sort
         * @returns {Array}
         */
        due: function(sort) {
            if (sort)
                return this.sort().filter(function(item) {
                    return !item.held && item.readiness >= 1;
                });
            return this.schedule.filter(function(item) {
                return !item.held && item.readiness >= 1;
            });
        },
        /**
         * @method dueCount
         * @param {Boolean} sort
         * @returns {Number}
         */
        dueCount: function(sort) {
            return this.due(sort).length;
        },
        /**
         * @method insert
         * @param {Array|Object} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            skritter.storage.put('items', items, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('items', function(items) {
                self.add(items, {merge: true, silent: true, sort: false});
                callback();
            });
        },
        /**
         * @method loadSchedule
         * @param {Function} callback
         */
        loadSchedule: function(callback) {
            skritter.storage.getSchedule(skritter.user.settings.activeParts(), skritter.user.settings.style(), _.bind(function(schedule) {
                this.schedule = schedule;
                this.trigger('schedule:load');
                callback();
            }, this));
        },
        /**
         * @method next
         * @param {Function} callback         
         * @param {Array|String} filterIds
         * @returns {Backbone.Model}
         */
        next: function(callback, filterIds) {
            var i = 0;
            var schedule = this.schedule;
            if (filterIds) {
                filterIds = Array.isArray(filterIds) ? filterIds : [filterIds];
                schedule = schedule.filter(function(item) {
                    return filterIds.indexOf(item.id) !== -1;
                });
            }
            var load = function() {
                if (schedule[i]) {
                    skritter.user.data.loadItem(schedule[i].id, function(item) {
                        if (item) {
                            callback(item);
                        } else {
                            i++;
                            load();
                        }
                    });
                } else {
                    callback();
                }
            };
            load();
        },
        /**
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            var recent = skritter.user.data.reviews.recentIds();
            this.schedule = _.sortBy(this.schedule, function(item) {
                if (recent.indexOf(item.id) > -1) {
                    item.readiness = 0.00001;
                    return -item.readiness;
                }
                if (item.held && item.held > now) {
                    item.readiness = 0.2 + (now / item.held) * 0.1;
                    return -item.readiness;
                } else if (item.held) {
                    delete item.held;
                }
                if (!item.last && (item.next - now) > 600) {
                    item.readiness = 0.2;
                    return -item.readiness;
                }
                if (!item.last || (item.next - item.last) === 1) {
                    item.readiness = 99999999;
                    return -item.readiness;
                }
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                if (readiness > 0 && seenAgo > 9000) {
                    var dayBonus = 1;
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * skritter.fn.daysInSecond);
                    var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                    ageBonus *= readiness2 * readiness2;
                    readiness += ageBonus;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            this.trigger('schedule:sort');
            return this.schedule;
        },
        /**
         * @method updateSchedule
         * @param {Backbone.Model} item
         */
        updateSchedule: function(item) {
            //var now = skritter.fn.getUnixTime();
            var position = _.findIndex(this.schedule, {id: item.id});
            //update directly scheduled item 
            this.schedule[position] = {
                id: item.id,
                last: item.get('last'),
                next: item.get('next'),
                style: item.get('style')
            };
            //TODO: add better handling for indirectly related prompts
        }
    });

    return Items;
});