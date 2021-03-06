'use strict';

var async = require('async');
var _ = require('lodash');

var posts = require('../posts');
var db = require('../database');

module.exports = function (Categories) {
	Categories.getActiveUsers = function (cids, callback) {
		if (!Array.isArray(cids)) {
			cids = [cids];
		}
		async.waterfall([
			function (next) {
				db.getSortedSetRevRange(cids.map(cid => 'cid:' + cid + ':pids'), 0, 24, next);
			},
			function (pids, next) {
				posts.getPostsFields(pids, ['uid'], next);
			},
			function (posts, next) {
				var uids = _.uniq(posts.map(post => post.uid).filter(uid => uid));

				next(null, uids);
			},
		], callback);
	};
};
