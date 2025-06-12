import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const api = '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';
const stripe = new Stripe(api, {
  // @ts-ignore - Ignoring API version mismatch
  apiVersion: '2023-08-16', // Using a supported API version
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userId parameter' });
    }

    // Find the customer by metadata
    const customers = await stripe.customers.list({
      limit: 1,
      email: req.query.email as string, // If you have email
    });

    // If no customer found, user is not subscribed
    if (customers.data.length === 0) {
      return res.status(200).json({ isSubscribed: false });
    }

    const customerId = customers.data[0].id;

    // Find active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    // If no active subscriptions, user is not subscribed
    if (subscriptions.data.length === 0) {
      return res.status(200).json({ isSubscribed: false });
    }

    // Get subscription details - which plan they are on
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Map price ID to plan name (you would have a proper mapping)
    let plan = 'unknown';
    if (priceId.includes('basic')) plan = 'basic';
    else if (priceId.includes('pro')) plan = 'pro';
    else if (priceId.includes('premium')) plan = 'premium';

    // User has an active subscription
    return res.status(200).json({
      isSubscribed: true,
      plan,
      subscriptionId: subscription.id,
      // @ts-ignore - Stripe types might not include this property but it exists in the API response
      currentPeriodEnd: subscription.current_period_end as unknown as number,
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
}
