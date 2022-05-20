exports.options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Memofy API",
			version: "1.0.0",
			description: "Flash cards api",
		},
		servers: [
			{
				url: process.env.BASE_URI,
			},
		],
	},
	apis: ["./routes/*.js"],
};