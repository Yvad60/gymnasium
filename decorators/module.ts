interface ModuleMetadata {
  controllers?: any[];
  providers?: any[];
  exports?: any[];
  imports?: any[];
}

function Module(metadata: ModuleMetadata) {
  return function (target: Function) {
    const metadataKeys = Object.keys(metadata);
    metadataKeys.forEach((key) => {
      Reflect.defineMetadata(key, metadata[key as keyof ModuleMetadata], target);
    });
  };
}

export default Module;
