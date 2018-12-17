declare module 'catchify' {
  let catchify: (promise: any) => Promise<[Error, any]>;

  export default catchify;
}
