import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const api = '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';
const stripe = new Stripe(api, {
  // @ts-ignore - Ignoring API version mismatch
  apiVersion: '2023-08-16', // Using a supported API version
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId } = req.body;

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/analysis?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/#subscription-plans`,
      client_reference_id: userId,
      customer_email: req.body.email, // If you have the user's email
      metadata: {
        userId: userId,
      },
    });

    // Return the session ID
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
