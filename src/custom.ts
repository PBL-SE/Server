// custom.d.ts
console.log("Custom types loaded!");
declare namespace Express {
  export interface Request {
    user?: any;
  }
}
