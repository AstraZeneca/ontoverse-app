import {
  range as d3Range,
  interpolate as d3Interpolate,
  scaleLinear as d3ScaleLinear,
  rgb,
} from 'd3';


export const createGradientColorArray = (
  colorArray:string[]=['#ff0000', '#00ff00', '#0000ff' , '#FF00ff'], 
  gradientStepsCount:number=12
) : string[] => {
 
  // Create an array of interpolators for each adjacent pair of key colors
  const interpolators = colorArray.slice(0, -1).map((color, i) => {
    return d3Interpolate(color, colorArray[i + 1]);
  });

  const stepIndexToInterpolatorIndex = d3ScaleLinear()
    .domain([0, gradientStepsCount-1])
    .range([0, interpolators.length-1]).nice();

  const interpolatorsStepIndexes = d3Range(gradientStepsCount).reduce((acc, gradientStepIndex) => {
    const interpIndex = Math.round(stepIndexToInterpolatorIndex(gradientStepIndex));
    if ( !acc[interpIndex]) {
      acc[interpIndex] = {first: gradientStepIndex, last: -1, lastMinusFirst: -1};
    }
    acc[interpIndex].last = gradientStepIndex;
    return acc;
   }, [] as {first: number, last: number, lastMinusFirst: number}[]).map(it => {
    it.lastMinusFirst = it.last - it.first;
    return it;
  })

 //console.log('interpolatorsStepIndexes', interpolatorsStepIndexes);

  // Create an array of gradient colors by interpolating between key colors
  return d3Range(gradientStepsCount).map((gradientStepIndex) => {
    const interpolatorIndex = Math.round(stepIndexToInterpolatorIndex(gradientStepIndex));
    const currentInterpolatorStepIndexes = interpolatorsStepIndexes[interpolatorIndex];
    const interpolatorValue = (gradientStepIndex - currentInterpolatorStepIndexes.first)
                            / (currentInterpolatorStepIndexes.lastMinusFirst);//interpolator Value range is from 0 to 1.

    return rgb( interpolators[interpolatorIndex](interpolatorValue) ).formatHex();
  });
}



























// const cc = ['#084081', '#0b60a1', '#1d7eb7', '#399cc6', '#58b7cd', '#7bcbc4', '#9ed9bb', '#bde5bf', '#d3eece', '#e5f5df'];


// const multiHueResult = [
//   ["#cdece8","#cbebe6","#c8eae5","#c6e9e3","#c3e9e2","#c1e8e0","#bee7de","#bbe5dd","#b9e4db","#b6e3d9","#b3e2d8","#b0e1d6","#ade0d4","#aadfd2","#a7ddd0","#a4dcce","#a0dbcc","#9dd9ca","#9ad8c8","#97d7c6","#94d6c4","#91d4c2","#8ed3c0","#8ad2be","#87d0bc","#84cfb9","#81ceb7","#7eccb5","#7bcbb3","#78cab0","#75c8ae","#72c7ab","#6fc6a9","#6cc4a6","#6ac3a4","#67c2a1","#64c09f","#62bf9c","#5fbe99","#5dbc97","#5abb94","#58ba91","#55b88e","#53b78c","#51b689","#4eb486","#4cb383","#4ab180","#48b07d","#46ae7a","#43ad77","#41ab74","#3fa971","#3da76e","#3ba56c","#39a469","#37a266","#35a063","#339e60","#319c5d","#2f9a5a","#2e9858","#2c9655","#2a9352","#289150","#268f4d","#248d4b","#228b48","#208946","#1e8744","#1c8542","#1a8340","#18813e","#167f3c","#147d3b","#127c39","#107a37","#0e7736","#0d7534","#0b7333","#097131","#086f30","#076d2e","#066b2d","#05692c","#04662b","#036429","#026228","#025f27","#015d26","#015b25","#015824","#005622","#005321","#005120","#004e1f","#004c1e","#00491d","#00471c","#00441b"],
//   ["#c4d7e8","#c2d5e7","#c0d4e7","#bdd2e6","#bbd1e5","#b9cfe4","#b7cee3","#b5cce3","#b3cbe2","#b1c9e1","#afc8e0","#adc6df","#acc5de","#aac3de","#a8c1dd","#a6c0dc","#a4bedb","#a3bcda","#a1bad9","#a0b8d8","#9eb6d7","#9db4d6","#9bb2d5","#9ab0d4","#99aed3","#97acd1","#96aad0","#95a7cf","#94a5ce","#93a3cd","#92a0cb","#919eca","#919bc9","#9099c8","#8f96c6","#8f94c5","#8e91c4","#8e8fc3","#8d8cc1","#8d8ac0","#8d87bf","#8d85be","#8c82bc","#8c7fbb","#8c7dba","#8c7ab8","#8c77b7","#8c75b6","#8c72b5","#8c6fb3","#8b6db2","#8b6ab1","#8b68af","#8b65ae","#8b62ad","#8b60ac","#8a5daa","#8a5aa9","#8a58a8","#8a55a6","#8a52a5","#8950a4","#894da2","#894aa1","#88479f","#88459e","#88429c","#873f9a","#873c99","#873997","#863695","#863393","#853191","#852e90","#842b8e","#83288c","#832589","#822387","#812085","#7f1e83","#7e1b80","#7d197e","#7b177c","#791579","#771376","#751174","#730f71","#710e6e","#6e0c6c","#6b0b69","#690966","#660863","#630760","#60065d","#5d055a","#5a0457","#570354","#530251","#50014e","#4d004b"],
//   ["#cdebc9","#cbebc7","#caeac6","#c8e9c5","#c6e9c4","#c4e8c3","#c2e7c2","#c0e7c1","#bee6c0","#bce5bf","#bae4be","#b8e3bd","#b6e2bd","#b3e1bc","#b1e1bb","#afe0bb","#acdfbb","#aadeba","#a7ddba","#a5dcba","#a2dbba","#a0daba","#9dd9bb","#9bd8bb","#98d7bc","#95d6bc","#93d5bd","#90d4be","#8dd3be","#8ad1bf","#88d0c0","#85cfc1","#82cec2","#7fcdc3","#7ccbc4","#7acac4","#77c9c5","#74c7c6","#71c6c7","#6ec4c8","#6cc3c9","#69c1ca","#66c0ca","#64becb","#61bdcc","#5ebbcc","#5cb9cd","#59b8cd","#56b6cd","#54b4cd","#51b2cd","#4fb0cd","#4caecd","#4aaccc","#47aacc","#45a8cb","#43a5ca","#41a3c9","#3ea1c8","#3c9fc7","#3a9cc6","#389ac5","#3598c4","#3395c3","#3193c2","#2f91c1","#2d8ebf","#2a8cbe","#288abd","#2687bc","#2485bb","#2283b9","#2080b8","#1e7eb7","#1c7cb6","#1a7ab4","#1877b3","#1675b2","#1573b0","#1370af","#116ead","#106cab","#0f69a9","#0e67a8","#0d65a6","#0c62a4","#0b60a1","#0a5d9f","#0a5b9d","#09599b","#095698","#095496","#085193","#084f91","#084c8e","#084a8c","#084789","#084586","#084284","#084081"],
//   ["#fdd6a6","#fdd5a3","#fdd4a1","#fdd29f","#fdd19d","#fdcf9b","#fdce99","#fdcc97","#fdcb95","#fdc993","#fdc792","#fdc690","#fdc48e","#fdc28c","#fdc08a","#fdbe88","#fdbd86","#fdba84","#fdb882","#fdb680","#fdb47e","#fdb17b","#fdaf79","#fdad77","#fdaa74","#fca772","#fca570","#fca26d","#fca06b","#fc9d69","#fc9a67","#fb9764","#fb9562","#fb9260","#fa8f5e","#fa8d5c","#f98a5b","#f98759","#f88557","#f88256","#f78054","#f67d53","#f57a51","#f57850","#f4754e","#f3724d","#f2704c","#f16d4a","#f06a48","#ef6747","#ee6545","#ed6243","#ec5f41","#ea5c3f","#e9593d","#e8563b","#e65339","#e55037","#e44c35","#e24932","#e14630","#df432e","#dd402c","#dc3d29","#da3a27","#d83625","#d63322","#d53020","#d32d1e","#d12a1c","#cf271a","#cd2418","#cb2116","#c81e14","#c61b12","#c41910","#c2160e","#bf140d","#bd110b","#ba0f0a","#b80d08","#b50b07","#b30906","#b00805","#ad0604","#aa0503","#a80403","#a50302","#a20302","#9f0201","#9c0101","#980101","#950100","#920000","#8f0000","#8c0000","#890000","#850000","#820000","#7f0000"],
//   ["#d7bfdd","#d7bcdc","#d6badb","#d5b8d9","#d4b5d8","#d3b3d7","#d2b1d6","#d1aed5","#d1acd3","#d0a9d2","#d0a7d1","#cfa5d0","#cfa2ce","#cea0cd","#ce9dcc","#ce9bcb","#ce98c9","#ce96c8","#ce93c7","#cf91c6","#cf8ec4","#d08bc3","#d089c1","#d186c0","#d283bf","#d380bd","#d47dbc","#d57aba","#d677b9","#d774b7","#d871b5","#d96eb4","#da6bb2","#db68b0","#dc64ae","#dd61ad","#de5eab","#df5aa9","#e057a7","#e054a4","#e150a2","#e14da0","#e2499e","#e2469b","#e24399","#e34097","#e33c94","#e33991","#e2368f","#e2348c","#e23189","#e12e87","#e12c84","#e02981","#df277e","#de257b","#dd2378","#dc2175","#da2072","#d91e70","#d71c6d","#d51b6a","#d41967","#d21865","#cf1662","#cd1560","#cb145d","#c9135b","#c61159","#c31057","#c10f55","#be0e53","#bb0c51","#b80b50","#b50a4e","#b2094d","#af084b","#ac0749","#a80648","#a50646","#a20545","#9f0443","#9c0442","#980340","#95023e","#92023c","#8f023b","#8c0139","#890137","#860135","#820133","#7f0031","#7c002e","#79002c","#76002a","#730028","#700026","#6d0023","#6a0021","#67001f"],
//   ["#dcf1a6","#d9f0a5","#d7efa4","#d5eea2","#d3eda1","#d0eca0","#ceeb9e","#cbea9d","#c9e99c","#c6e89a","#c3e799","#c1e598","#bee496","#bbe395","#b8e294","#b5e192","#b3df91","#b0de90","#addd8e","#aadc8d","#a7da8c","#a3d98b","#a0d889","#9dd688","#9ad587","#97d385","#94d284","#90d183","#8dcf81","#8ace80","#87cc7e","#83cb7d","#80c97c","#7dc87a","#79c679","#76c577","#73c376","#6fc174","#6cc072","#69be71","#65bd6f","#62bb6d","#5fb96c","#5cb76a","#58b668","#55b467","#52b265","#4fb063","#4cae62","#4aac60","#47aa5e","#44a85d","#42a65b","#3fa459","#3da258","#3aa056","#389d55","#369b53","#349951","#329750","#30954e","#2e924d","#2c904b","#2a8e4a","#288c49","#268a47","#248746","#228545","#208344","#1e8143","#1c7f42","#1a7d41","#187b40","#167a3f","#14783e","#12763d","#10743c","#0e723b","#0d703b","#0b6e3a","#096c39","#086a38","#076937","#066737","#056536","#046335","#036134","#025f33","#025d32","#015a32","#015831","#015630","#00542f","#00522e","#00502d","#004e2c","#004c2c","#00492b","#00472a","#004529"],
//   ["#feda7c","#fed879","#fed677","#fed474","#fed371","#fed16f","#fecf6c","#fecc6a","#feca67","#fec865","#fec662","#fec460","#fec15e","#febf5b","#febd59","#feba57","#feb855","#feb653","#feb351","#feb14f","#feaf4e","#feac4c","#feaa4a","#fea749","#fea548","#fea346","#fea045","#fd9e44","#fd9b43","#fd9842","#fd9640","#fd933f","#fd903e","#fd8d3d","#fd8a3c","#fd873b","#fd843a","#fd8139","#fd7d38","#fd7a37","#fd7636","#fc7335","#fc6f34","#fc6c33","#fc6832","#fb6430","#fb612f","#fa5d2e","#fa592d","#f9562c","#f8522b","#f84e2a","#f74b29","#f64728","#f54427","#f44127","#f23d26","#f13a25","#f03724","#ee3423","#ed3123","#eb2e22","#ea2b22","#e82821","#e62521","#e42320","#e22020","#e01e20","#de1b20","#dc1920","#da1720","#d81520","#d61320","#d41121","#d10f21","#cf0e21","#cc0c22","#ca0b22","#c70923","#c40823","#c20723","#bf0624","#bc0524","#b90424","#b60325","#b20325","#af0225","#ac0225","#a80125","#a50126","#a10126","#9e0126","#9a0026","#970026","#930026","#8f0026","#8b0026","#880026","#840026","#800026"]
// ];


// const singleHueResult = [
//   ["#c8ddef","#c6dcef","#c4dbee","#c2daed","#c0d9ed","#bed8ec","#bbd7eb","#b9d6eb","#b7d5ea","#b5d4e9","#b2d3e8","#b0d1e7","#add0e7","#abcfe6","#a8cee5","#a5cde4","#a3cbe3","#a0cae3","#9dc9e2","#9ac7e1","#98c6e0","#95c4df","#92c3df","#8fc1de","#8cc0dd","#89bedd","#86bcdc","#83bbdb","#80b9da","#7db7da","#7ab6d9","#77b4d8","#74b2d7","#71b1d6","#6eafd6","#6badd5","#68abd4","#66aad3","#63a8d2","#60a6d1","#5ea4d0","#5ba3cf","#58a1ce","#569fcd","#539dcc","#519ccc","#4e9acb","#4c98ca","#4996c9","#4794c7","#4592c6","#4290c5","#408fc4","#3e8dc3","#3c8bc2","#3a89c1","#3787c0","#3585bf","#3383be","#3181bd","#2f7fbc","#2d7dbb","#2b7bba","#2979b8","#2777b7","#2675b6","#2473b5","#2271b3","#206fb2","#1e6db1","#1d6baf","#1b69ae","#1967ac","#1865ab","#1663a9","#1561a8","#145fa6","#125da4","#115ba2","#1059a0","#0f579e","#0e559c","#0d539a","#0c5198","#0b4f95","#0b4d93","#0a4b90","#0a488e","#09468b","#094488","#094286","#094083","#083e80","#083c7d","#083a7a","#083877","#083674","#083471","#08326e","#08306b"],
//   ["#caeac4","#c8e9c2","#c6e9c0","#c4e8be","#c2e7bb","#c0e6b9","#bee5b7","#bbe4b5","#b9e3b3","#b7e2b0","#b4e1ae","#b2e0ac","#b0dfaa","#addea7","#abdda5","#a8dca3","#a6dba0","#a3da9e","#a1d99c","#9ed79a","#9cd697","#99d595","#96d493","#94d390","#91d18e","#8ed08c","#8bcf8a","#89ce88","#86cc85","#83cb83","#80ca81","#7dc87f","#7ac77d","#77c57b","#74c479","#72c377","#6fc175","#6cc073","#68be72","#65bd70","#62bb6e","#5fba6c","#5cb86b","#5ab769","#57b567","#54b366","#51b264","#4eb063","#4bae61","#49ad60","#46ab5e","#44a95d","#41a75b","#3fa65a","#3ca458","#3aa257","#38a055","#369e54","#349c52","#329a51","#30984f","#2e964e","#2c954c","#2a934b","#289149","#268f47","#248d46","#228b44","#208943","#1e8741","#1c8540","#1a833e","#18813d","#167f3b","#147d3a","#127b38","#107937","#0e7735","#0d7534","#0b7333","#097131","#086f30","#076d2e","#066b2d","#05692c","#04662b","#036429","#026228","#025f27","#015d26","#015b25","#015824","#005622","#005321","#005120","#004e1f","#004c1e","#00491d","#00471c","#00441b"],
//   ["#fdd2a7","#fdd0a4","#fdcea1","#fdcd9e","#fdcb9b","#fdc998","#fdc794","#fdc591","#fdc38e","#fdc18b","#fdbf87","#fdbd84","#fdbb81","#fdb97e","#fdb77a","#fdb577","#fdb374","#fdb171","#fdaf6e","#fdad6a","#fdab67","#fda964","#fda761","#fda55e","#fda35b","#fda058","#fd9e55","#fd9c52","#fd9a4f","#fc984c","#fc964a","#fc9447","#fc9244","#fc9041","#fb8e3e","#fb8b3c","#fa8939","#fa8736","#f98534","#f98331","#f8812e","#f87e2c","#f77c29","#f67a27","#f57825","#f57622","#f47320","#f3711e","#f26f1c","#f16d1a","#f06b18","#ef6916","#ed6714","#ec6413","#eb6211","#ea6010","#e85e0e","#e75c0d","#e55a0c","#e4580b","#e25609","#e05408","#de5308","#dd5107","#db4f06","#d84d05","#d64c05","#d44a04","#d24904","#cf4703","#cc4603","#ca4403","#c74303","#c44203","#c24002","#bf3f02","#bc3e02","#b93d02","#b63c02","#b33b02","#b03a03","#ad3803","#aa3703","#a83603","#a53503","#a23403","#9f3303","#9d3203","#9a3103","#983003","#952f03","#932f03","#902e04","#8e2d04","#8b2c04","#892b04","#862a04","#842904","#812804","#7f2704"],
//   ["#dcdcec","#dadaeb","#d9d9ea","#d7d7ea","#d6d6e9","#d4d4e8","#d2d2e7","#d1d1e6","#cfcfe5","#cdcde4","#cbcce4","#cacae3","#c8c8e2","#c6c6e1","#c4c4e0","#c2c3df","#c0c1de","#bfbfdd","#bdbddc","#bbbbda","#b9b9d9","#b7b7d8","#b5b5d7","#b3b3d6","#b2b1d5","#b0aed4","#aeacd3","#acaad1","#aaa8d0","#a8a6cf","#a6a4ce","#a5a2cd","#a3a0cc","#a19ecb","#9f9cca","#9d9ac8","#9b98c7","#9996c6","#9894c5","#9692c4","#9490c3","#928ec2","#908cc1","#8e8ac1","#8d88c0","#8b86bf","#8984bd","#8782bc","#8680bb","#847eba","#827cb9","#817ab8","#7f77b7","#7e75b6","#7c73b4","#7b70b3","#796eb2","#786bb1","#7669af","#7566ae","#7363ad","#7261ab","#715eaa","#6f5ba9","#6e59a7","#6c56a6","#6b53a5","#6a51a3","#684ea2","#674ba1","#66499f","#64469e","#63439d","#61419b","#603e9a","#5f3c99","#5d3998","#5c3696","#5b3495","#593194","#582f93","#572c92","#552a90","#54278f","#53258e","#51228d","#50208c","#4f1d8b","#4d1b89","#4c1888","#4b1687","#491386","#481185","#470f84","#460c83","#440a81","#430780","#42057f","#40027e","#3f007d"],
//   ["#fcc0a8","#fcbda5","#fcbba2","#fcb99f","#fcb69c","#fcb499","#fcb196","#fcaf93","#fcac90","#fcaa8d","#fca78b","#fca588","#fca285","#fca082","#fc9d7f","#fc9b7c","#fc987a","#fc9677","#fc9374","#fc9171","#fc8e6f","#fc8c6c","#fc896a","#fc8767","#fc8464","#fb8262","#fb7f5f","#fb7c5d","#fb7a5b","#fb7758","#fb7556","#fa7253","#fa6f51","#fa6d4f","#f96a4d","#f9674b","#f96548","#f86246","#f75f44","#f75c42","#f65a40","#f6573e","#f5543d","#f4513b","#f34f39","#f24c37","#f14936","#f04634","#ef4432","#ed4131","#ec3f2f","#ea3c2e","#e93a2d","#e7372b","#e5352a","#e43229","#e23028","#e02e27","#de2c26","#dc2a25","#da2824","#d82623","#d52422","#d32221","#d12020","#cf1f1f","#cc1d1f","#ca1c1e","#c81b1d","#c51a1d","#c3181c","#c1171b","#be161b","#bc151a","#b9151a","#b71419","#b41319","#b21218","#af1217","#ac1117","#aa1016","#a70f16","#a40f15","#a10e15","#9d0d14","#9a0c14","#970c13","#930b13","#900a12","#8c0912","#890811","#850711","#820610","#7e0610","#7a050f","#76040f","#73030e","#6f020e","#6b010d","#67000d"]
// ];