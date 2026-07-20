/** Standardized success envelope: { success, message, data, meta? }. */
export function success(res, data = null, message = "Success", statusCode = 200, meta) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created(res, data, message = "Created") {
  return success(res, data, message, 201);
}
