import { nums } from './index';
import Papa from 'papaparse';

const csvData = Papa.parse(`
time,open,high,low,close,%K,%D
1636502400,43.66,120,43.66,73.82,NaN,NaN
1636588800,73.87,86.76,55.06,55.31,NaN,NaN
1636675200,55.38,64.94,50,54.65,NaN,NaN
1636761600,54.6,63.58,48,55.57,NaN,NaN
1636848000,55.58,62.49,53.2,56.21,NaN,NaN
1636934400,56.22,60.15,50.05,55.77,NaN,NaN
1637020800,55.75,55.94,47.91,48.17,NaN,NaN
1637107200,48.21,50.6,45.45,48.16,NaN,NaN
1637193600,48.14,50.94,40.05,41.31,NaN,NaN
1637280000,41.33,51.2,38.39,47.84,NaN,NaN
1637366400,47.8,49.69,44.51,46.78,NaN,NaN
1637452800,46.78,46.83,41.39,42.06,NaN,NaN
1637539200,42.06,47.13,39.86,40.97,NaN,NaN
1637625600,40.92,53,40.46,50.8,15.206469795368209,NaN
1637712000,50.8,51.21,45.84,49.17,22.28654124457308,NaN
1637798400,49.22,73,48.3,68.31,86.44900317827218,41.31400473940449
1637884800,68.24,77,55.1,59.51,54.70085470085469,54.47879970789998
1637971200,59.52,84,59.1,73.45,76.86910765183075,72.6729885103192
1638057600,73.45,76.69,65,76.15,82.78886209164658,71.452941481444
1638144000,76.14,82.75,69.5,70.21,69.76540232405172,76.47445735584301
1638230400,70.21,78.12,66,69.93,69.15150186362641,73.90192209310824
1638316800,69.98,74.91,63.21,64.81,57.92589344442008,65.61426587736607
1638403200,64.81,64.84,58.5,61.67,51.04143828107871,59.3729445297084
1638489600,61.68,63.29,50,54.24,32.57816039873131,47.18183070807671
1638576000,54.29,54.93,39,50.81,26.24444444444445,36.621347708084826
1638662400,50.79,54.74,45.47,49.3,22.888888888888882,27.237164577354886
1638748800,49.34,51.5,42,51.42,27.600000000000005,25.577777777777783
1638835200,51.46,53.99,48.62,50.69,25.977777777777774,25.48888888888889
1638921600,50.72,52.43,47,49.36,23.022222222222222,25.533333333333335
1639008000,49.37,50.72,44.69,44.97,13.266666666666664,20.755555555555556
1639094400,44.97,46.8,42.5,42.61,8.02222222222222,14.77037037037037
1639180800,42.6,49.28,41.55,47.48,19.382857142857134,13.557248677248673
1639267200,47.46,48.07,44.11,47.06,18.422857142857147,15.275978835978833
1639353600,47.07,47.1,39.36,39.96,2.4539877300613515,13.41990067192521
1639440000,39.99,41.71,37.74,39.85,5.676620930858219,8.851155267925572
1639526400,39.87,44.48,37.12,42.48,19.336219336219333,9.155609332379635
1639612800,42.43,48.01,42.27,44.34,27.588842185708845,17.5338941509288
1639699200,44.34,46.66,40.15,42.18,28.41100505334083,25.112022191756335
1639785600,42.15,44.5,40.58,42.62,31.214528944381378,29.071458727810352
1639872000,42.64,43.76,40.58,40.86,22.169531713100184,27.265021903607465
1639958400,40.82,41.64,37.31,40.39,19.383521043272097,24.255860566917885
1640044800,40.43,42.13,39.69,40.95,25.01632919660356,22.18979398432528
1640131200,40.94,46.18,40.71,45.14,58.97058823529414,34.456812825056595
1640217600,45.09,49.8,42.73,49.51,97.71293375394322,60.56661706194697
1640304000,49.52,49.59,44.7,45.65,67.27129337539434,74.6516051215439
1640390400,45.7,48.18,44.88,46.43,73.42271293375396,79.4689800210305
1640476800,46.41,47,43.51,45.68,67.50788643533124,69.40063091482651
1640563200,45.67,48.19,44.12,44.41,57.49211356466876,66.14090431125132
1640649600,44.42,44.44,39,39.7,20.34700315457418,48.449001051524725
1640736000,39.7,40.84,37.82,38.59,10.248198558847092,29.36243842603001
1640822400,38.6,41,38,39.06,14.011208967173745,14.868803560198337
1640908800,39.08,41.87,38.19,38.93,12.970376301040817,12.409927942353884
1640995200,38.96,40.4,38.72,40.18,22.978382706164922,16.653322658126495
1641081600,40.19,41.72,39.53,41.05,29.943955164131275,21.96423805711234
1641168000,41.06,41.14,38.38,39.26,12.02003338898162,21.64745708642594
1641254400,39.27,41.64,38.43,38.69,7.2621035058430525,16.408697352985314
1641340800,38.7,39.95,31.41,33.78,12.887438825448621,10.723191906757762
1641427200,33.8,34.48,31.5,33.16,9.625962596259605,9.925168309183759
1641513600,33.14,33.23,28.25,30.03,8.926780341023075,10.4800605875771
1641600000,30.05,30.86,26.43,27.74,6.020220588235289,8.190987841839322
1641686400,27.73,29.53,26.92,28.01,7.2610294117647145,7.402676780341025
1641772800,28.01,28.59,27.58,28.2,9.82787340366463,7.703041134554877
`.trim(), {
  header: true,
  dynamicTyping: true,
});

const low = nums(csvData.data.map((item: any) => item.low));
const high = nums(csvData.data.map((item: any) => item.high));
const close = nums(csvData.data.map((item: any) => item.close));

// const a = close.SKDJ(low, high, 9, 6, 6);
// console.log(a.D);

const a = close.SKDJ(low, high, 9, 6, 6, 6);
console.log(a.D);
