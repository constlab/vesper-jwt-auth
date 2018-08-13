"use strict";

const params = {
	type: "sqlite",
	database: "sample.sqlite",
	extra: {
		charset: "utf8mb4_unicode_ci"
	},
	synchronize: true,
	logging: false
};

module.exports = params;
