// ? auto binding (this) decorator for methods
export const BindThis = (
  target: any,
  methodName: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor => ({
  configurable: true,
  enumerable: false,
  get() {
    return descriptor.value.bind(this);
  },
});
