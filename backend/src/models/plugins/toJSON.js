/**
 * Normalizes document JSON output:
 *  - exposes `id` instead of `_id`
 *  - strips `__v` and any `password`
 */
export default function toJSON(schema) {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id?.toString?.() ?? ret._id;
      delete ret._id;
      delete ret.password;
      return ret;
    },
  });
}
