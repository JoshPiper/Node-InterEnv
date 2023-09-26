module.exports = {
	"branches": [
		"main",
		{
			"name": "refactor/rewrite",
			"prerelease": "alpha"
		}
	],
	"plugins": [
		[
			"@semantic-release/commit-analyzer", {
				"parserOpts": {
					"breakingHeaderPattern": /^(\w*)(?:\((.*)\))?!: (.*)$/
				},
				"releaseRules": [{
					"type": "*!",
					"release": "major"
				}, {
					"type": "build",
					"scope": "*deps",
					"release": "patch"
				}]
			}
		],
		"@semantic-release/release-notes-generator",
		"@semantic-release/npm",
		"@semantic-release/github"
	]
}
