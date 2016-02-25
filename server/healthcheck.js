// Return a promise that resolves to a set of healthchecks
module.exports = function () {

	// You might have several async checks that you need to perform or
	// collect the results from, this is a really simplistic example
	return new Promise(function (resolve) {
		resolve([
			{
				name: 'TODO - create some healthchecks',
				ok: true,
				severity: 2,
				businessImpact: 'TODO',
				technicalSummary: 'TODO',
				panicGuide: 'TODO',
				checkOutput: 'TODO',
				lastUpdated: new Date().toISOString()
			}
		]);
	});
};
