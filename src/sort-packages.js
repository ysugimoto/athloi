const toposort = require('toposort');

module.exports = (reverse = false, packages = []) => {
	const packageNames = new Set(packages.map((pkg) => pkg.name));

	const edges = packages.reduce((edges, pkg) => {
		const localDependencies = pkg.allDependencies.filter((dependency) => {
			return packageNames.has(dependency);
		});

		return edges.concat(localDependencies.map((dependency) => [dependency, pkg.name]));
	}, []);

	const order = toposort.array(Array.from(packageNames), edges);

	if (reverse) {
		order.reverse();
	}

	return order.map((packageName) => {
		return packages.find((pkg) => pkg.name === packageName);
	});
};
