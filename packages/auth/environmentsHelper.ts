import { db } from "@acme/db-drizzle/client";
import { and, count, eq } from '@acme/db-drizzle';
import { Environment, User, NotificationSource, Network, NotificationSourceType, NotificationSourceStatus } from "@acme/db-drizzle/schema"; 


export async function createEnvironment(input: { name: string; type: string }, organizationId: string, userId: string): Promise<typeof Environment> {
  const [environment] = await db.insert(Environment).values({
    name: input.name,
    type: input.type,
    network: input.type === "production" ? Network.enumValues[0] : Network.enumValues[1],
    organizationId: organizationId,
  }).returning();
  if(!environment) throw new Error('Failed to create environment');


  // Retrieve user email
  const user = await db.query.User.findFirst({
    columns: { email: true },
    where: eq(User.id, userId),
  });

  // Create a notification source if user email exists
  if (user?.email) {
    await createNotificationSource(environment.id, user.email);
  }

  return environment;
}


export async function createNotificationSource(
  environmentId: string,
  email_address = ""
) {
  // Count existing email notification sources
  const emailSourceCount = await db.select({ count: count() })
    .from(NotificationSource)
    .where(
      and(
        eq(NotificationSource.environmentId, environmentId),
        eq(NotificationSource.type, 'EMAIL')
      )
    )
    .then(result => Number(result[0]!.count));

  // Create new notification source
  const notificationSource = await db.insert(NotificationSource)
    .values({
      name: `Email source ${emailSourceCount + 1}`,
      email_address: email_address,
      type: 'EMAIL',
      status: 'ACTIVE',
      environmentId: environmentId,
    })
    .returning();

  return notificationSource[0];
}
