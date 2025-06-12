export default function VerifyPermission({ children, expected, received, isExclude = false }) {
  if (!(expected instanceof Array)) {
    throw new Error("ERROR: expected should be an Array");
  }

  const isIncluded = expected.includes(received);

  if (isExclude) {
    return isIncluded ? null : children;
  }

  return isIncluded ? children : null;
}