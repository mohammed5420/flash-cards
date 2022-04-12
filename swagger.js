exports.options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:" + process.env.PORT,
			},
		],
	},
	apis: ["./routes/*.js"],
};