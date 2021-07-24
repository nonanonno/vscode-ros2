export function isBuiltinType(name: string): boolean {
  return /(bool|byte|char|u?int(8|16|32|64)|float(32|64)|w?string)/.test(name);
}

export function isNamespacedType(name: string): boolean {
  return /.+\/.+/.test(name);
}

export function packageAndType(name: string) {
  const n = name.split('/');
  if (n.length !== 2) {
    return undefined;
  }
  return { pkg: n[0], type: n[1] };
}

export type TypeKind = 'builtin' | 'package' | 'this';

export function identifyTypeKind(name: string): TypeKind {
  if (isBuiltinType(name)) {
    return 'builtin';
  } else if (isNamespacedType(name)) {
    return 'package';
  } else {
    return 'this';
  }
}
