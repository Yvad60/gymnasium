function Controller(path: string) {
  return function (target: Function) {
    Reflect.defineMetadata("__isController__", true, target);
    Reflect.defineMetadata("__controllerPath__", path, target);
  };
}
