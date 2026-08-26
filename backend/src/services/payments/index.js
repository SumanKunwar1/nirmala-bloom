import crypto from "crypto";
import config from "../../config/index.js";
import ApiError from "../../utils/ApiError.js";

import globalime from "./globalime.gateway.js";
import manual from "./manual.gateway.js";

/* ------------------------------------------------------------------ *
 * Gateway registry
 *
 * Adding another provider (eSewa, Khalti, Stripe, Fonepay…) is: write an
 * adapter exposing the same shape as globalime.gateway.js, import it, add
 * it to REGISTRY. No controller or route changes required.
 * ------------------------------------------------------------------ */

const REGISTRY = {
  [globalime.key]: globalime,
  [manual.key]: manual,
};

/** Every registered gateway, enabled or not. */
export function allGateways() {
  return Object.values(REGISTRY);
}

/** Only the gateways switched on in config. */
export function enabledGateways() {
  return allGateways().filter((g) => g.enabled);
}

/** Look up a gateway, falling back to the configured default. */
export function getGateway(key) {
  const wanted = String(key || config.payments.defaultGateway).toLowerCase().trim();
  const gateway = REGISTRY[wanted];

  if (!gateway) {
    throw ApiError.badRequest(
      `Unknown payment method "${wanted}". Available: ${enabledGateways().map((g) => g.key).join(", ")}`,
    );
  }
  if (!gateway.enabled) {
    throw ApiError.badRequest(`${gateway.label} is not currently accepting payments`);
  }
  return gateway;
}

/** Shape handed to the donate form so it can render the method picker. */
export function publicGatewayList() {
  return enabledGateways().map((g) => ({
    key: g.key,
    label: g.label,
    description: g.description,
    kind: g.kind,
    mode: g.mode,
    currencies: g.currencies,
    config: g.publicConfig ? g.publicConfig() : {},
  }));
}

/**
 * Merchant transaction reference: NF-<base36 time>-<random>.
 * Short enough for bank reference fields, unguessable enough to be used
 * as the public handle for a payment status lookup.
 */
export function generateReference(prefix = "NF") {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export default { getGateway, allGateways, enabledGateways, publicGatewayList, generateReference };
