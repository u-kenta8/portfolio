import type { ComponentType } from "react";
import type { PostMeta } from "./types";
import Freshness, { meta as freshnessMeta } from "./freshness-architecture";
import Idempotency, {
  meta as idempotencyMeta,
} from "./idempotency-marketplace-orders";
import InventorySync, {
  meta as inventorySyncMeta,
} from "./multi-marketplace-inventory-sync";
import PhpToGo, { meta as phpToGoMeta } from "./php-to-go-idioms";
import SurveyPipeline, {
  meta as surveyPipelineMeta,
} from "./survey-data-pipeline";
import MultiTenant, { meta as multiTenantMeta } from "./multi-tenant-postgres";
import RestApi, { meta as restApiMeta } from "./rest-api-enterprise-patterns";
import Wholesale, { meta as wholesaleMeta } from "./b2b-wholesale-workflow";
import Subscription, {
  meta as subscriptionMeta,
} from "./subscription-cart-modeling";
import Mentoring, { meta as mentoringMeta } from "./mentoring-pr-reviews";
import Observability, {
  meta as observabilityMeta,
} from "./observability-data-pipelines";
import Dashboards, {
  meta as dashboardsMeta,
} from "./dashboards-server-vs-client";
import Webhooks, { meta as webhooksMeta } from "./webhook-reliability";
import Async, { meta as asyncMeta } from "./async-collaboration-japan";

export type LoadedPost = {
  meta: PostMeta;
  Component: ComponentType;
};

const posts: LoadedPost[] = [
  { meta: freshnessMeta, Component: Freshness },
  { meta: idempotencyMeta, Component: Idempotency },
  { meta: inventorySyncMeta, Component: InventorySync },
  { meta: phpToGoMeta, Component: PhpToGo },
  { meta: surveyPipelineMeta, Component: SurveyPipeline },
  { meta: multiTenantMeta, Component: MultiTenant },
  { meta: restApiMeta, Component: RestApi },
  { meta: wholesaleMeta, Component: Wholesale },
  { meta: subscriptionMeta, Component: Subscription },
  { meta: mentoringMeta, Component: Mentoring },
  { meta: observabilityMeta, Component: Observability },
  { meta: dashboardsMeta, Component: Dashboards },
  { meta: webhooksMeta, Component: Webhooks },
  { meta: asyncMeta, Component: Async },
];

// Newest first
posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export const allPosts = posts;

export function getPostBySlug(slug: string): LoadedPost | undefined {
  return posts.find((p) => p.meta.slug === slug);
}
