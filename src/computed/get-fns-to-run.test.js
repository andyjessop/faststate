// import mapDeps from './map-deps';
// import getFnsToRun from './get-fns-to-run';

// describe('mapDeps', () => {
//   test('should map functions', () => {
//     const path = [];

//     const computed = {
//       b: ['a', () => {}],
//       c: ['a', 'b', () => {}],
//     };

//     const {
//       callOrder,
//       isDependencyOf,
//       fns,
//     } = mapDeps([], computed);

//     const funcsToRun = getFnsToRun(path, callOrder, isDependencyOf, fns, { a: 1 });

//     expect(funcsToRun).toEqual([
//       computed.b.slice(-1)[0],
//       computed.c.slice(-1)[0],
//     ]);
//   });

//   test('should order functions to run in dependency order', () => {
//     const path = [];

//     const computed = {
//       b: ['a', () => {}],
//       c: ['a', 'b', () => {}],
//       d: ['a', () => {}],
//       e: ['b', 'd', () => {}],
//     };

//     const {
//       callOrder,
//       isDependencyOf,
//       fns,
//     } = mapDeps([], computed);

//     const funcsToRun = getFnsToRun(path, callOrder, isDependencyOf, fns, { a: 1 });

//     expect(funcsToRun).toEqual([
//       computed.b.slice(-1)[0],
//       computed.d.slice(-1)[0],
//       computed.c.slice(-1)[0],
//       computed.e.slice(-1)[0],
//     ]);
//   });
// });
